package org.acme.game;

import static org.assertj.core.api.Assertions.assertThat;

import org.acme.Team;
import org.junit.jupiter.api.Test;

public class TeamScoreTest {
    
    @Test
    public void should_count_team_1_when_wins() {
        TeamScore teamScore = new TeamScore();
        teamScore.score(Team.TEAM_1);

        assertThat(teamScore.getTeam1()).isEqualTo(1);
    }

    @Test
    public void should_count_team_2_when_wins() {
        TeamScore teamScore = new TeamScore();
        teamScore.score(Team.TEAM_2);

        assertThat(teamScore.getTeam2()).isEqualTo(1);
    }

}
