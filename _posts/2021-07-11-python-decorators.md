---
title: "[Python] Decorators"
categories: [파이썬]
tags: [python, decorator]
mermaid: true
math: true
comments: true
pin: false
image:
  path:
  width:
  height:
  alt:
---

## Decorator 동작 이해

```python
class Decorator:
    def __init__(self, function):
        self.function = function

    def __call__(self, *args, **kwargs):
        print('preprocessing')
        if False:
            print("get")
            x = self.function(*args, **kwargs)
            print (x)
            print("set")
        else: 
            print("not used")
            x = self.function(*args, **kwargs)
            print(x)
        return x

@Decorator
def example():
    print('start')
    return 'return'

x = example()
print (x)

# output
preprocessing
not used
start
return
return
```

## Runtime Decorator

```python
import time

def runtime_decorator(func):
  def wrapper(*args, **kwargs):
    start = time.time()
    ret = func(*args)
    end = time.time()
    print(f'the function {func.__name__} took {end - start} seconds to run')
    return ret
  return wrapper

@runtime_decorator
def generate_numbers(n):
  # return [i for i in range(n)]
  return (i for i in range(n))

a = generate_numbers(100000)
# the function generate_numbers took 0.0058367252349853516 seconds to run

import sys
n = 100000
print(sys.getsizeof([i for i in range(n)]))
print(sys.getsizeof((i for i in range(n))))
```

## 참고

* https://towardsdatascience.com/10-fabulous-python-decorators-ab674a732871