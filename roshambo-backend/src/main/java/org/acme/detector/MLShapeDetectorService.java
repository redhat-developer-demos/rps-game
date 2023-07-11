package org.acme.detector;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.json.JsonObject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.rest.client.inject.RestClient;

@ApplicationScoped
@Ai
public class MLShapeDetectorService implements ShapeDetectorService {

    @RestClient
    AiConnector connector;

    @Override
    public Shape detect(byte[] image) {
        JsonObject response = connector.prediction(Image.of(image));
        String shape = response.getString("prediction");

        return Shape.valueOf(shape.toUpperCase());
    }
    
}
