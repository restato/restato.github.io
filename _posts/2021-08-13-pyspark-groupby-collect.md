---
title: "[Pyspark] groupby, collect_set 그룹별로 컬럼의 값을 리스트로 변경"
categories: [스파크]
tags: [pyspark, groupby, collect_set]
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
from pyspark import SparkContext
from pyspark.sql import HiveContext
from pyspark.sql import functions as F

sc = SparkContext("local")

sqlContext = HiveContext(sc)

df = sqlContext.createDataFrame([
    ("a", None, None),
    ("a", "code1", None),
    ("a", "code2", "name2"),
], ["id", "code", "name"])

df.show()

+---+-----+-----+
| id| code| name|
+---+-----+-----+
|  a| null| null|
|  a|code1| null|
|  a|code2|name2|
+---+-----+-----+

(df
  .groupby("id")
  .agg(F.collect_set("code"),
       F.collect_list("name"))
  .show())

+---+-----------------+------------------+
| id|collect_set(code)|collect_list(name)|
+---+-----------------+------------------+
|  a|   [code1, code2]|           [name2]|
+---+-----------------+------------------+
```

* 참고
  * https://stackoverflow.com/questions/37580782/pyspark-collect-set-or-collect-list-with-groupby