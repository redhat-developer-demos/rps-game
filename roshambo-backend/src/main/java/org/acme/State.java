package org.acme;

import io.quarkus.arc.Lock;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Lock
public class State {
    
    private boolean manualRounds;
    private StateGame status = StateGame.INIT;

    public boolean canStart() {
        return this.status == StateGame.INIT || this.status == StateGame.END;
    }

    public boolean canContinue() {
        return this.status == StateGame.STOP && manualRounds;
    }

    public void start() {
        this.status = StateGame.START;
    }

    public void stop() {
        this.status = StateGame.STOP;
    }

    public void end() {
        this.status = StateGame.END;
    }

    public void setManualRounds(boolean manualRounds) {
        this.manualRounds = manualRounds;
    }

    public enum StateGame {
        START, STOP, END, INIT
    }
}
