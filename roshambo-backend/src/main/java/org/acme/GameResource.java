package org.acme;

import java.time.Duration;

import org.acme.detector.Shape;
import org.acme.detector.ShapeDetectorService;
import org.acme.game.ScoreInformation;
import org.acme.game.UserGenerator;
import org.acme.game.UsersInformation;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.reactive.messaging.Channel;

import io.quarkus.runtime.Startup;
import io.smallrye.mutiny.Multi;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;

import org.jboss.logging.Logger;
import org.jboss.resteasy.reactive.RestStreamElementType;



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

    @Channel("next-round") Multi<String> nextRoundStream;

    @Inject
    UserGenerator userGenerator;

    @Inject
    ShapeDetectorService shapeDetectorService;

    @Inject
    ScoreInformation scoreInformation;

    @Inject
    UsersInformation usersInformation;

    @GET
    @Path("/stream")
    @Produces(MediaType.SERVER_SENT_EVENTS)
    @RestStreamElementType(MediaType.APPLICATION_JSON)
    public Multi<String> stream() {
        return nextRoundStream;
    }

    @GET
    @Path("/init")
    public Configuration configuration() {
        Configuration conf = new Configuration(roundTimeInSeconds.getSeconds(), timeBetweenRoundsInSeconds.getSeconds(), numberOfRounds);
        logger.infof("App Configured with Round Time: %d - Time Between Rounds: %d - Number of Rounds: %d - Manual next Round: %s", conf.roundTimeInSeconds, conf.roundTimeInSeconds, conf.numberOfRounds, manualRounds);
        return conf;
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
    @Consumes(MediaType.APPLICATION_OCTET_STREAM)
    public ShotResult shot(@PathParam("userId") int userId, @PathParam("team") int team, byte[] image) {
        long responseTime = calculateResponseTime();
        
        final Shape shape = shapeDetectorService.detect(image);
        logger.infof("Detected %s by team %d for the user %d", shape.name(), team, userId);
        
        this.scoreInformation.incrementShape(team, shape);
        this.usersInformation.increasePlayedTime(userId, Duration.ofMillis(responseTime));
        return new ShotResult(responseTime, shape);
    }

    @POST
    @Path("/detect/button/{team}/{userId}/{shape}")
    public ShotResult click(@PathParam("userId") int userId, @PathParam("team") int team, @PathParam("shape") String shape) {
        long responseTime = calculateResponseTime();
        
        Shape valueOfShape = Shape.valueOf(shape);
        logger.infof("Pushed %s by team %d for the user %d", shape, team, userId);
        
        this.scoreInformation.incrementShape(team, valueOfShape);
        this.usersInformation.increasePlayedTime(userId, Duration.ofMillis(responseTime));
        return new ShotResult(responseTime, valueOfShape);
    }

    private long calculateResponseTime() {
        return System.currentTimeMillis() - this.scoreInformation.getStartRoundTime();
    }

    @Inject
    Logger logger;

}
