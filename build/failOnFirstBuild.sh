#!/bin/sh

echo "${GITHUB_REPOSITORY}"
echo "${DOCKER_SERVICE}"
if [ "${GITHUB_REPOSITORY}" != "kvalitetsit/klausuleret-tilskud-ui" ] && [ "${DOCKER_SERVICE}" = "kvalitetsit/klausuleret-tilskud-ui" ]; then
  echo "Please run setup.sh REPOSITORY_NAME"
  exit 1
fi
