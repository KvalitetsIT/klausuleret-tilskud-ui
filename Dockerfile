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
FROM nginx:alpine3.22

COPY --from=build /app/dist/itukt-ui/browser /usr/share/nginx/html

# Copy package-lock for easier CVE scanning
COPY --from=build /app/package-lock.json /opt/kvalitetsit/package-lock.json

# Copy the runtime-js-env binary
COPY --from=go-downloader /go/bin/runtime-js-env /

# Copy custom nginx config
COPY ./itukt-ui/nginx/nginx.conf /usr/share/nginx/nginx.conf
COPY ./itukt-ui/nginx/mime.types /usr/share/nginx/mime.types
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

RUN mkdir -p /var/cache/nginx/
RUN chmod 777 /var/cache/nginx/

# Run our startup script
CMD /runtime-js-env -i usr/share/nginx/html/index.html -w __RUNTIME_CONFIG__ -p ITUKT_ && \
    chmod 777 /usr/share/nginx/html/index.html &&\
    cp -R /usr/share/nginx/* /temp/etc/nginx/ &&\
    cp -R -p /var/cache/nginx /temp/var/cache/ &&\
    cp -R /docker-entrypoint.d/* /temp/docker-entrypoint.d/
