###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:18-alpine AS development

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./
COPY prisma ./prisma

RUN npm install
RUN npm run generate:dev
# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node
