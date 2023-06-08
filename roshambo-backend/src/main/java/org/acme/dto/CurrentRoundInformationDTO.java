package org.acme.dto;

import java.time.Duration;

public class CurrentRoundInformationDTO implements ServerSideEventMessage {
    
    private long lengthOfRoundInSeconds;
    private long currentRound;

    public static CurrentRoundInformationDTO of(Duration lengthOfRound, int currentRoud) {
        CurrentRoundInformationDTO currentRoundInformationDTO = new CurrentRoundInformationDTO();
        currentRoundInformationDTO.lengthOfRoundInSeconds = lengthOfRound.toSeconds();
        currentRoundInformationDTO.currentRound = currentRoud;

        return currentRoundInformationDTO;
    }

    public long getCurrentRound() {
        return currentRound;
    }

    public long getLengthOfRoundInSeconds() {
        return lengthOfRoundInSeconds;
    }

}
