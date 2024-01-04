FROM node:20-alpine

# Create the app directory in the container
WORKDIR /TokenServer

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of your app's source code to the container
COPY . .

ENV TBUSER='sergio.rubio@comsa.com'
ENV TBPASS='14647.Ser.gAR@'

EXPOSE 4000

CMD ["node", "server.js"]