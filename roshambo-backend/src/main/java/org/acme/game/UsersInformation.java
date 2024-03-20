package org.acme.game;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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
        this.playedTimes.computeIfAbsent(userId, k -> playedTime);
    }

    public List<User> bestUsers(int top) {
        return playedTimes.entrySet()
                    .stream()
                    .sorted(Map.Entry.<Integer, Duration>comparingByValue())
                    .limit(top)
                    .map(e -> this.findUserById(e.getKey()).get())
                    .collect(Collectors.toList());
    }

    Duration getPlayedTimesById(int id) {
        return playedTimes.get(id);
    }

    public Optional<User> findUserById(int id) {
        Optional<User> user = currentUsers
            .values()
            .stream()
            .map(u -> u.findUserById(id))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .findAny();
        return user;
    }
}
