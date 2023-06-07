package org.acme.dto;

public class ServerSideEventDTO {
    private String type;
    private ServerSideEventMessage content;

    public ServerSideEventMessage getContent() {
        return content;
    }

    public String getType() {
        return type;
    }

    public ServerSideEventDTO(String type, ServerSideEventMessage content) {
        this.type = type;
        this.content = content;
    }
}
