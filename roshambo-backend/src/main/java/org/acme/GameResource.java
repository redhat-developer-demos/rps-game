package org.acme;

import io.quarkus.runtime.LaunchMode;
import java.time.Duration;
import java.util.UUID;

import org.acme.detector.AiConnector;
import org.acme.detector.MLShapeDetectorService;
import org.acme.detector.RandomShapeDetectorService;
import org.acme.detector.Shape;
import org.acme.detector.ShapeDetectorService;
import org.acme.dto.CurrentUserShapeDTO;
import org.acme.dto.ServerSideEventDTO;
import org.acme.game.S3Uploader;
import org.acme.game.ScoreInformation;
import org.acme.game.UserGenerator;
import org.acme.game.UsersInformation;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;

import io.quarkus.runtime.Startup;
import io.smallrye.mutiny.Multi;
import jakarta.annotation.PostConstruct;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import org.eclipse.microprofile.rest.client.inject.RestClient;
import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.RestStreamElementType;
import org.jboss.resteasy.reactive.RestResponse.ResponseBuilder;

@ApplicationScoped
@Path("/game")
@Startup
public class GameResource {

    @ConfigProperty(name = "roshambo.round-time")
    Duration roundTimeInSeconds;

    @ConfigProperty(name = "roshambo.time-between-rounds")
    Duration timeBetweenRoundsInSeconds;

    @ConfigProperty(name = "roshambo.number-of-rounds")
    int numberOfRounds;

    @ConfigProperty(name = "roshambo.manual-rounds")
    boolean manualRounds;

    @ConfigProperty(name= "roshambo.upload-s3")
    boolean uploadToS3;

    @ConfigProperty(name = "roshambo.enable.camera")
    boolean enableCamera;

    @Channel("next-round") Multi<String> nextRoundStream;

    @Channel("status") Emitter<String>  statusStream;

    @Inject
    State state;

    static String gameUUId = UUID.randomUUID().toString();

    @Inject
    UserGenerator userGenerator;

    @Inject
    ScoreInformation scoreInformation;

    @Inject
    UsersInformation usersInformation;

    @Inject
    S3Uploader s3;

    @RestClient
    AiConnector connector;

    ShapeDetectorService shapeDetectorService;

    @PostConstruct
    public void init() {
        if (LaunchMode.current() == LaunchMode.NORMAL || LaunchMode.current() == LaunchMode.TEST) {
            logger.info("AI shape detector configured.");
            shapeDetectorService = new MLShapeDetectorService(connector);
        } else {
            logger.info("Random shape detector configured.");
            shapeDetectorService = new RandomShapeDetectorService();
        }

        logger.infof("Camera feature enabled? %s", enableCamera);
    }

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.APPLICATION_JSON)
    public Multi<String> stream() {
        return nextRoundStream;
    }

    @GET
    @Path("/state")
    public State  currentState() {
        return state;
    }

    @GET
    @Path("/init")
    public Initialization configuration() {
        state.setManualRounds(manualRounds);
        Configuration conf = new Configuration(roundTimeInSeconds.getSeconds(), timeBetweenRoundsInSeconds.getSeconds(), numberOfRounds,
            enableCamera, gameUUId);
        logger.infof("App Configured with Round Time: %d - Time Between Rounds: %d - Number of Rounds: %d - Manual next Round: %s - Camera Enabled: %s - Game UUID: %s", conf.roundTimeInSeconds, conf.roundTimeInSeconds, conf.numberOfRounds, manualRounds, conf.enableCamera, gameUUId);
        return new Initialization(conf, state);
    }

    @GET
    @Path("/assign")
    public User assignNameAndTeam() {
        User user = this.userGenerator.getUser();
        logger.infof("User: %s registered at team: %d", user.name, user.team);
        usersInformation.addUser(user);
        return user;
    }

    // Bean validation team number
    @POST
    @Path("/detect/shot/{team}/{userId}")
    @Consumes(MediaType.TEXT_PLAIN)
    public RestResponse<Object> shot(@PathParam("userId") int userId, @Min(1) @Max(2) @PathParam("team") int team, String image) {
        if (enableCamera) {
            long responseTime = calculateResponseTime();

            if (image.startsWith("data:image/png;base64,")) {
                // Images are uploaded as base64 strings, e.g: data:image/png;base64,$DATA
                // We need to strip the metadata before the comma, and convert to binary
                String[] imageDataPortions = image.split(",");
                String imageBase64 = imageDataPortions[1];

                if (uploadToS3) {
                    s3.uploadImage(imageBase64);
                }

                final Shape shape = shapeDetectorService.detect(imageBase64);
                logger.infof("Detected %s by team %d for the user %d", shape.name(), team, userId);

                this.afterDetection(shape, team, userId, responseTime);
                return ResponseBuilder.create(200).entity(new ShotResult(responseTime, shape)).build();
            } else {
                return ResponseBuilder.create(RestResponse.Status.BAD_REQUEST)
                    .entity("expected a base64 encoded png image, e.g data:image/png;base64,$DATA")
                    .build();
            }
        } else {
            return ResponseBuilder.create(RestResponse.Status.BAD_REQUEST)
                .entity("Camera version is not enabled yet")
                .build();
        }
    }

    @POST
    @Path("/detect/button/{team}/{userId}/{shape}")
    public ShotResult click(@PathParam("userId") int userId, @Min(1) @Max(2) @PathParam("team") int team, @PathParam("shape") String shape) {
        long responseTime = calculateResponseTime();
        
        Shape valueOfShape = Shape.valueOf(shape);
        logger.infof("Pushed %s by team %d for the user %d", shape, team, userId);
        
        this.afterDetection(valueOfShape, team, userId, responseTime);
        
        return new ShotResult(responseTime, valueOfShape);
    }

    private void afterDetection(Shape shape, int team, int userId, long responseTime) {
        this.scoreInformation.incrementShape(team, shape);
        this.usersInformation.increasePlayedTime(userId, Duration.ofMillis(responseTime));

        final User u = this.usersInformation.findUserById(userId);
        this.sendToAdmin(new ServerSideEventDTO("usershape", CurrentUserShapeDTO.of(u.name, shape)));

    }

    void sendToAdmin(ServerSideEventDTO serverSideEventDTO) {
        if (statusStream.hasRequests()) {
            Jsonb jsonb = JsonbBuilder.create();
            String result = jsonb.toJson(serverSideEventDTO);
            statusStream.send(result);
        }
    }

    private long calculateResponseTime() {
        return System.currentTimeMillis() - this.scoreInformation.getStartRoundTime();
    }

    @Inject
    Logger logger;

}
