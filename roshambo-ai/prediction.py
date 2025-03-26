import os
import base64
import numpy as np
import cv2
import time
import classes
from remote_infer import send_request, postprocess


MODEL_HOST = os.environ.get('MODEL_HOST',"yolo-rps")
# Define KServe inference endpoint
MODEL_NAME = os.environ.get('MODEL_NAME', 'yolo-rps-v2')
MODEL_URL = os.environ.get('MODEL_URL',f"https://{MODEL_HOST}/v2/models/{MODEL_NAME}/infer")



def preprocess2(img_data):
    mean_vec = np.array([0.485, 0.456, 0.406])
    stddev_vec = np.array([0.229, 0.224, 0.225])
    norm_img_data = np.zeros(img_data.shape).astype('float32')
    for i in range(img_data.shape[0]):
        # for each pixel in each channel, divide the value by 255 to get value between [0, 1] and then normalize
        norm_img_data[i,:,:] = (img_data[i,:,:]/255 - mean_vec[i]) / stddev_vec[i]
    return norm_img_data


def preprocess(content, size=640):
    img = np.frombuffer(content, dtype=np.uint8)
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)  # BGR format
    # format of data is HWC
    # add image preprocessing if needed by the model
    img = cv2.resize(img, (640, 640))
    img = img.astype('float32')
    #convert to NCHW
    img = img.transpose(2,0,1)
    # normalize to adjust to model training dataset
    #img = preprocess2(img)


    img = img.reshape(1,3,size,size)

    img = img.astype(np.float32) / 255.0
    img = np.expand_dims(img, axis=0)  # Add batch
    # print(path, img.shape, "; data range:",np.amin(img),":",np.amax(img))
    return img


def infer(response, size=640):

    arr = np.frombuffer(response.raw_output_contents[0], dtype=np.float32)
    max = np.argmax(arr)
    class_name = classes.rps_classes[max]

    return class_name


def predict(body):
    base64img = body.get('image')
    img_bytes = base64.decodebytes(base64img.encode())
    data = preprocess(img_bytes)
    response = send_request(data, MODEL_URL)
    #class_name = infer(response)
    class_name=postprocess(response)
    return { 'prediction': class_name }
