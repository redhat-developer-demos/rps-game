package org.acme.game;

import org.acme.detector.Shape;

public class ShapeCount {
    
    private Shape shape;
    private int count;

    public ShapeCount(Shape shape) {
        this.shape = shape;
        this.count = 0;
    }

    public void increment() {
        this.count++;
    }

    public int getCount() {
        return count;
    }

    public Shape getShape() {
        return shape;
    }

    @Override
    public String toString() {
        return "shape: " + shape + " with count: " + count;
    }

}
