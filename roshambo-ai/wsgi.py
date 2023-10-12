import json
import os
import uuid
import logging
from flask import Flask, jsonify, request
from prediction import predict

log_level = os.getenv("LOG_LEVEL", "INFO").upper()

application = Flask(__name__)

formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
app.logger.addHandler(handler)
app.logger.setLevel(log_level)

@application.route('/')
@application.route('/status')
def status():
    logging.debug('responding OK to /status check')
    return jsonify({'status': 'ok'})


@application.route('/predictions', methods=['POST'])
def create_prediction():
    short_uuid = uuid.uuid4().hex[:8]
    application.logger.info('prediction request received (ID:' + short_uuid + ')')
    
    data = request.data or '{}'
    body = json.loads(data)
    
    result = jsonify(predict(body))
    application.logger.info('prediction request complete (ID:' + short_uuid + ')')
    return result
