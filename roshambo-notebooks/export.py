import torch
import onnx
import onnxruntime

from model import *

from PIL import Image
import numpy as np

def export_to_onnx(net, dummy_input, device, out_fname):
    #dummy_input = torch.randn(inp_size, requires_grad=True).to(device)
    net = net.to(device)
    net = net.eval()
    
    torch.onnx.export(net,
                      dummy_input,
                      out_fname,
                      export_params=True,
                      input_names = ['input'],
                      output_names = ['output'],
                      dynamic_axes = {'input': {0: 'batch_size'},
                                      'output': {0: 'batch_size'}
                                      },
                      verbose = True
                      )

def test_onnx_model(fname):
    onnx_model = onnx.load(fname)
    onnx.checker.check_model(onnx_model)

def create_session(model_fname):
    sess = onnxruntime.InferenceSession(model_fname)

    return sess
    
def predict(sess,
            img_fname,
            transform):

    img = Image.open(img_fname).convert('RGB')
    inp = transform(img).unsqueeze(0).numpy()

    sess_inp = {sess.get_inputs()[0].name: inp}
    
    sess_pred = sess.run(
        None,
        sess_inp)

    pred = sess_pred[0]

    return pred

net, transform = get_resnet() #hard-coding resnet here -> might need to generalize later

def run(model_fname, img_fname, transform):
    sess = create_session(model_fname)
    pred = predict(sess, img_fname, transform)

    return pred
    
    
