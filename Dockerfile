FROM node:22-alpine
WORKDIR /app
COPY server/package*.json server/
COPY web/package*.json web/
RUN cd server && npm ci --omit=dev && cd ../web && npm ci
COPY . .
RUN cd web && npm run build
ENV PORT=4000 KARTO_DB=/data/karto.db
VOLUME /data
EXPOSE 4000
CMD ["node", "--no-warnings", "server/index.js"]
