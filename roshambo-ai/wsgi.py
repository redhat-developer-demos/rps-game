import json
import os
import uuid
import logging
from flask import Flask, jsonify, request
from prediction import predict

log_level = os.getenv("LOG_LEVEL", "INFO").upper()
logging.basicConfig(level=log_level)
formatter = logging.Formatter('%(asctime)s - %(levelname)s - %(message)s')
handler = logging.StreamHandler()
handler.setFormatter(formatter)
logging.getLogger().addHandler(handler)

application = Flask(__name__)


@application.route('/')
@application.route('/status')
def status():
    logging.debug('responding OK to /status check')
    return jsonify({'status': 'ok'})


@application.route('/predictions', methods=['POST'])
def create_prediction():
    short_uuid = uuid.uuid4().hex[:8]
    logging.info('prediction request received (ID:' + short_uuid + ')')
    
    data = request.data or '{}'
    body = json.loads(data)
    
    result = jsonify(predict(body))
    logging.info('prediction request complete (ID:' + short_uuid + ')')
    return result
