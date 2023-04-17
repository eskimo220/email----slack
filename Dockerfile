FROM node:16-alpine3.15
WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --prod --frozen-lockfile

COPY . .
CMD "yarn" "start2"