---
title: "[Pyspark] withColumn 여러개 파라미터, 결과 여러개 받기"
categories: [스파크]
tags: [pyspark, spark, withcolumn, params, udf]
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

Pyspark에서 withColumn을 통해 하나의 열에 대한 처리가 가능하다. 간단하게는 아래와 같이 처리하면 되지만 udf에 들어가는 input/output이 여러개일때는 스키마를 정리하고 처리해야 한다.

```python
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType, Row, ArrayType
from pyspark.sql.functions import udf, col
from datetime import datetime

scheme = StructType([
    StructField('before', ArrayType(StringType()), False), 
    StructField('after', ArrayType(StringType()), False),
    StructField('before_repur_cnt', IntegerType(), False),
    StructField('after_repur_cnt', IntegerType(), False),
    StructField('etc', IntegerType(), False)])
    
def get_before_after(dt_set, add_90_ymdt, add_180_ymdt): 
    before_dt_set = []
    after_dt_set = []
    etc_dt_set = []
    for dt in dt_set: 
        if add_90_ymdt >= datetime.strptime(dt, "%Y-%m-%d"): # reg ~ 90days
            before_dt_set.append(dt)
        elif (add_90_ymdt < datetime.strptime(dt, "%Y-%m-%d")) and (datetime.strptime(dt, "%Y-%m-%d") <= add_180_ymdt): # 90days ~ 180days
            after_dt_set.append(dt)
        else:
            etc_dt_set.append(dt)
    before_repur_cnt = len(before_dt_set) -1
    before_repur_cnt = 0 if before_repur_cnt < 0 else before_repur_cnt
    after_repur_cnt = len(after_dt_set) -1
    after_repur_cnt = 0 if after_repur_cnt < 0 else after_repur_cnt
    return Row('bofore','after', 'before_repur_cnt', 'after_repur_cnt', 'etc')(before_dt_set, after_dt_set, before_repur_cnt, after_repur_cnt, len(etc_dt_set))
 
get_before_after_udf = udf(get_before_after, scheme) 
```