---
title: "[Tensorflow] DNN 모델"
categories: [텐서플로우]
tags: [tensorflow, dnn, model]
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
model = tf.keras.Sequential([
    input_layers,
    layers.Dense(1024, activation='relu'),
    layers.BatchNormalization(),
    layers.Dense(512, activation='relu'),
    layers.BatchNormalization(),
    layers.Dropout(.2),
    layers.Dense(1, activation='sigmoid')
])
model.compile(optimizer, loss, metrics) 
model.fit(train_ds, val_ds, epochs, callbacks)
```

```python
for units in hidden_units:
    inputs = layers.Dense(units)(inputs)
    inputs = layers.BatchNormalization()(inputs)
    inputs = layers.ReLU()(inputs)
    inputs = layers.Dropout(dropout)(inputs)
model = layers.Dense(1, activation='sigmoid')(inputs)
```