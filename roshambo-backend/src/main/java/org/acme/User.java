package org.acme;

public class User {

    public static int BOT_ID = -1;

    public int id;
    public String name;
    public int team;

    public User(int id, String name) {
        this.id = id;
        this.name = name;
        this.team = (id % 2) + 1;
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + id;
        return result;
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        User other = (User) obj;
        if (id != other.id)
            return false;
        return true;
    }
}
