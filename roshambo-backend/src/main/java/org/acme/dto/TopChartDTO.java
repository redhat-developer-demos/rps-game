package org.acme.dto;

import java.util.List;

import org.acme.User;

public class TopChartDTO implements ServerSideEventMessage {
    private List<String> topPlayers;

    public static TopChartDTO of(List<User> usersInformation) {
        TopChartDTO topChartDTO = new TopChartDTO();
        topChartDTO.topPlayers = usersInformation.stream().map(u -> u.name).toList();
        return topChartDTO;
    }

    public List<String> getTopPlayers() {
        return topPlayers;
    }
}
