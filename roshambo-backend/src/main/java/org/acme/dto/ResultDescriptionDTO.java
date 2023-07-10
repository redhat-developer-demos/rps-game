package org.acme.dto;


import org.acme.Team;
import org.acme.game.ResultDescription;
import org.acme.game.ShapeCount;

public class ResultDescriptionDTO implements ServerSideEventMessage {
    
    private Team winner;
    private ShapeCount team1;
    private ShapeCount team2;
    private int team1Score;
    private int team2Score;

    public static ResultDescriptionDTO of(ResultDescription resultDescription) {
        ResultDescriptionDTO resultDescriptionDTO = new ResultDescriptionDTO();
        resultDescriptionDTO.team1 = resultDescription.getTeam1();
        resultDescriptionDTO.team2 = resultDescription.getTeam2();
        resultDescriptionDTO.winner = resultDescription.getWinner();
        resultDescriptionDTO.team1Score = resultDescription.getCurrentScore().getTeam1();
        resultDescriptionDTO.team2Score = resultDescription.getCurrentScore().getTeam2();

        return resultDescriptionDTO;
    }

    public ShapeCount getTeam1() {
        return team1;
    }

    public ShapeCount getTeam2() {
        return team2;
    }

    public Team getWinner() {
        return winner;
    }

    public int getTeam1Score() {
        return team1Score;
    }

    public int getTeam2Score() {
        return team2Score;
    }

}
