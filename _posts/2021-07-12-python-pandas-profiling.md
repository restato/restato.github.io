---
title: "[Python] EDA 대신 Pandas Profiling"
categories: [파이썬]
tags: [python, pandas, profiling, eda]
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

## Example

* [examples](https://pandas-profiling.github.io/pandas-profiling/docs/master/rtd/pages/examples.html)
* [census_report](https://pandas-profiling.github.io/pandas-profiling/examples/master/census/census_report.html#overview-variable_descriptions)

## Default

```python
from pandas_profiling import ProfileReport

pr = ProfileReport(pdf2)
pr.to_file(output_file="feature_profiling.html")

# Disable samples, correlations, missing diagrams and duplicates at once
r = ProfileReport(
    samples=None,
    correlations=None,
    missing_diagrams=None,
    duplicates=None,
    interactions=None,
)
```

* [config_default.yaml](https://github.com/pandas-profiling/pandas-profiling/blob/master/src/pandas_profiling/config_default.yaml)
* 내가 필요한 부분만 분석하고 싶으면
  * <https://pandas-profiling.github.io/pandas-profiling/docs/master/rtd/pages/advanced_usage.html>

## Minimal

```python
from pandas_profiling import ProfileReport

pr = ProfileReport(pdf2, minimal=True)
pr.to_file(output_file="feature_profiling.html")
```

* [config_minimal.yaml](https://github.com/pandas-profiling/pandas-profiling/blob/master/src/pandas_profiling/config_minimal.yaml)

## Parameters

```python
# Number of workers in thread pool. When set to zero, it is set to the number of CPUs available.
# pool_size, default = 0
pr = ProfileReport(df, minimal=True, pool_size=0) 
```

* 기본값으로 모든 thread pool을 사용도록 설정되어 있음

## 화면에 표시

```python
# Widget 형태로 보여서 확인하기가 편함 (Tab으로 각각 속성에 대해서 보여줌)
pr.to_widgets()
```

## 참고

* <https://github.com/pandas-profiling/pandas-profiling>
* <https://pandas-profiling.github.io/pandas-profiling/docs/master/rtd/pages/advanced_usage.html>