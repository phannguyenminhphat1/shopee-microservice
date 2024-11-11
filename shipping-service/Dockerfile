FROM node:20
WORKDIR /root/app
COPY package*.json ./
COPY yarn*.lock .
RUN yarn config set network-timeout 3000000
RUN yarn install
COPY ./prisma ./prisma
RUN yarn prisma generate
COPY . .
RUN yarn run build
CMD [ "node", "dist/src/main" ]