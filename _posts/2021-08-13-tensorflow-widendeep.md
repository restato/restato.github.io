---
title: "[Tensorflow] Wide&Deep, Deep&Cross 모델 생성"
categories: [텐서플로우]
tags: [tensorflow, widendeep, deepncross]
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

### Wide & Depp

```python
wide = layers.BatchNormalization()(wide)
for units in hidden_units:
    deep = layers.Dense(units)(deep)
    deep = layers.BatchNormalization()(deep)
    deep = layers.ReLU()(deep)
    deep = layers.Dropout(dropout)(deep)
merged = layers.concatenate([wide, deep])
return layers.Dense(1, activation='sigmoid')(merged)
```

### Deep & Cross

```python
cross = deep
for _ in hidden_units:
    units = cross.shape[-1]
    x = layers.Dense(units)(cross)
    cross = deep * x + cross
cross = layers.BatchNormalization()(cross)
for units in hidden_units:
    deep = layers.Dense(units)(deep)
    deep = layers.BatchNormalization()(deep)
    deep = layers.ReLU()(deep)
    deep = layers.Dropout(dropout)(deep)
merged = layers.concatenate([cross, deep])
model = layers.Dense(1, activation='sigmoid')(merged)
```

* 참고
  * <https://stackoverflow.com/questions/43196636/how-to-concatenate-two-layers-in-keras>
  * <https://github.com/tensorflow/tensorflow/issues/27416#issuecomment-502218673>
  * <https://keras.io/examples/structured_data/wide_deep_cross_networks/>
  * <https://towardsdatascience.com/batch-normalization-in-practice-an-example-with-keras-and-tensorflow-2-0-b1ec28bde96f>