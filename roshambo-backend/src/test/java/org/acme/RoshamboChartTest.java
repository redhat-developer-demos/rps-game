package org.acme;

import static org.assertj.core.api.Assertions.assertThat;

import org.acme.detector.Shape;
import org.acme.game.RoshamboChart;
import org.junit.jupiter.api.Test;

public class RoshamboChartTest {
    
    private RoshamboChart roshamboChart = new RoshamboChart();

    @Test
    public void should_win_team1_when_has_winner_shape() {
        assertThat(roshamboChart.winner(Shape.ROCK, Shape.SCISSORS)).isEqualTo(Team.TEAM_1);
    }

    @Test
    public void should_win_team2_when_has_winner_shape() {
        assertThat(roshamboChart.winner(Shape.ROCK, Shape.PAPER)).isEqualTo(Team.TEAM_2);
    }

}
