package org.acme.game;

import static org.assertj.core.api.Assertions.assertThat;

import org.acme.Team;
import org.acme.detector.Shape;
import org.jboss.logging.Logger;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class ScoreInformationTest {
    
    private ScoreInformation scoreInformation = new ScoreInformation();

    @BeforeEach
    public void configure() {
        scoreInformation.logger = Logger.getLogger("test");
        scoreInformation.roshamboChart = new RoshamboChart();
    }

    @Test
    public void should_give_the_correct_winner_1() {
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.SCISSORS);

        scoreInformation.incrementShape(2, Shape.ROCK);
        scoreInformation.incrementShape(2, Shape.SCISSORS);
        scoreInformation.incrementShape(2, Shape.SCISSORS);
        scoreInformation.incrementShape(2, Shape.SCISSORS);

        assertThat(scoreInformation.winner().getWinner()).isEqualTo(Team.TEAM_1);
    }

    @Test
    public void should_give_the_correct_winner_2() {
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.ROCK);
        scoreInformation.incrementShape(1, Shape.SCISSORS);

        scoreInformation.incrementShape(2, Shape.ROCK);
        scoreInformation.incrementShape(2, Shape.PAPER);
        scoreInformation.incrementShape(2, Shape.PAPER);
        scoreInformation.incrementShape(2, Shape.PAPER);

        assertThat(scoreInformation.winner().getWinner()).isEqualTo(Team.TEAM_2);
    }

}
