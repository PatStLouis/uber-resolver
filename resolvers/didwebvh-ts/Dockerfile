FROM node:22-bookworm-slim
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci 2>/dev/null || npm install
COPY src ./src
RUN chown -R node:node /app
ENV PORT=8083
EXPOSE 8083
USER node
CMD ["npm", "start"]
