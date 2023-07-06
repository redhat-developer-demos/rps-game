package org.acme.game;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import org.eclipse.microprofile.config.inject.ConfigProperty;

import jakarta.enterprise.context.ApplicationScoped;
import jakarta.xml.bind.DatatypeConverter;

import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;

import org.jboss.logging.Logger;

@ApplicationScoped
public class S3Uploader {
  Logger logger;

  @ConfigProperty(name = "roshambo.bucket-name")
  String bucketName;

  boolean uploadsEnabled;

  public S3Uploader (Logger logger) {
    this.logger = logger;

    if (System.getenv("AWS_ACCESS_KEY_ID") != null && System.getenv("AWS_SECRET_ACCESS_KEY") != null) {
      logger.infof("Detected AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY in the environment. Enabling S3 uploads to bucket %s", bucketName);
      uploadsEnabled = true;
    } else {
      logger.infof("Disabling S3 uploads because AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY are not set in the environment");
      uploadsEnabled = false;
    }
  }

  public void uploadImage (byte image[]) {
    if (uploadsEnabled == false) {
      return;
    }

    String imageName = ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT);

    // Images are uploaded as base64 strings, e.g: data:image/jpeg;base64,$DATA
    // We need to strip the metadata before the comment, and convert to binary
    String imageDataPortion = new String(image).split(",")[1];
    byte[] imageBytes = DatatypeConverter.parseBase64Binary(imageDataPortion);

    S3Client s3 = S3Client.builder()
            .region(Region.US_EAST_2)
            .build();

            PutObjectRequest objectRequest = PutObjectRequest.builder()
            // TODO: might need to parse the file type from the base64
            .bucket(bucketName)
            .key(imageName + ".png")
            .build();

    try {
      s3.putObject(objectRequest, RequestBody.fromBytes(imageBytes));
    } catch (Exception ex) {
      logger.errorf("Exception thrown when uploading image to S3: %s", ex.toString());
    }
  }
}
