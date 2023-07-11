package org.acme.detector;

import java.util.Random;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.inject.Default;

@ApplicationScoped
@Default
public class RandomShapeDetectorService implements ShapeDetectorService {

    private Random random = new Random();

    @Override
    public Shape detect(byte[] image) {
        final Shape[] shapes = Shape.values();
        return shapes[random.nextInt(shapes.length)];
    }
    
}
