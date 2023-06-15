package org.acme.game;

import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import org.acme.User;

public class Users {
    
    private Set<User> users = new HashSet<>();

    public Users(User user) {
        this.users.add(user);
    }

    public Users addUser(User user) {
        this.users.add(user);
        return this;
    }

    public Set<User> getUsers() {
        return users;
    }

    public Optional<User> findUserById(int id) {
        return users.stream()
            .filter(u -> u.id == id)
            .findFirst();
    }

}
