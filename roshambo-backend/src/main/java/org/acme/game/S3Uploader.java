package org.acme.game;

import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.Base64;
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

  public S3Uploader (Logger logger) {
    this.logger = logger;
  }

  public void uploadImage (String image, String ext) {
    String imageName = ZonedDateTime.now(ZoneOffset.UTC).format(DateTimeFormatter.ISO_INSTANT);

    S3Client s3 = S3Client.builder()
            .region(Region.US_EAST_2)
            .build();

    PutObjectRequest objectRequest = PutObjectRequest.builder()
    // TODO: might need to parse the file type from the base64
    .bucket(bucketName)
    .key(imageName + "." + ext)
    .build();

    try {
      s3.putObject(objectRequest, RequestBody.fromBytes(Base64.getDecoder().decode(image)));
    } catch (Exception ex) {
      logger.errorf("Exception thrown when uploading image to S3: %s", ex.toString());
    }
  }
}
