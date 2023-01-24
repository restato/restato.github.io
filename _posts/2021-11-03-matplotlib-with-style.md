---
title: "[Python] Matplotlib 스타일 지정하기"
categories: [파이썬]
tags: [python, matplotlib, style]
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

### 가능한 스타일 확인

```python
import matplotlib.pyplot as plt
print(plt.style.available)
# ['Solarize_Light2', '_classic_test_patch', 'bmh', 'classic', 'dark_background', 'fast', 'fivethirtyeight', 'ggplot', 'grayscale', 'seaborn', 'seaborn-bright', 'seaborn-colorblind', 'seaborn-dark', 'seaborn-dark-palette', 'seaborn-darkgrid', 'seaborn-deep', 'seaborn-muted', 'seaborn-notebook', 'seaborn-paper', 'seaborn-pastel', 'seaborn-poster', 'seaborn-talk', 'seaborn-ticks', 'seaborn-white', 'seaborn-whitegrid', 'tableau-colorblind10']
```

### 스타일 지정

```python
import matplotlib.pyplot as plt 
plt.style.use('seaborn')
# 지정해도 변하지 않는다면 seaborn이 없어서
# pip install seaborn
```


### 참고

<https://matplotlib.org/stable/tutorials/introductory/customizing.html>