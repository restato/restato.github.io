---
title: "[Python] Pandas에서 NaN인 로우 가져오기"
categories: [파이썬]
tags: [python, padnas, nan]
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
df[df['floor'].isna()]
```

데이터 cleansing 을 할때는

```python
def cleansing(df: pd.DataFrame) -> pd.DataFrame:
    print('*** NaN ***')
    print(df.isna().sum())
    print('*** null ***')
    print(df.isnull().sum())
```