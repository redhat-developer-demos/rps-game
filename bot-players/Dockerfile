FROM registry.access.redhat.com/ubi8/nodejs-18

WORKDIR /usr/src/app

COPY --chown=1001:1001 package*.json ./

RUN npm ci

COPY --chown=1001:1001 . .

RUN npm run build

ENV GAME_SERVER_URL=https://chage-to.nginx-route.openshiftapps.com

EXPOSE 8181

CMD ["npm", "start"]
