package org.acme;

import org.acme.detector.Shape;

public class ShotResult {

    public long timeInMillis;
    public Shape shape;

    public ShotResult(long timeInMillis, Shape shape) {
        this.timeInMillis = timeInMillis;
        this.shape = shape;
    }
    
}
