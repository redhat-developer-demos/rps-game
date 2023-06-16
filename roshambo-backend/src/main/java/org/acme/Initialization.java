package org.acme;

public class Initialization {
    private Configuration configuration;
    private State state;

    public Initialization(Configuration configuration, State state) {
        this.configuration = configuration;
        this.state = state;
    }

    public Configuration getConfiguration() {
        return configuration;
    }

    public State getState() {
        return state;
    }
}
