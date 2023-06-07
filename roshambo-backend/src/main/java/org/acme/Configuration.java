package org.acme;

public class Configuration {

    public long roundTimeInSeconds;
    public long timeBetweenRoundsInSeconds;
    public int numberOfRounds;

    public Configuration(long roundTimeInSconds, long timeBetweenRoundsInSeconds, int numberOfRounds) {
        this.roundTimeInSeconds = roundTimeInSconds;
        this.timeBetweenRoundsInSeconds = timeBetweenRoundsInSeconds;
        this.numberOfRounds = numberOfRounds;
    }


}
