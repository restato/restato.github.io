---
title: "[Python] 부동산 실거래 매매 건수 확인 (분당구)"
categories: [파이썬]
tags: [python, realestate, streamlit]
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

오늘은 여기까지
현재 분당구를 기준으로 최근 1년, 3년, 6년 ,10년의 실거래 매매 건수를 확인 가능하도록 구성

![](/assets/2021-11/realestate-1.png)

```python
# header가 잘림
data.columns = [x +'\t' for x in data.columns]
```

streamlit에서 한글 버그가 있는건지
그냥 dataframe을 `st.dataframe(df)`로 작성하면
header가 짤리는데 짤리는걸 방지하기 위해 `\t`를 붙여준다.
