import cv2
import os
import glob
from PIL import Image
import numpy as np
import shutil

def canny(fname): 
    img = cv2.imread(fname) 

    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    img_blur = cv2.GaussianBlur(img_gray, (3,3), 0) 
 
    edges = cv2.Canny(image=img_blur, threshold1=100, threshold2=150) # Canny Edge Detection
    
    #return img, edges
    return edges

def contours(fname):
    img = cv2.imread(fname)
    img_gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    ret, thresh = cv2.threshold(img_gray, 127, 255, 0)
    contours, hierarchy = cv2.findContours(thresh, 
                                           cv2.RETR_TREE, 
                                           cv2.CHAIN_APPROX_SIMPLE)
    
    img_zeros = np.zeros_like(img)
    cv2.drawContours(img_zeros, contours, -1, (0,255,0), 3)
    
    return img_zeros


def preprocess(in_folder, 
               out_folder, 
               transform):
    
    in_folder = in_folder.rstrip(os.sep)
    out_folder = out_folder.rstrip(os.sep)

    if not os.path.exists(in_folder):
        raise ValueError(f'in_folder: {in_folder} does not exist')

    if os.path.exists(out_folder):
        raise ValueError(f'out_folder: {out_folder} already exists')
    
    os.makedirs(out_folder)
    for subdir in os.listdir(in_folder): #this is brittle - expects only labels here
        os.makedirs(f'{out_folder}{os.sep}{subdir}')

    in_files = glob.glob(f'{in_folder}/*/*')
    out_files = []
    for f in in_files:
        fname = f.split(os.sep)
        fname[-3] = out_folder.split(os.sep)[-1]
        out_fname = os.sep.join(fname)

        out_img = transform(f)
        Image.fromarray(out_img).save(out_fname)

    '''
    for subfolder in []:
        for file in :
            img = transform(file)

            img.save(out_folder, subfolder, file)
            '''

def create_test_folder(in_folder, test_pct=0.2, seed=0):
    np.random.seed(seed)

    assert 0 < test_pct < 1

    out_folder = in_folder.replace('train', 'test')

    if os.path.exists(out_folder):
        raise ValueError(f'out_folder {out_folder} already exists')
    os.makedirs(out_folder)

    for subdir in os.listdir(in_folder): #this is brittle - expects only labels here
        os.makedirs(f'{out_folder}{os.sep}{subdir}')

        in_files = glob.glob(f'{in_folder}{os.sep}{subdir}/*')

        test_files = np.random.choice(in_files,
                                      size=int(test_pct * len(in_files)),
                                      replace=False)
        
        for f in test_files:
            shutil.move(f, f'{out_folder}{os.sep}{subdir}')

'''
%loadext autoreload
%autoreload 2

from preprocess import *

create_test_folder('../Rock-Paper-Scissors/train_aug29')

preprocess('../Rock-Paper-Scissors/train_aug29', '../Rock-Paper-Scissors/train_aug29_edges', canny)

preprocess('../Rock-Paper-Scissors/test_aug29', '../Rock-Paper-Scissors/test_aug29_edges', canny)

preprocess('../Rock-Paper-Scissors/train_aug29', '../Rock-Paper-Scissors/train_aug29_contoursnobase', contours)

preprocess('../Rock-Paper-Scissors/test_aug29', '../Rock-Paper-Scissors/test_aug29_contoursnobase', contours)
'''