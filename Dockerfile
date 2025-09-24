# STAGE 1: Build the Angular application
FROM node:20-alpine AS build
WORKDIR /app

# Copy the angular app
COPY ./itukt-ui /app

# Build the angular app
RUN npm install
RUN npm run build

# STAGE 2: Download and build our environment injector
FROM golang:1.24.2-alpine3.21 AS go-downloader
RUN apk update && apk upgrade && \
    apk add --no-cache bash git openssh
RUN go install github.com/KvalitetsIT/runtime-js-env@83fdece6e4a6244909157ab100b091cb611ad481

# STAGE 3: Copy the built application into Nginx for serving
FROM nginx:alpine3.22

COPY --from=build /app/dist/itukt-ui/browser /usr/share/nginx/html

# Copy package-lock for easier CVE scanning
COPY --from=build /app/package-lock.json /opt/kvalitetsit/package-lock.json

# Copy the runtime-js-env binary
COPY --from=go-downloader /go/bin/runtime-js-env /

# Copy custom nginx config
COPY ./itukt-ui/nginx/nginx.conf /etc/nginx/nginx.conf
COPY ./itukt-ui/nginx/mime.types /etc/nginx/mime.types
RUN rm /docker-entrypoint.d/10-listen-on-ipv6-by-default.sh

# Set permissions
RUN mkdir -p /var/cache/nginx /var/run && \
    chown -R 101:101 /usr/share/nginx/html /var/cache/nginx /var/run && \
    find /usr/share/nginx/html -type d -exec chmod 755 {} \; && \
    find /usr/share/nginx/html -type f -exec chmod 644 {} \; && \
    chmod 664 /usr/share/nginx/html/index.html || true

# Set TMPDIR to a writable location
ENV TMPDIR=/usr/share/nginx/html/

# Use non-root user
USER 101

# Run our startup script
# TODO: runtime-js-env skal sandsynligvis lige tweakes til at virke med vores angular-setup
CMD ["/bin/sh", "-c", "/runtime-js-env -i /usr/share/nginx/html/index.html || true; exec nginx -g 'daemon off;'"]
