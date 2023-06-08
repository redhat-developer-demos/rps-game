package org.acme.game;

import java.util.HashMap;
import java.util.Map;

import org.acme.Team;
import org.acme.detector.Shape;
import org.jboss.logging.Logger;

import io.quarkus.arc.Lock;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

@ApplicationScoped
@Lock
public class ScoreInformation {
    
    private long startRoundTime;
    private int currentRound = 0;

    private TeamScore teamScore = new TeamScore();

    @Inject
    RoshamboChart roshamboChart;

    private Map<Integer, TeamStatistic> currentStats = new HashMap<>();

    public void incrementShape(int team, Shape shape) {
        this.currentStats.computeIfPresent(team, (k, v) -> v.increment(shape));
        this.currentStats.computeIfAbsent(team, k -> new TeamStatistic(shape));
    }

    public ResultDescription winner() {
        final ShapeCount winner1 = winner(1);
        final ShapeCount winner2 = winner(2);

        final Team winner = roshamboChart.winner(winner1.getShape(), winner2.getShape());

        logger.infof("Winner Team1: %s - Winner Team2: %s - The Team Winner is: %s", winner1, winner2, winner);
        teamScore.score(winner);
        return new ResultDescription(winner, winner1, winner2, teamScore);
    }

    public ShapeCount winner(int team) {
        return currentStats.getOrDefault(team, new TeamStatistic()).winner();
    }

    public TeamScore getTeamScore() {
        return teamScore;
    }

    public void setStartRoundTime(long startRoundTime) {
        this.startRoundTime = startRoundTime;
    }

    public long getStartRoundTime() {
        return startRoundTime;
    }

    public int getCurrentRound() {
        return currentRound;
    }

    public void newRound() {
        this.clearStats();
        this.currentRound++;
    }

    private void clearStats() {
        this.currentStats.clear();
    }

    public void reset() {
        clearStats();
        this.teamScore.reset();
        this.currentRound = 0;
    }

    @Override
    public String toString() {
        return "ScoreInformation [currentStats=" + currentStats + "]";
    }

    @Inject
    Logger logger;

}
