FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY server.js ./
ARG PORT=3000
ENV PORT=${PORT}
EXPOSE ${PORT}
HEALTHCHECK --interval=30s --timeout=3s \
    CMD wget -qO- http://localhost:${PORT}/health||exit 1
CMD ["node","server.js"]

