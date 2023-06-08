package org.acme.game;

import static org.assertj.core.api.Assertions.assertThat;

import org.acme.detector.Shape;
import org.junit.jupiter.api.Test;

public class TeamStatisticTest {
    
    @Test
    public void should_return_the_most_voted_shape_paper() {
        TeamStatistic teamStatistic = new TeamStatistic();

        teamStatistic.incrementPaper();
        teamStatistic.incrementPaper();
        teamStatistic.incrementRock();
        teamStatistic.incrementScissors();

        assertThat(teamStatistic.winner().getShape()).isEqualTo(Shape.PAPER);

    }

    @Test
    public void should_return_the_most_voted_shape_scissors() {
        TeamStatistic teamStatistic = new TeamStatistic();

        teamStatistic.incrementPaper();
        teamStatistic.incrementScissors();
        teamStatistic.incrementRock();
        teamStatistic.incrementScissors();

        assertThat(teamStatistic.winner().getShape()).isEqualTo(Shape.SCISSORS);

    }

    @Test
    public void should_return_the_most_voted_shape_rock() {
        TeamStatistic teamStatistic = new TeamStatistic();

        teamStatistic.incrementPaper();
        teamStatistic.incrementRock();
        teamStatistic.incrementRock();
        teamStatistic.incrementScissors();

        assertThat(teamStatistic.winner().getShape()).isEqualTo(Shape.ROCK);

    }

}
