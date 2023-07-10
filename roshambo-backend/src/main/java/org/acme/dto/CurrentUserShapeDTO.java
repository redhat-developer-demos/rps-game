package org.acme.dto;

import org.acme.detector.Shape;

public class CurrentUserShapeDTO implements ServerSideEventMessage {
    
    private String username;
    private Shape shape;

    public static CurrentUserShapeDTO of(String username, Shape shape) {
        CurrentUserShapeDTO currentUserShapeDTO = new CurrentUserShapeDTO();
        currentUserShapeDTO.shape = shape;
        currentUserShapeDTO.username = username;

        return currentUserShapeDTO;
    }

    public Shape getShape() {
        return shape;
    }

    public String getUsername() {
        return username;
    }

}
