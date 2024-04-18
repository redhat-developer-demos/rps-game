import torch.nn as nn

def freeze_weights(model):
    for params in model.parameters():
        params.requires_grad = False

def unfreeze_weights(model):
    for params in model.parameters():
        params.requires_grad = True

def add_head(model, n_outputs):
    model.fc = nn.Linear(model.fc.in_features, n_outputs, bias=True)        
