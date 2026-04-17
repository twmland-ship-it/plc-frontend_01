# 多階段建置：Node 產出 dist → nginx:alpine 提供靜態 SPA（80）。
# Aspire AppHost 以 AddDockerfile 編排；本機亦可 docker build -t frontend:latest .
# 與 repo 根目錄 docker-compose.yml（掛載舊版 nginx.conf）路徑不同，請以本檔為準。

FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
# package-lock 與 apexcharts / vue3-apexcharts 等 peer 在嚴格模式下會失敗，與本機慣用解法一致
RUN npm ci --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.docker.map.conf /etc/nginx/conf.d/00-map.conf
COPY nginx.docker.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
