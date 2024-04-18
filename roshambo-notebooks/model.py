from torchvision.models import resnet18, ResNet18_Weights
import torch.nn as nn


def get_resnet():
    net = resnet18(weights=ResNet18_Weights.IMAGENET1K_V1)
    transform = ResNet18_Weights.IMAGENET1K_V1.transforms()

    return net, transform

'''hard-coding resnet transform here for inference (for now)
Note: not using transforms.Compose since the JIT compiler doesn't
"like" it. Need to look at it in more detail. Just passing list
for now
'''

import torchvision.transforms as tfms
inference_transform_list = [tfms.Resize((224, 224)), \
                            #tfms.Resize((256, 256))
                            #tfms.CenterCrop((224, 224)), \
                            tfms.Normalize(mean=[0.485, 0.456, 0.406], \
                                           std=[0.229, 0.224, 0.225])]

class CustomTransformList(nn.Module):
    def __init__(self, t):
        super().__init__()
        self.t = nn.ModuleList(t)

    def forward(self, x):
        for transform in self.t:
            x = transform(x)
        return x

class Model(nn.Module):
    def __init__(self, net, transform):
        super().__init__()

        if not isinstance(transform, CustomTransformList):
            raise TypeError(f"transform should be of type CustomTransformList")
            
        self.transform = transform
        self.net = net
        
    def forward(self, x):
        x = self.transform(x)
        out = self.net(x)

        return out
