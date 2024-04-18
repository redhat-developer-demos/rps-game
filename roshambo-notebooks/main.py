import torch
import torchvision.transforms as tfms
import argparse

#should be more careful but importing everything
from model import *
from utils import *
from data import *
from train import *
from export import *

parser = argparse.ArgumentParser()
parser.add_argument('--n_outputs', type=int, default=3, required=False)
parser.add_argument('--batch_size', type=int, default=64, required=False)
parser.add_argument('--train_folder', required=True)
parser.add_argument('--test_folder', required=True)
parser.add_argument('--n_epochs', type=int, default=10, required=False)
parser.add_argument('--onnx_outfile', required=True)
#parser.add_argument('--onnx_wrapped_outfile', required=True)
args = parser.parse_args()


'''
n_outputs = 3 #how many classes to predict
batch_size = 64
n_epochs = 0
print_freq = 1
train_folder='Rock-Paper-Scissors/train/'
test_folder='Rock-Paper-Scissors/test/'
onnx_outfile = 'resnet_raw.onnx'
onnx_wrapped_outfile = 'resnet_wrapped.onnx'
'''

n_outputs = args.n_outputs
batch_size = args.batch_size
n_epochs = args.n_epochs
train_folder = args.train_folder
test_folder = args.test_folder
onnx_outfile = args.onnx_outfile
#onnx_wrapped_outfile = args.onnx_wrapped_outfile
print_freq = 1

print(f'Training Data: {train_folder}')
print(f'Test     Data: {test_folder}')

if __name__ == '__main__':
    torch.manual_seed(1234) #fix seed for reproducibility
    device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
    print(f'Using device: {device}')

    print(f'Loading pre-trained network and adding head...')
    net, transform = get_resnet()
    #unfreeze_weights(net)
    add_head(net, n_outputs)

    transform = tfms.Compose([transform, 
                              tfms.RandomRotation(45),
                              tfms.RandomHorizontalFlip()])
    print(f'DONE Loading pre-trained network and adding head\n')

    print(f'Loading criterion, optimizer and dataloaders...')
    criterion, optimizer = get_crit_opt(net)
    ds_train, ds_test, dl_train, dl_test = get_ds_dl(transform, 
                                                    batch_size,
                                                    train_folder,
                                                    test_folder)
    print(f'DONE Loading criterion, optimizer and dataloaders\n')

    print(f'Launching training loop...')
    net, optimizer = train(n_epochs,
                        net, 
                        dl_train,
                        dl_test,
                        criterion, 
                        optimizer, 
                        print_freq,
                        device)
    print(f'DONE Launching training loop\n')

    '''
    Export to ONNX

    Note that:
    - The input to net (the output of train) is a transformed image
    - The input to model (defined below) is an untransformed image and the transformations
    are done in the forward function.
    '''

    #unwrapped model - expects transformed tensor
    dummy_input = torch.randn(ds_train[0][0].unsqueeze(0).shape, requires_grad=True).to(device)
    export_to_onnx(net, dummy_input, device, onnx_outfile)


    #wrapped model - expects tensor scaled by 1/255.
    '''
    inference_transform = CustomTransformList(inference_transform_list)
    model = Model(net, inference_transform)

    dummy_input = Image.open('test.jpg').convert('RGB') #hard-coded for now
    dummy_input = torch.from_numpy(np.array(dummy_input)).permute(2,0,1).float().unsqueeze(0).to(device)
    dummy_input = dummy_input / 255.

    export_to_onnx(model, dummy_input, device, onnx_wrapped_outfile)
    '''