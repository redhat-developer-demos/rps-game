package org.acme.detector;

public enum Shape {
    ROCK, PAPER, SCISSORS;

    public int wins(Shape shape) {
        
        if (this == shape) {
            return 0;
        }

        boolean p1Wins = (this == Shape.ROCK && shape == Shape.SCISSORS)
            || (this == Shape.SCISSORS && shape == Shape.PAPER)
            || (this == Shape.PAPER && shape == Shape.ROCK);

        return p1Wins ? 1 : 2;
    }
}
