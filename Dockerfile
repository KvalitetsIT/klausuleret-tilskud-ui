# STAGE 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Install Java and bash
RUN apk add --no-cache openjdk21
 
# Copy the angular app
COPY ./itukt-ui /app

# Install dependencies
RUN npm install
 
# Build the angular app
RUN npm run build

# STAGE 2: Download and build our environment injector
FROM golang:1.24.2-alpine3.21 AS go-downloader
RUN apk update && apk upgrade && apk add --no-cache bash git openssh
RUN go install github.com/KvalitetsIT/runtime-js-env@83fdece6e4a6244909157ab100b091cb611ad481

# STAGE 3: Copy the built application into Nginx for serving
FROM nginxinc/nginx-unprivileged:alpine3.24

COPY --from=build /app/dist/itukt-ui/browser /etc/nginx/html

# Copy package-lock for easier CVE scanning
COPY --from=build /app/package-lock.json /opt/kvalitetsit/package-lock.json

# Copy the runtime-js-env binary
COPY --from=go-downloader /go/bin/runtime-js-env /

# Copy custom nginx config
COPY ./itukt-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./itukt-ui/nginx/mime.types /etc/nginx/mime.types

COPY entrypoint.sh .

USER root
RUN chown nginx:nginx /etc/nginx/html/
RUN chmod 700 /etc/nginx/html/
USER nginx
ENTRYPOINT ["/entrypoint.sh"]