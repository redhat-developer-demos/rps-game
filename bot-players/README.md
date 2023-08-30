# Roshambo Bots

This repository contains code to create bot players that can play the Roshambo
game. Bots will communicate with the game server defined in the
`GAME_SERVER_URL` environment variable.

The bot behaviour is:

1. Upon creation, obtain their username and the game config from the game server.
1. Enter a `waiting` state, and listen for Server-Sent Event payloads.
1. Upon receipt of the `enable` Server-Sent Event, enter a `selectShape` state and select a random move (rock, paper, or scissors).
1. Return to the `waiting` state, and await subsequent `enable` events.
1. Upon receipt of an `end` event, enter a `gameOver` state and get cleaned up by the server.

## Usage

The bots run on Node.js v18. You can use [`nvm`](https://nvm.sh/) to install
and manage various Node.js versions.

```bash
# Clone the repository and change to the bot directory
git clone https://github.com/redhat-developer-demos/rps-game rps-game
cd rps-game/bot-players

# Install and switch to the Node.js version required by this project
nvm install
nvm use

# Install deps
npm ci
npm run build

# Specify the game server URL. Use the nginx Route replicate real game
# routing behaviours
export GAME_SERVER_URL=https://chage-to.nginx-route.openshiftapps.com
npm start
```

Once the server is running, use the `POST /bot` endpoint to create a bot
player:

```bash
curl -X POST http://localhost:8181/bot
```

The response to this request will contain the unique bot ID:

```json
{"botIds":["player-machine-c14f3e17-b932-4f89-b2a3-fddac13b2c1a"]}
```

A `count` query parameter can be included if multiple bot players need to be
created, e.g:

```bash
curl -X POST 'http://localhost:8181/bot?count=2'

{
  "botIds": [
    "player-machine-83fc0770-89f6-43dd-a466-30c75a0b729d",
    "player-machine-7b9fa044-7849-4c46-8fc8-9ac4923eae65"
  ]
}
```

Bots will automatically play the game when it starts.

## Configuration

The `config.ts` file defines the environment variables that are used by this
process.
 
Edit the `.env.local` file to set variables for local development.

A `.env` file can be provided to set environment variables for production
deployments.

## Local Development

Start the development server:

```bash
cd bot-players
npm i
npm run dev
```

