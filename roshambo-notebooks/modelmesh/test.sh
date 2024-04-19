MY_ENDPOINT=http://ai-service:8080
MY_IMAGE='images/rock.jpg'
curl "${MY_ROUTE}/status"
(echo -n '{"image": "'; base64 "${MY_IMAGE}"; echo '"}') | curl -X POST -H "Content-Type: application/json" -d @- ${MY_ENDPOINT}/predictions
