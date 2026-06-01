#!/bin/sh

set -e

rm -rf src/generated
npm install --save-dev @openapitools/openapi-generator-cli@2.13.2
npx openapi-generator-cli generate -i api/management.yaml -g typescript-angular -o src/generated/management --additional-properties=typescriptThreePlus=true