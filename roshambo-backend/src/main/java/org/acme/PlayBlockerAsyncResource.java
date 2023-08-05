package org.acme;

import static org.quartz.JobBuilder.newJob;
import static org.quartz.TriggerBuilder.newTrigger;

import java.time.Duration;
import java.util.Date;
import java.util.concurrent.TimeUnit;

import org.acme.dto.*;
import org.acme.game.ResultDescription;
import org.acme.game.ScoreInformation;
import org.acme.game.TeamScore;
import org.acme.game.UsersInformation;
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
import io.quarkus.scheduler.Scheduled;
import io.smallrye.reactive.messaging.annotations.Broadcast;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.json.bind.Jsonb;
import jakarta.json.bind.JsonbBuilder;

@ApplicationScoped
// This class controlls the timing of when user can play and when not, starting the game, stopping
public class PlayBlockerAsyncResource {
    
    @Channel("next-round") @Broadcast Emitter<String>  nextRoundStream;

    @Channel("status") Emitter<String>  statusStream;

    @ConfigProperty(name = "roshambo.round-time")
    Duration roundTimeInSeconds;

    @ConfigProperty(name = "roshambo.time-between-rounds")
    Duration timeBetweenRoundsInSeconds;

    @ConfigProperty(name = "roshambo.number-of-rounds")
    int numberOfRounds;

    @ConfigProperty(name = "roshambo.manual-rounds")
    boolean manualRounds;

    @ConfigProperty(name = "roshambo.top-players")
    int topPlayers;

    @Inject
    Scheduler quartz;

    @Inject
    ScoreInformation scoreInformation;

    @Inject
    UsersInformation userInformation;

    @Inject
    State state;

    @Scheduled(every = "10s", delayed = "5s")
    public void heartbeat() {
        this.sendHeartBeat();
    }

    public void startRound() {
        this.sendStartRound();
        this.state.start();
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
        this.sendResults(winner);
        this.state.stop();
        // Check if end game

        if (!manualRounds && stillRoundsToPlay()) {
            this.controlStart();
        } else {
            if (!stillRoundsToPlay()) {
                this.sendEndOfGame(this.scoreInformation.getTeamScore());
                this.state.end();
                this.scoreInformation.reset();
            }
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

    // SEE event
    public void sendHeartBeat() {
        logger.debug("Sending heartbeats to sockets");
        this.sendToGamers(new ServerSideEventDTO("heartbeat", HeartBeatDTO.of(GameResource.gameUUId)));
        this.sendToAdmin(new ServerSideEventDTO("heartbeat", HeartBeatDTO.of(GameResource.gameUUId)));
    }
    // SSE event
    public void sendStartRound() {
        logger.info("Sending Start Round");
        this.sendToGamers(new ServerSideEventDTO("start", CurrentRoundInformationDTO.of(this.roundTimeInSeconds, this.scoreInformation.getCurrentRound() + 1)));
        this.sendToAdmin(new ServerSideEventDTO("start", new ServerSideEventMessage() {}));
    }

    // SSE event
    public void sendEndOfTimeRound(ResultDescription winner) {
        logger.infof("Sending Stop Round with results %s", winner);
        this.sendToGamers(new ServerSideEventDTO("stop", ResultDescriptionDTO.of(winner)));
        this.sendToAdmin(new ServerSideEventDTO("stop", new ServerSideEventMessage() {}));
    }

    // SSE event
    public void sendEndOfGame(TeamScore teamScore) {
        logger.info("Sending End Of Game");
        this.sendToGamers(new ServerSideEventDTO("end", TeamScoreDTO.of(teamScore)));
        this.sendToAdmin(new ServerSideEventDTO("end", new ServerSideEventMessage() {}));
    }

    // SSE event
    private void sendResults(ResultDescription winner) {
        logger.info("Sending Results");
        this.sendToAdmin(new ServerSideEventDTO("results", ResultsDTO.of(userInformation.bestUsers(topPlayers), winner)));
    }

    void sendToAdmin(ServerSideEventDTO serverSideEventDTO) {
        if (statusStream.hasRequests()) {
            Jsonb jsonb = JsonbBuilder.create();
            String result = jsonb.toJson(serverSideEventDTO);
            statusStream.send(result);
        }
    }

    void sendToGamers(ServerSideEventDTO serverSideEventDTO) {
        if (nextRoundStream.hasRequests()) {
            Jsonb jsonb = JsonbBuilder.create();
            String result = jsonb.toJson(serverSideEventDTO);
            nextRoundStream.send(result);
        } else {
            logger.warn("skipping sending " + serverSideEventDTO.getType());
        }
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

