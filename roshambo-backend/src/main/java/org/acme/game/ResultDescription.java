package org.acme.game;

import org.acme.Team;

public class ResultDescription {
    
    private Team winner;
    private ShapeCount team1;
    private ShapeCount team2;

    private TeamScore currentScore;
    
    public ResultDescription(Team winner, ShapeCount team1, ShapeCount team2, TeamScore currentScore) {
        this.winner = winner;
        this.team1 = team1;
        this.team2 = team2;
        this.currentScore = currentScore;
    }

    public TeamScore getCurrentScore() {
        return currentScore;
    }

    public Team getWinner() {
        return winner;
    }

    public ShapeCount getTeam1() {
        return team1;
    }

    public ShapeCount getTeam2() {
        return team2;
    }

    @Override
    public String toString() {
        return "Result:  winner -> " + winner + ", team1 -> " + team1 + ", team2 -> " + team2 + ", current score="
                + currentScore;
    }

    

}
