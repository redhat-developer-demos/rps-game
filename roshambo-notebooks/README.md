### Training

`python main.py --train_folder '../Rock-Paper-Scissors/train_aug24/' --test_folder '../Rock-Paper-Scissors/test/ --onnx_outfile 'test.onnx' --onnx_wrapped_outfile 'test_wrapped.onnx' --n_epochs=20`

### Inference

```
from export import *

run(model_fname, img_fname, transform)
```

where model_fname is the onnx file, img_fname is the png image, transform is the PyTorch image transformation (using the resnet one for now)
