#! /bin/sh

/runtime-js-env -i /etc/nginx/html/index.html -w __RUNTIME_CONFIG__ -p ITUKT_

exec nginx -g "daemon off;"