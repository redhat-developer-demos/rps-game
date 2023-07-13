package org.acme;

public class Configuration {

    public long roundTimeInSeconds;
    public long timeBetweenRoundsInSeconds;
    public int numberOfRounds;

    public boolean enableCamera;

    public Configuration(long roundTimeInSconds, long timeBetweenRoundsInSeconds, int numberOfRounds, boolean cameraEnabled) {
        this.roundTimeInSeconds = roundTimeInSconds;
        this.timeBetweenRoundsInSeconds = timeBetweenRoundsInSeconds;
        this.numberOfRounds = numberOfRounds;
        this.enableCamera = cameraEnabled;
    }


}
