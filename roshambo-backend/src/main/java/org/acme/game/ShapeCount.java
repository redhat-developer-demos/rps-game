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
        return "Shape: " + shape + " with count: " + count;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((shape == null) ? 0 : shape.hashCode());
        result = prime * result + count;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        ShapeCount other = (ShapeCount) obj;
        if (shape != other.shape)
            return false;
        if (count != other.count)
            return false;
        return true;
    }

    

}
