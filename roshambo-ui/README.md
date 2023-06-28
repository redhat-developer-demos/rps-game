# RPS Game UI

## Local Development

Requires Node.js 18.12.1 or later. Consider using 
[nvm](https://github.com/nvm-sh/nvm/) to manage and install multiple Node.js
versions on a single machine.

First, install dependencies:

```bash
npm install
```

Next, start the development server on localhost:

```bash
npm run dev
```

Visit https://localhost:5173/ to view the application.

### Expose Development Build to Local Network

Use the `--host` flag like so:

```
npm run dev -- --host
```

### Local Development for iOS Devices

iOS disables access to the camera and accelerometer APIs when a site is not
served via HTTPS.

To serve the application in development mode with SSL/HTTPS enabled, use this
command:

```
npm run dev:ssl -- --host
```

## Running with Podman/Docker

Build the backend:

```bash
cd roshambo-backend
mvn clean package
podman build . -f src/main/docker/Dockerfile.jvm -t rps-backend
```

Run the backend container:

```bash
podman run --rm -p 8181:8080 --name rps-backend rps-backend
```

Build the frontend:

```bash
cd roshambo-ui
podman build . -t rps-ui
```

Start the frontend (making sure to pass the backend host):

```bash
export BACKEND_IP=$(podman inspect --format='{{.NetworkSettings.IPAddress}}' rps-backend)
podman run --rm -e RPS_BACKEND_HOST="http://$BACKEND_IP:8080" -p 8080:8080 rps-ui
```
