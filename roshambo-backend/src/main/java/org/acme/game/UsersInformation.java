package org.acme.game;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

import org.acme.User;

import io.quarkus.arc.Lock;
import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
@Lock
public class UsersInformation {
    
    // Team - User
    private Map<Integer, Users> currentUsers = new HashMap<>();

    // User Id - Time Played
    private Map<Integer, Duration> playedTimes = new HashMap<>();

    public void addUser(User user) {
        this.currentUsers.computeIfPresent(user.team, (k, v) -> v.addUser(user));
        this.currentUsers.computeIfAbsent(user.team, k -> new Users(user));
    }

    public void increasePlayedTime(int userId, Duration playedTime) {
        this.playedTimes.computeIfPresent(userId, (k, v) -> v.plus(playedTime));
    }

}
