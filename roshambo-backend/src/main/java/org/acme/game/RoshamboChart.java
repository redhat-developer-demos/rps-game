package org.acme.game;

import org.acme.Team;
import org.acme.detector.Shape;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class RoshamboChart {
    
    public Team winner(Shape s1, Shape s2) {
        return switch(s1.wins(s2)) {
            case 1 -> Team.TEAM_1;
            case 2 -> Team.TEAM_2;
            default -> Team.TIE;
        };
    }

}
