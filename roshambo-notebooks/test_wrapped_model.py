import os
import torch, onnx, onnxruntime
from export import *
from model import *
import torchvision.transforms as tfms

inference_transform_list = [tfms.ToTensor(),
                            tfms.Resize((224, 224)), \
                            #tfms.Resize((256, 256))                                                                 
                            #tfms.CenterCrop((224, 224)), \
                            tfms.Normalize(mean=[0.485, 0.456, 0.406], \
                                           std=[0.229, 0.224, 0.225])]


#hacky version
raw_sess = create_session('resnet_raw.onnx') #expects transformed tensor
wrapped_sess = create_session('resnet_wrapped.onnx') #expects untransformed tensor

fname = 'Rock-Paper-Scissors/train/scissors/scissors01-000.png'
img = Image.open(fname).convert('RGB')
img_torch = torch.from_numpy(np.array(img)).permute(2,0,1)
img_torch_norm = img_torch.float() / 255.
img_transformed = tfms.Compose(inference_transform_list)(img)

#raw
raw_sess_inp = {raw_sess.get_inputs()[0].name: img_transformed.unsqueeze(0).numpy()}
raw_pred = raw_sess.run(None,
                        raw_sess_inp)[0]

#wrapped
wrapped_sess_inp = {wrapped_sess.get_inputs()[0].name: img_torch_norm.unsqueeze(0).numpy()}
wrapped_pred = wrapped_sess.run(None,
                                wrapped_sess_inp)[0]
