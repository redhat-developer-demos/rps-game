package org.acme.dto;

import java.util.List;

import org.acme.User;
import org.acme.game.ResultDescription;

public class ResultsDTO implements ServerSideEventMessage {
    private List<String> topPlayers;
    private ResultDescriptionDTO roundResult;

    public List<String> getTopPlayers() {
        return topPlayers;
    }

    public ResultDescriptionDTO getRoundResult() {
        return roundResult;
    }

    public static ServerSideEventMessage of(List<User> bestUsers, ResultDescription winner) {
        ResultsDTO resultsDTO = new ResultsDTO();
        resultsDTO.topPlayers = bestUsers.stream().map(u -> u.name).toList();
        resultsDTO.roundResult = ResultDescriptionDTO.of(winner);
        return resultsDTO;
    }
}
