---
title: "[Pyspark] 코드 정리"
categories: [스파크]
tags: [pyspark, spark, code]
---

### 파티션 개수 확인 (=파일 개수)

```python
df = spark.sql("QUERY")
df.rdd.getNumPartitions()
```