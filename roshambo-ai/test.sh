#!/usr/bin/env bash

MY_ROUTE=http://localhost:8080
MY_IMAGE=$1


curl "${MY_ROUTE}/status"
(echo -n '{"image": "'; base64 "${MY_IMAGE}"; echo '"}') | curl -X POST -H "Content-Type: application/json" -d @- ${MY_ROUTE}/predictions
