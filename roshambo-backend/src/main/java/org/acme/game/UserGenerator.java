package org.acme.game;

import jakarta.enterprise.context.ApplicationScoped;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

import org.acme.User;

import static java.util.Collections.unmodifiableList;

@ApplicationScoped
public class UserGenerator {

    public static final List<String> NAMES;

    private AtomicInteger usersCounter = new AtomicInteger(0);

    public User getUser() {
        int id = usersCounter.getAndIncrement();
        return new User(id, getNameByPosition(id));
    }

    private String getNameByPosition(int position) {
        if (position >= NAMES.size()) {
            throw new IllegalArgumentException("The position is too big: " + position + "/" + NAMES.size());
        }
        return NAMES.get(position);
    }

    static  {
        try(final InputStream nameInputStream = UserGenerator.class.getClassLoader().getResourceAsStream("names.txt")) {
            if (nameInputStream == null) {
                throw new IOException("names list not found");
            }
            try(BufferedReader reader = new BufferedReader(new InputStreamReader(nameInputStream))) {
                final List<String> names = new ArrayList<>();
                while(reader.ready()) {
                    names.add(reader.readLine());
                }
                NAMES = unmodifiableList(names);
            }

        } catch (IOException e) {
            throw new IllegalStateException("Error while loading name list", e);
        }
    }
}
