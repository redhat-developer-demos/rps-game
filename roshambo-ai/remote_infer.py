import requests
import json
import numpy as np
import cv2
import matplotlib.pyplot as plt
import os

# Class labels for Rock-Paper-Scissors detection
rps_classes = {0: "paper", 1: "rock", 2: "scissors"}

def preprocess(image_path):
    """
    Reads and preprocesses the image for ONNX inference.
    Converts the image to a 640x640 RGB array.
    """
    original_image = cv2.imread(image_path)
    if original_image is None:
        raise ValueError(f"Error: Image '{image_path}' not found.")

    height, width, _ = original_image.shape
    scale = (height / 640, width / 640)  # Scale factors

    # Convert image to blob for model inference
    blob = cv2.dnn.blobFromImage(original_image, scalefactor=1 / 255, size=(640, 640), swapRB=True)

    return blob, scale, original_image

def _serialize(image):
    """
    Converts the preprocessed image into a JSON payload for KServe.
    """
    payload = {
        "inputs": [
            {
                "name": "images",
                "shape": [1, 3, 640, 640],
                "datatype": "FP32",
                "data": image.flatten().tolist(),
            },
        ]
    }
    return payload


def send_request(image, endpoint):
    """
    Sends a POST request to the KServe endpoint and retrieves the model's predictions.
    """
    print("ENDPOINT" + endpoint)
    payload = _serialize(image)
    #print(payload)
    raw_response = requests.post(endpoint, json=payload)

    # Handle errors
    if raw_response.status_code != 200:
        print(f"Failed to get a response from KServe. Status Code: {raw_response.status_code}")
        print(f"Response: {raw_response.text}")
        raise ValueError("Inference request failed.")

    # Parse JSON response
    response = raw_response.json()
    try:
        model_output = response["outputs"]
        print(model_output)
    except KeyError:
        print(f"Unexpected response format: {response}")
        raise ValueError("Failed to extract model output.")

    return np.array(model_output[0]["data"]).reshape(model_output[0]["shape"])

def draw_bounding_box(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
    """
    Draws bounding boxes on the detected objects.
    """
    label = f"{rps_classes[class_id]} {confidence:.2f}"
    text_color_bg = (0, 200, 0)  # Green box for better visibility

    # Draw the bounding box
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), text_color_bg, 2)

    # Draw label background
    (label_width, label_height), _ = cv2.getTextSize(label, cv2.FONT_HERSHEY_SIMPLEX, 0.5, 1)
    cv2.rectangle(img, (x, y - label_height), (x + label_width, y), text_color_bg, cv2.FILLED)
    cv2.putText(img, label, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (255, 255, 255), 1, cv2.LINE_AA)


def postprocess(response, scale, original_image):
    """
    Processes the model response to extract bounding boxes and class predictions.
    """
    outputs = np.array([cv2.transpose(response[0])])
    rows = outputs.shape[1]

    boxes = []
    scores = []
    class_ids = []

    # Extract bounding boxes and class IDs
    for i in range(rows):
        classes_scores = outputs[0][i][4:]
        (_, maxScore, _, (_, maxClassIndex)) = cv2.minMaxLoc(classes_scores)
        if maxScore >= 0.25:
            box = [
                outputs[0][i][0] - (0.5 * outputs[0][i][2]),
                outputs[0][i][1] - (0.5 * outputs[0][i][3]),
                outputs[0][i][2],
                outputs[0][i][3],
            ]
            boxes.append(box)
            scores.append(maxScore)
            class_ids.append(maxClassIndex)

    result_boxes = cv2.dnn.NMSBoxes(boxes, scores, 0.25, 0.45, 0.5)

    detections = []
    for i in range(len(result_boxes)):
        index = result_boxes[i]
        box = boxes[index]
        detection = {
            "class_id": class_ids[index],
            "class_name": rps_classes[class_ids[index]],
            "confidence": scores[index],
            "box": box,
            "scale": scale,
        }
        print("Detection")
        print("class_name: "+ rps_classes[class_ids[index]])
        print("id "+rps_classes[class_ids[index]])
        detections.append(detection)


        # Draw bounding boxes on image
        draw_bounding_box(
            original_image,
            class_ids[index],
            scores[index],
            round(box[0] * scale[1]),
            round(box[1] * scale[0]),
            round((box[0] + box[2]) * scale[1]),
            round((box[1] + box[3]) * scale[0]),
        )

    return original_image

def postprocess(response):
    """
    Processes the model response to extract bounding boxes and class predictions.
    """
    outputs = np.array([cv2.transpose(response[0])])
    rows = outputs.shape[1]

    boxes = []
    scores = []
    class_ids = []

    # Extract bounding boxes and class IDs
    for i in range(rows):
        classes_scores = outputs[0][i][4:]
        (_, maxScore, _, (_, maxClassIndex)) = cv2.minMaxLoc(classes_scores)
        if maxScore >= 0.25:
            box = [
                outputs[0][i][0] - (0.5 * outputs[0][i][2]),
                outputs[0][i][1] - (0.5 * outputs[0][i][3]),
                outputs[0][i][2],
                outputs[0][i][3],
            ]
            boxes.append(box)
            scores.append(maxScore)
            class_ids.append(maxClassIndex)

    result_boxes = cv2.dnn.NMSBoxes(boxes, scores, 0.25, 0.45, 0.5)

    detections = []
    #for i in range(len(result_boxes)):
    index = result_boxes[0]
    box = boxes[index]
    detection = {
        "class_id": class_ids[index],
        "class_name": rps_classes[class_ids[index]],
        "confidence": scores[index],
        "box": box
    }
    print("Detection")
    print("class_name: "+ rps_classes[class_ids[index]])
    print("confidence "+str(scores[index]))
    detections.append(detection)


    return rps_classes[class_ids[index]]

def process_image(image_path, endpoint):
    """
    Complete pipeline: preprocess, send request, postprocess results.
    """
    preprocessed, scale, original_image = preprocess(image_path)
    response = send_request(preprocessed, endpoint)
    new_image = postprocess(response, scale, original_image)

    return new_image


def send_image(image_path, endpoint):
    """
    Complete pipeline: preprocess, send request, postprocess results.
    """
    preprocessed, scale, original_image = preprocess(image_path)
    response = send_request(preprocessed, endpoint)

    return response