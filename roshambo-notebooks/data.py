from torch.utils.data import DataLoader
from torchvision.datasets import ImageFolder

def get_ds_dl(transform, 
              batch_size,
              train_folder='Rock-Paper-Scissors/train/',
              test_folder='Rock-Paper-Scissors/test/'):
    
    ds_train = ImageFolder(train_folder, transform=transform)
    ds_test = ImageFolder(test_folder, transform=transform)
    
    dl_train = DataLoader(ds_train, batch_size=batch_size)
    dl_test = DataLoader(ds_test, batch_size=batch_size)

    return ds_train, ds_test, dl_train, dl_test
