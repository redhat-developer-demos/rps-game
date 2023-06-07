package org.acme.detector;

import org.jboss.logging.Logger;

import io.quarkus.arc.DefaultBean;
import io.quarkus.arc.profile.IfBuildProfile;
import jakarta.enterprise.context.Dependent;
import jakarta.enterprise.inject.Produces;
import jakarta.inject.Inject;

@Dependent
public class ShapeDetectorServiceProducer {
    
    @Inject
    Logger logger;

    @Produces
    @IfBuildProfile("prod")
    public ShapeDetectorService mlShapeDetectorService() {
        logger.info("Production mode using ML Shape detector");
        return null;
    }

    @Produces
    @DefaultBean
    public ShapeDetectorService noop() {
        logger.info("Using noop Shape detector");
        return new RandomShapeDetectorService();
    }

}
