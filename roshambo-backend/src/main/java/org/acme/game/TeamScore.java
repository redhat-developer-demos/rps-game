package org.acme.game;

import org.acme.Team;

public class TeamScore {
    
    private int team1 = 0;
    private int team2 = 0;

    void score(Team team) {
        switch(team) {
            case TEAM_1: team1++; break;
            case TEAM_2: team2++; break;
            default: break;
        }
    }

    public void reset() {
        this.team1 = 0;
        this.team2 = 0;
    }

    public int getTeam1() {
        return team1;
    }

    public int getTeam2() {
        return team2;
    }

    @Override
    public String toString() {
        return "team1 -> " + team1 + " team2 -> " + team2;
    }

    

}
