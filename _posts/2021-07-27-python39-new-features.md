---
title: "[Python] 3.9버전에서 새롭게 사용할 수 있는 기능"
categories: [파이썬]
tags: [python, pythoh3.9, features]
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


## Merging two Dictionaries

```python
a = {‘first’: 1, 'second’: 2, 'python’: 3}
b = {’first’: 'third’, 'forth’: 'python3.9’}
a | b
{’second’: 2, 'python’: 3, ’first’:’third’,  'forth’: 'python3.9’}
b | a
{’first’: 1,’second’: 2, 'python’: 3, 'forth’:’python3.9’ }
```

## zoneinfo 새로운 모듈 추가

```python
from datatime import datetime
#from pytz import timezone <<<<<<<<<< #No need it!!!
from zoneinfo import ZoneInfo
current_t=datetime.now()
current_t_paris= datetime.now()
print(current_t.astimezone(ZonInfo('Europe/Paris')))
----------
2020-10-06 05:04:01.932145+06:00
```

## from typing import lis 를 할 필요 없음

```python
#from typing import List <<<<<<<<<< #No need it!!!
thelist: list[int] = [2,4,6,8]
print(thelist)
thelist: '2468'
print(thelist)
------------
[2,4,6,8]
2468
```

## prefix/suffix

```python
professors = ['Prof. A', 'Prof. B', 'Prof. C']
names_only=[]
for professor in professors:
    names_only.append(professor.removeprefix('Prof. ')
print(names_only)
-------------
['A', 'B', 'C']
```

https://towardsdatascience.com/python-3-9-is-available-and-you-must-use-these-great-features-316387e1d3e5