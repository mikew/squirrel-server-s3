FROM mhart/alpine-node:6.9.1

WORKDIR /app/
COPY ./package.json /app/
ENV NODE_ENV=production
RUN npm install --no-progress

COPY . /app/
CMD ["node", "lib/server.js"]
