import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader

from torchvision.datasets import ImageFolder
import torchvision.transforms as tfms
from torchvision.models import resnet18, ResNet18_Weights

import numpy as np
import matplotlib.pyplot as plt
plt.ion()

from PIL import Image

def get_crit_opt(net):
    criterion = nn.CrossEntropyLoss(reduction='sum')
    optimizer = optim.AdamW(net.parameters(), lr=1e-4)

    return criterion, optimizer

def train(n_epochs, 
          net, 
          dl_train,
          dl_val,
          criterion, 
          optimizer, 
          print_freq,
          device):

    net = net.to(device)
    net.train()
    for n in range(n_epochs):
        total_loss = 0
        total_n = 0
        
        for idx, (X, y) in enumerate(dl_train):
            X = X.to(device)
            y = y.to(device)
            pred = net(X)

            optimizer.zero_grad()
            loss = criterion(pred, y)
            loss.backward()
            optimizer.step()

            total_loss += loss.item()
            total_n += X.shape[0]

        if n % print_freq == 0:
            val_loss, val_acc = validate(net, dl_val, criterion, device)
            print(f'epoch = {n} train loss = {total_loss/total_n} val loss = {val_loss} val acc = {val_acc}')
            
    return net, optimizer

@torch.no_grad()
def validate(net, dl_val, criterion, device):
    net.eval()
    
    val_loss = 0
    total_n = 0

    correct_n = 0
    
    for idx, (X, y) in enumerate(dl_val):
        X = X.to(device)
        y = y.to(device)
        
        pred = net(X)
        val_loss += criterion(pred, y).item()

        correct_n += (pred.argmax(dim=1)==y).sum()

        total_n += X.shape[0]
        
    net.train()
    
    return val_loss / total_n, correct_n / total_n
