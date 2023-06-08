package org.acme.dto;

import org.acme.game.TeamScore;

public class TeamScoreDTO implements ServerSideEventMessage {
    
    private int team1Score;
    private int team2Score;
    
    public static TeamScoreDTO of(TeamScore teamScore) {
        TeamScoreDTO teamScoreDTO = new TeamScoreDTO();
        teamScoreDTO.team1Score = teamScore.getTeam1();
        teamScoreDTO.team2Score = teamScore.getTeam2();

        return teamScoreDTO;
    }

    public int getTeam1Score() {
        return team1Score;
    }

    public int getTeam2Score() {
        return team2Score;
    }
    

}
