package org.acme;

import io.quarkus.test.junit.QuarkusTest;

import static io.restassured.RestAssured.given;
import static org.hamcrest.CoreMatchers.is;

import org.junit.jupiter.api.Test;

@QuarkusTest
public class GameResourceTest {
    
    @Test
    public void should_assign_a_user() {
        given()
          .when().get("/game/assign")
          .then()
             .statusCode(200)
             .body("id", is(0));
    }

    @Test
    public void should_send_a_shape() {
        given()
          .when().post("/game/detect/button/1/0/ROCK")
          .then()
             .statusCode(200)
             .body("shape", is("ROCK"));
    }

}
