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
git clone https://github.com:/edhat-developer-demos/rps-game rps-game
cd rps-game/bot-players

# Install and switch to the Node.js version required by this project
nvm install
nvm use

# Specify the game server URL. Use the nginx Route replicate real game
# routing behaviours
GAME_SERVER_URL=https://chage-to.nginx-route.openshiftapps.com npm run dev
```

Once the server is running, use the `POST /bot` endpoint to create a bot
player:

```bash
curl -X POST http://localhost:8181/bot
```

The response to this request will contain the unique bot ID:

```json
{"botId":"player-machine-b083d5f5-f248-4095-b657-bcf0a204b859"}
```

The endpoint can be called multiple times if multiple bot players need to be
created, e.g:

```bash
for i in {1..25}; do curl -X POST -s 'http://localhost:8181/bot' | jq ; done
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

