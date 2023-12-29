FROM node:20-alpine

# Create the app directory in the container
WORKDIR /ConfortUI

COPY dist .

RUN npm install -g serve

EXPOSE 3000

CMD ["serve"]
