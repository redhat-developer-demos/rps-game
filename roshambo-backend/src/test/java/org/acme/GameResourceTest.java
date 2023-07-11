package org.acme;

import io.quarkus.test.junit.QuarkusTest;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import io.restassured.response.Response;
import jakarta.ws.rs.core.MediaType;
import java.io.IOException;
import java.io.InputStream;
import java.util.Base64;
import org.junit.jupiter.api.MethodOrderer;
import org.junit.jupiter.api.Order;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestMethodOrder;

@QuarkusTest
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
public class GameResourceTest {
    
    @Test
    @Order(1)
    public void should_assign_a_user() {
        given()
          .when().get("/game/assign")
          .then()
             .statusCode(200)
             .body("id", is(0));
    }

    @Test
    @Order(2)
    public void should_send_a_shape() {
        given()
          .when().post("/game/detect/button/1/0/ROCK")
          .then()
             .statusCode(200)
             .body("shape", is("ROCK"));
    }

    @Test
    @Order(3)
    public void should_send_a_shape_as_image() throws IOException {

        try (InputStream image = GameResourceTest.class.getClassLoader().getResourceAsStream("/rock1.jpg")) {
            byte[] imageChunk = image.readAllBytes();

            String imageBase64 = Base64.getEncoder().encodeToString(imageChunk);

            given()
                .header("Content-type", MediaType.TEXT_PLAIN)
                .and()
                .body("data:image/png;base64,"+imageBase64)
                .when()
                .post("/game/detect/shot/1/0")
                .then()
                .statusCode(200)
                .body("shape", is("ROCK"));

        }

    }


}
