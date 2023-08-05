package org.acme.dto;

public class HeartBeatDTO implements ServerSideEventMessage {

    private String uuid;

    public static HeartBeatDTO of(String uuid) {
        HeartBeatDTO heartBeatDTO = new HeartBeatDTO();
        heartBeatDTO.uuid = uuid;

        return heartBeatDTO;
    }

    public String getUuid() {
        return uuid;
    }
}
