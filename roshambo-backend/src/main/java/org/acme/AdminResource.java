package org.acme;

import org.jboss.logging.Logger;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.core.Response;

@Path("/admin")
public class AdminResource {

    @Inject
    PlayBlockerAsyncResource playBlocker;

    @GET
    @Path("/game/start")
    public Response startGame() {
        playBlocker.startRound();
        return Response.ok().build();
    }


    @Inject
    Logger logger;

}
