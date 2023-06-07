package org.acme;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.time.Duration;
import java.util.Date;

import org.acme.dto.ResultDescriptionDTO;
import org.acme.dto.ServerSideEventDTO;
import org.acme.dto.ServerSideEventMessage;
import org.acme.game.ResultDescription;
import org.acme.game.ScoreInformation;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.reactive.messaging.Channel;
import org.eclipse.microprofile.reactive.messaging.Emitter;
import org.jboss.logging.Logger;
import org.quartz.Job;
import org.quartz.JobDetail;
import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;

import io.quarkus.arc.Arc;
import io.smallrye.reactive.messaging.annotations.Broadcast;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

@ApplicationScoped
// This class controlls the timing of when user can play and when not, starting the game, stopping
public class PlayBlockerAsyncResource {
    
    @Channel("next-round") @Broadcast Emitter<String>  nextRoundStream;

    @ConfigProperty(name = "roshambo.round-time")
    Duration roundTimeInSeconds;

    @ConfigProperty(name = "roshambo.time-between-rounds")
    Duration timeBetweenRoundsInSeconds;

    @ConfigProperty(name = "roshambo.number-of-rounds")
    int numberOfRounds;

    @Inject
    Scheduler quartz;

    @Inject
    ScoreInformation scoreInformation;

    public void startRound() {
        this.sendStartRound();
        scoreInformation.setStartRoundTime(System.currentTimeMillis());
        this.controlStop();
    }

    public void stopRound() {
        // Calculate winners
        ResultDescription winner = scoreInformation.winner();
        // Reset statistics for the next game
        scoreInformation.newRound();
        // Send results with the event
        this.sendEndOfTimeRound(winner);
        // Check if end game
        if (stillRoundsToPlay()) {
            this.controlStart();
        } else {
            this.scoreInformation.reset();
            this.sendEndOfGame();
        }
    }

    private boolean stillRoundsToPlay() {
        return this.scoreInformation.getCurrentRound() < this.numberOfRounds;
    }

    private void controlStop() {
        final JobDetail job = newJob(SendEndOfTimeRound.class)
                                .withIdentity("endOfTime", "roshambo")
                                .build();

        final Date triggerDate = new Date(System.currentTimeMillis() + roundTimeInSeconds.toMillis());
        final Trigger trigger = newTrigger()
                                        .withIdentity("stopTrigger", "roshambo")
                                        .startAt(triggerDate)
                                        .build();
        try {
            quartz.scheduleJob(job, trigger);
        } catch (SchedulerException e) {
            throw new IllegalStateException(e);
        }
    }

    private void controlStart() {
        final JobDetail job = newJob(SendStartRound.class)
                                .withIdentity("startRound", "roshambo")
                                .build();

        final Date triggerDate = new Date(System.currentTimeMillis() + timeBetweenRoundsInSeconds.toMillis());
        final Trigger trigger = newTrigger()
                        .withIdentity("startTrigger", "roshambo")
                        .startAt(triggerDate)
                        .build();
        try {
            quartz.scheduleJob(job, trigger);
        } catch (SchedulerException e) {
            throw new IllegalStateException(e);
        }
    }

    // SSE event
    public void sendStartRound() {
        logger.info("Sending Start Round");
        this.sendToGamers(new ServerSideEventDTO("enable", new ServerSideEventMessage(){}));
    }

    // SSE event
    public void sendEndOfTimeRound(ResultDescription winner) {
        logger.info("Sending Stop Round");
        this.sendToGamers(new ServerSideEventDTO("disable", ResultDescriptionDTO.of(winner)));
    }

    // SSE event
    public void sendEndOfGame() {
        logger.info("Sending End Of Game");
        this.sendToGamers(new ServerSideEventDTO("end", new ServerSideEventMessage(){}));
    }

    void sendToGamers(ServerSideEventDTO serverSideEventDTO) {
        Jsonb jsonb = JsonbBuilder.create();
        String result = jsonb.toJson(serverSideEventDTO);
        System.out.println("sending: " + result);
        nextRoundStream.send(result);
    }

    public static class SendStartRound implements Job {
        @Override
        public void execute(JobExecutionContext context) throws JobExecutionException {
            Arc.container().instance(PlayBlockerAsyncResource.class).get().startRound();
        }
    }

    public static class SendEndOfTimeRound implements Job {

        @Override
        public void execute(JobExecutionContext context) throws JobExecutionException {
            Arc.container().instance(PlayBlockerAsyncResource.class).get().stopRound();
        }

    }

    @Inject
    Logger logger;

}
