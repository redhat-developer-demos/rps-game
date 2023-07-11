#!/usr/bin/env bash

MY_ROUTE=http://localhost:5000
MY_IMAGE='rock1.jpg'


curl "${MY_ROUTE}/status"
(echo -n '{"image": "'; base64 "${MY_IMAGE}"; echo '"}') | curl -X POST -H "Content-Type: application/json" -d @- ${MY_ROUTE}/predictions
