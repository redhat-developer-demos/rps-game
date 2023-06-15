package org.acme.game;

import static org.assertj.core.api.Assertions.assertThat;

import java.time.Duration;
import java.util.List;

import org.acme.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

public class UsersInformationTest {
    
    UsersInformation usersInformation = new UsersInformation();

    @BeforeEach
    public void setupUsers() {
        usersInformation.addUser(new User(1, "a"));
        usersInformation.addUser(new User(2, "b"));
        usersInformation.addUser(new User(3, "c"));
        usersInformation.addUser(new User(4, "d"));
        usersInformation.addUser(new User(5, "e"));
        usersInformation.addUser(new User(6, "f"));

    }

    @Test
    public void should_increase_play_time() {
        usersInformation.increasePlayedTime(1, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(300));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(1, Duration.ofMillis(150));

        Duration durationPlayer1 = usersInformation.getPlayedTimesById(1);
        assertThat(durationPlayer1).isEqualTo(Duration.ofMillis(350));

    }

    @Test
    public void should_return_the_best_player() {
        usersInformation.increasePlayedTime(1, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(300));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(1, Duration.ofMillis(150));

        List<User> bestUsers = usersInformation.bestUsers(1);
        assertThat(bestUsers).extracting("name", String.class).contains("a");
    }

    @Test
    public void should_return_the_a_list_of_best_players() {
        usersInformation.increasePlayedTime(1, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(300));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(1, Duration.ofMillis(150));

        List<User> bestUsers = usersInformation.bestUsers(2);
        assertThat(bestUsers).extracting("name", String.class).containsExactly("a", "b");
    }

    @Test
    public void should_return_the_a_list_of_top_best_players() {
        usersInformation.increasePlayedTime(1, Duration.ofMillis(200));
        usersInformation.increasePlayedTime(2, Duration.ofMillis(300));
        usersInformation.increasePlayedTime(3, Duration.ofMillis(400));
        usersInformation.increasePlayedTime(4, Duration.ofMillis(150));
        usersInformation.increasePlayedTime(5, Duration.ofMillis(50));
        usersInformation.increasePlayedTime(6, Duration.ofMillis(500));

        List<User> bestUsers = usersInformation.bestUsers(2);
        assertThat(bestUsers).extracting("name", String.class).containsExactly("e", "d");
    }

}
