package org.acme.detector;

import java.util.Base64;

public class Image {

    private String image;

    public String getImage() {
        return image;
    }

    public static Image of(String imageContent) {
        Image image = new Image();
        image.image = imageContent;
        return image;
    }

}
