FROM node:16-alpine

WORKDIR /usr/src/app
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm install

# COPY test/* test/
# COPY scripts/* scripts/
# COPY contracts/* contracts/
# COPY tsconfig.json .
# COPY hardhat.config.ts .
COPY . . 

RUN npm run compile
RUN npm run test

COPY $PWD/docker/* /usr/local/bin/
ENTRYPOINT ["/bin/sh", "/usr/local/bin/entrypoint.sh"]
