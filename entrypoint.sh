#! /bin/sh

echo "Injecting runtime configuration..."
/runtime-js-env -i /etc/nginx/html/index.html -w __RUNTIME_CONFIG__ -p ITUKT_

# Let the nginx user read the html
chmod -R 555 /etc/nginx/html

# Let the nginx user write to stdout and stderr
chmod 666 /dev/stdout /dev/stderr

echo "Starting nginx as nginx user..."
exec su-exec nginx "$@"