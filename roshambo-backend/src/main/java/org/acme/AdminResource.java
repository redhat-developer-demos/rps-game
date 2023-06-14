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

    @Inject
    State status;

    @GET
    @Path("/game/start")
    public Response startGame() {
        if (status.canStart()) {
            status.start();
            playBlocker.startRound();
            return Response.ok().build();
        } else {
            return Response.status(412)
                            .entity("Cannot start game because it's not in init or end state")
                            .build();
        }
    }

    @GET
    @Path("/game/continue")
    public Response continueGame() {
        if (status.canContinue()) {
            status.start();
            playBlocker.startRound();
            return Response.ok().build();
        } else {
            return Response.status(412)
                    .entity("Cannot continue the game because the game is not stopped or not configured in manual rounds")
                    .build();
        }
    }

    @Inject
    Logger logger;

}
