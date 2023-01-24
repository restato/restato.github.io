---
title: "[Python] JupyterLab 한글 깨짐, 설정하는 방법"
categories: []
tags: []
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

```python
import maplotlib.pylab as plt
import matplotlib
# 한글 깨짐
plt.rcParams['font.famlity'] = 'D2 Coding'
plt.rcParams['font.size'] = '11'
# 마이너스 깨짐 (matplotrc 에서 수정하면 이후에 수정할 필요 없음)
matplotlib.rcParams['axes.unique_minus'] = False
```

```python
import matplotlib.font_manager as fm
# 설치된 론트 확인
print(fm.findSystemFonts(fontpaths = None, fontext = 'ttf')) 
```