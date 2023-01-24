---
title: "[Python] Pandas에서 특정 컬럼을 Label로 변경"
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

학습시 label의 값을 0 or 1로 변경할떼 사용

```python
# replace labels
train['income'] = np.where(train['income'] == '>50K', 1, 0)
val['income'] = np.where(val['income'] == '<=50K', 0, 1)

label_key = 'income'
label_dict = {'>50K': 1, '<=50K', 0}
train[label_key] = train[label_key].map(label_dict)
val[label_key] = val[label_key].map(label_dict)
```