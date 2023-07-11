package org.acme.detector;

import java.util.Base64;

public class Image {

    private String image;

    public String getImage() {
        return image;
    }

    public static Image of(byte[] imageContent) {
        Image image = new Image();
        image.image = Base64.getEncoder().encodeToString(imageContent);
        return image;
    }

}
