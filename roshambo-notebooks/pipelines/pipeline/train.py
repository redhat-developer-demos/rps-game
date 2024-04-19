# Replace with model training code


import os
import time

num_seconds = int(os.environ.get("num_seconds", default="60"))

time.sleep(num_seconds)

print("Task complete")