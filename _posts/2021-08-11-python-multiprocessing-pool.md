---
title: "[Python] multiprocessing Pool"
categories: [파이썬]
tags: [python, multiprocessing, pool]
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

파이썬에서 큰 리스트가 주어졌을때, 리스트를 `multiprocessing`을 통해 처리하는 방법, 리스트에 파일 경로가 포함되어 있다면 각 파일별로 프로세스가 처리

```python
import multiprocessing as np

def get_stats(filepath):
    stats = {}
    with open(filepath) as f:
        # read file
    return stats


filepaths = []
n_procs = 4
p = mp.Pool(n_procs)
proc_results = p.map(get_stats, filepaths)
p.close()
p.join()

# merge proc_results
```