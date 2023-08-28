#!/usr/bin/env bash

MY_ROUTE=https://ai-service-rps-ai-service.apps.rhods-internal.61tk.p1.openshiftapps.com
MY_IMAGE='rock1.jpg'


curl "${MY_ROUTE}/status"
(echo -n '{"image": "'; base64 "${MY_IMAGE}"; echo '"}') | curl -X POST -H "Content-Type: application/json" -d @- ${MY_ROUTE}/predictions
