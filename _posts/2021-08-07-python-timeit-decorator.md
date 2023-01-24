---
title: "[Python] Timeit Decorator (함수 실행시간 체크)"
categories: ["파이썬"]
tags: ["python", "decorator", "timeit"]
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

### Decorator 생성

```python
import time

def timeit(f):
    def timed(*args, **kw):
        start_time = time.time()
        result = f(*args, **kw)
        end_time = time.time()
        # print(f'func:{f.__name__} args:[{args}, {kw}] took: {end_time - start_time:.2f} sec')
        elapsed_time = end_time - start_time
        print(f'func:{f.__name__} took: {elapsed_time:.2f} sec')
        return result, elapsed_time
    return timed
```

### Decorator 사용

```python
import time
from decorator import timeit

@timeit
def foo():
    time.sleep(3)
    return 3

def main()
    result, elapsed_time = foo() # elapsed time 사용 안할꺼면 응답으로 안받아도 가능
    result = foot()

# fun:foo took: 3 sec
```

### Decorator 에 파라미터 사용

```python
import time

def timeit(debug=False):
    def _timeit(func):
        def wrapper(*args, **kw):
            start_time = time.time()
            result = func(*args, **kw)
            end_time = time.time()
            # print(f'func:{f.__name__} args:[{args}, {kw}] took: {end_time - start_time:.2f} sec')
            elapsed_time = end_time - start_time
            if debug:
                logger.info(f'func:{func.__name__} took: {end_time - start_time:.2f} sec')
            return result, elapsed_time
        return wrapper
    return _timeit

# debug mode
@timeit(True)
def foo():
    time.sleep(3)
    return 3

@timeit()
def foo():
    time.sleep(3)
    return 3
```