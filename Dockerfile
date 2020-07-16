FROM node:13-slim

# Set environnement to development
ENV NODE_ENV=development

# Add some dependencies for (bcrypt)
RUN apt-get update && apt-get install -y --no-install-recommends \
  build-essential \
  python && \
  rm -rf /var/lib/apt/lists/*

# Change for app directory
WORKDIR /node/app

# Copy npm dependencies
COPY --chown=node:node package*.json yarn.lock* ./

# Create app directory to contain the app and set permission for node user
RUN chown -R node:node .

# Change the user to be node
USER node

# Install dependencies
RUN yarn install && yarn cache clean

# Add to PATH
ENV PATH="$PATH:./node_modules/.bin"
RUN npm config set scripts-prepend-node-path true

# Copy existing local files into container, and set permission to node user
COPY --chown=node:node  . .

RUN tsc || exit 0

# Use your dev command described in package.json
CMD [ "yarn", "start" ]