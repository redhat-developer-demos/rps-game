package org.acme;

import static org.assertj.core.api.Assertions.assertThat;

import org.acme.detector.Shape;
import org.junit.jupiter.api.Test;

public class ShapeTest {
    
    @Test
    public void should_rock_wins_scissors() {
        assertThat(Shape.ROCK.wins(Shape.SCISSORS)).isEqualTo(1);
    }

    @Test
    public void should_scissors_wins_paper() {
        assertThat(Shape.SCISSORS.wins(Shape.PAPER)).isEqualTo(1);
    }

    @Test
    public void should_paper_wins_rock() {
        assertThat(Shape.PAPER.wins(Shape.ROCK)).isEqualTo(1);
    }

    @Test
    public void should_scissors_loose_rock() {
        assertThat(Shape.SCISSORS.wins(Shape.ROCK)).isEqualTo(2);
    }

    @Test
    public void should_paper_loose_scissors() {
        assertThat(Shape.PAPER.wins(Shape.SCISSORS)).isEqualTo(2);
    }

    @Test
    public void should_rock_looses_paper() {
        assertThat(Shape.ROCK.wins(Shape.PAPER)).isEqualTo(2);
    }

}
