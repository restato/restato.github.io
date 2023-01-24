---
title: "[Pyspark] Wilson Score UDF"
categories: [스파크]
tags: [pyspark, wilson, udf, pandas]
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
def ci_lower_bound(imp, clk, z): # confidence interval lower bound
    n = imp
    if n == 0:
        return 0

    # z = 1.0 #1.44 = 85%, 1.96 = 95%
    phat = float(clk) / n
    return ((phat + z*z/(2*n) - z * sqrt((phat*(1-phat)+z*z/(4*n))/n))/(1+z*z/n))

def wilson(ss, df):
    import scipy.stats as st
    confidence = 0.95
    z = st.norm.ppf(1 - (1 - confidence) / 2)
    scaler = MinMaxScaler(feature_range=(0, 1))
    MIN, MAX = 0, 1

    to_prepend = [StructField("norm_score", FloatType(), True)]
    schema = StructType( df.schema.fields + to_prepend )

    @pandas_udf(schema, PandasUDFType.GROUPED_MAP)
    def wilson_udf(pdf):
        # wilson score  
        pdf['norm_score'] = pdf.apply(lambda x: ci_lower_bound(x['imp'], x['clk'], z), axis=1)
```