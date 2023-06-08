package org.acme.game;

import org.acme.detector.Shape;

public class TeamStatistic {

    private ShapeCount rocks = new ShapeCount(Shape.ROCK);
    private ShapeCount scissors = new ShapeCount(Shape.SCISSORS);
    private ShapeCount paper = new ShapeCount(Shape.PAPER);

    public TeamStatistic() {
    }

    public TeamStatistic(Shape shape) {
        this.increment(shape);
    }

    public ShapeCount winner() {
        
        if (rocks.getCount() >= scissors.getCount() && rocks.getCount() >= paper.getCount()) {
            return rocks;
        }

        if (scissors.getCount() >= rocks.getCount() && scissors.getCount() >= paper.getCount()) {
            return scissors;
        }

        if (paper.getCount() >= rocks.getCount() && paper.getCount() >= scissors.getCount()) {
            return paper;
        }

        return paper;
    }

    public TeamStatistic increment(Shape shape) {
        switch(shape) {
            case ROCK: incrementRock(); break;
            case SCISSORS: incrementScissors(); break;
            case PAPER: incrementPaper(); break;
        }

        return this;
    }

    public void incrementRock() {
        rocks.increment();
    }

    public void incrementScissors() {
        scissors.increment();
    }

    public void incrementPaper() {
        paper.increment();
    }

    @Override
    public String toString() {
        return "[rocks=" + rocks + ", scissors=" + scissors + ", paper=" + paper + "]";
    }

    

}
