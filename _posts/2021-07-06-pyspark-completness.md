---
title: "[Pyspark] Data Quaility를 측정하는 방법과 코드"
categories: [스파크]
tags: [pyspark, dq, data-quality, python]
---

## 데이터 품질 측정 기준

데이터 품질을 측정하는데 사용되는 기준이 5개가 있다.

* Accuracy - 설명된 데이터가 무엇이든 정확해야 한다.
* Relevance - 데이터가 의도된 사용에 대한 요구사항을 충족해야 한다.
* Completeness - 데이터에 누락된 값이 있거나 누락된 데이터 레코드가 없어야 한다.
* Timeliness - 데이터가 최신 상태여야 한다.
* Consistency - 예상대로 데이터 포맷을 가져야 하며, 동일한 결과로 cross reference-able 할 수 있어야 한다.

## Completeness

데이터 품질 측정하는 기준에서 `Completeness`를 측정하기 위해서 아래와 같은 방법을 사용

* find_missings: NULL, NaN 체크
* find_missing_rows: rows에서의 누락이 있는지 체크
* find_missing_partitions: 파티션 누락이 있는지 체크
* find_all_zero_rows: 모든 컬럼이 0인 로우의 개수 체크 (+컬럼별 0의 개수 체크)

### 공통 코드

```python
from pyspark.sql.types import BooleanType
from pyspark.sql.functions import udf, array, col, struct, isnan, when, count, isnull

import pandas as pd
import matplotlib.pyplot as plt

from datetime import datetime, timedelta, date
from collections import defaultdict

def daterange(start_date, end_date):
    for n in range(int((end_date - start_date).days)):
        yield start_date + timedelta(n)

def filter_dates(dates, start_ymdt, end_ymdt):
    # print(start_ymdt, end_ymdt)
    start_date = datetime.strptime(start_ymdt, "%Y-%m-%d")
    end_date = datetime.strptime(end_ymdt, "%Y-%m-%d")
    dt_dates = [datetime.strptime(date, "%Y-%m-%d") for date in dates]
    
    in_between_dates = []
    
    for d in dt_dates: 
        if d >= start_date and d <= end_date:
            in_between_dates.append(d.strftime("%Y-%m-%d"))

    return in_between_dates

start_ymdt = '2021-05-06'
end_ymdt = '2021-05-08'
start_date = datetime.strptime(start_ymdt, "%Y-%m-%d")
end_date = datetime.strptime(end_ymdt, "%Y-%m-%d")

tables = # [table1, table2]
```

### Find Missings

```python
def count_missings(table, dt):
    query = f"""
    SELECT
        *
    FROM {table}
    WHERE
        dt = "{dt}"
    """
    df = spark.sql(query) 
    df = df.na.replace('-1', None)
    pdf = df.select([count(when(isnan(c) | isnull(c), c)).alias(c) for (c, c_type) in df.dtypes if c_type not in ('timestamp', 'date')]).toPandas()
    return pdf

# sample = count_missings(tables[0], '2021-05-06')

count_missings_dict = defaultdict() 
for single_date in daterange(start_date, end_date):
    dt = single_date.strftime("%Y-%m-%d")
    count_missings_dict[dt] = defaultdict()
    print(dt)
    for table in tables:
        pdf = count_missings(table, dt)
        count_missings_dict[dt][table] = pdf
        
count_missing_sum_dict = defaultdict()
for dt, values in count_missings_dict.items():
    count_missing_sum_dict[dt] = defaultdict()
    for table, pdf in values.items():
        count_missing_sum_dict[dt][table] = pdf.sum(axis=1).values[0]
        
count_missings_pdf = pd.DataFrame.from_dict(dict(count_missing_sum_dict), orient='index')
count_missings_pdf.sum() # 전체 합산       

# Plot으로 표시
n_col = len(tables) // 2 + 1
fig, axes = plt.subplots(2, n_col, figsize=(n_col * 10, 10))
plt.tight_layout()

for i, table in enumerate(tables): 
    x = count_missings_pdf[table].plot(grid=True, ax=axes[ i // n_col,i % n_col], title=table) 
```

* 각 컬럼별로 missings을 확인

```python 

missing_cols = defaultdict()

for dt, value in count_missings_dict.items(): 
    for table, pdf in value.items(): 
        if table not in missing_cols:
            missing_cols[table] = defaultdict(dict)
        if dt not in missing_cols[table]: 
            missing_cols[table][dt] = defaultdict(dict)
        for col in pdf.columns: 
            value = pdf[col].values[0]
            if value > 0:
                missing_cols[table][dt][col] = value

n_col = len(tables) // 2 + 1
fig, axes = plt.subplots(2, n_col, figsize=(n_col * 10, 10))
plt.tight_layout()

for i, table in enumerate(tables):
    
    pdf = pd.DataFrame.from_dict(dict(missing_cols[table]), orient='index')
    if(len(pdf) > 0):
        x = pdf.plot(grid=True, kind='bar',title=table, ax=axes[ i // n_col,i % n_col])
    else:
        print(f'Table {table} has no missing value')

```

### Find Missing Partitions

```python
def find_missing_partition(table, start_ymdt='1900-07-01', end_ymdt='9999-08-15'):
    # get partitions
    query = f"""
    SHOW PARTITIONS {table}
    """
    partitions = spark.sql(query)
    partitions_A = partitions.collect()

    # find partition min, max
    query = f"""
    SELECT
        DATE_ADD(t.min_dt, pe.idx) AS series_dte
    FROM
    (
        SELECT
             
            MIN(dt) AS min_dt,
            MAX(dt) AS max_dt
        FROM {table}
    ) t
    LATERAL VIEW
    POSEXPLODE(SPLIT(SPACE(DATEDIFF(t.max_dt, t.min_dt)), ' ')) pe AS idx, dte
    """
    partitions = spark.sql(query)
    partitions_B = partitions.collect()

    # parse string
    A = [x['partition'].split("=")[1] for x in partitions_A]
    B = [x['series_dte'].strftime("%Y-%m-%d") for x in partitions_B]

    # filter a list containing dates according to the given start date and end date
    # B = filter_dates(B, start_ymdt='2020-08-19', end_ymdt='2020-10-21')
    B = filter_dates(B, start_ymdt=start_ymdt, end_ymdt=end_ymdt) # mrc 2020-07-01 ~ 2020-08-15
    
    # subtract two lists
    diff = list(set(B) - set(A))
    return sorted(diff)

for table in tables:
    diff = find_missing_partition(table, start_ymdt=start_date.strftime("%Y-%m-%d"), end_ymdt=end_date.strftime("%Y-%m-%d"))
    diff_cnt = len(diff)
    print (f'{table}: # of missing partition: {diff_cnt}')
    print (diff[:10])
```

### Find Missing Rows (=Detect Outlier)

* 테이블 파티션별로 row에서 누락이 있는지 확인
* Interquartile Range (IQR)
  * Interquartile Range (IQR) is important because it is used to define the outliers.
It is the difference between the third quartile and the first quartile (IQR = Q3 -Q1).
Outliers in this case are defined as the observations that are below (Q1 − 1.5x IQR) or boxplot lower whisker or above (Q3 + 1.5x IQR) or boxplot upper whisker.
* Standard Deviation 이용
  * In statistics, If a data distribution is approximately normal then about 68% of the data values lie within one standard deviation of the mean and about 95% are within two standard deviations, and about 99.7% lie within three standard deviations

```python
def iqr(desc):
    IQR = desc['75%'] - desc['25%']
    cut_off = IQR * 1.5
    
    lower_limit = desc['25%'] - cut_off
    upper_limit = desc['75%'] + cut_off
    return lower_limit, upper_limit
    return mask
    
def std(desc):
    data_std = desc['std'] 
    cut_off = data_std * 3 
    
    lower_limit = desc['mean'] - cut_off
    upper_limit = desc['mean'] + cut_off
    return lower_limit, upper_limit
    
def find_outlier_mask(pdf):
    desc = pdf['cnt'].describe()
    print(desc)
    
    # IQR - detect outlier 
    iqr_lower_limit, iqr_upper_limit = iqr(desc)
    iqr_mask = (pdf['cnt'] < iqr_lower_limit) | (pdf['cnt'] > iqr_upper_limit)
    # iqr_mask = (pdf['cnt'] < iqr_lower_limit)
    print(f"[IQR] lower_limit: {iqr_lower_limit}, upper_limit: {iqr_upper_limit}")
    
    # Standard Deviation - detect outlier 
    std_lower_limit, std_upper_limit = std(desc)  
    std_mask = (pdf['cnt'] < std_lower_limit) | (pdf['cnt'] > std_upper_limit)
    # std_mask = (pdf['cnt'] < std_lower_limit) 
    print(f"[STD] lower_limit: {std_lower_limit}, upper_limit: {std_upper_limit}")  
    
    return iqr_mask & std_mask

def detect_partition_outlier(table, start_date, end_date, axes):
    query = f"""
    SELECT
        dt,
        COUNT(*) AS cnt
    FROM
        {table}
    WHERE dt BETWEEN '{start_date}' AND '{end_date}'
    GROUP BY dt
    ORDER BY dt ASC
    """
     
    stats = spark.sql(query)
    pdf = stats.toPandas()
    pdf = pdf.set_index('dt')
    
    if axes is not None: 
        pdf['cnt'].hist(ax=axes[0])
        pdf['cnt'].plot(grid=True, ax=axes[1])
         
    # find outlier
    mask = find_outlier_mask(pdf) 
    return pdf[mask]
import pandas as pd
import matplotlib.pyplot as plt

from datetime import datetime

db = # db_name
tables = # [table1, table2]

start_date = '2020-11-01'
end_date = '2020-11-07'

n_col = len(tables)
fig, axes = plt.subplots(len(tables), 2, figsize=(10, 10))
plt.tight_layout()

for idx, table in enumerate(tables):
    print('-' * 30)
    print(f"### {table}\n")
    outlier = detect_partition_outlier(table, start_date, end_date, axes[idx])
    print(f"{table}: detect outlier {len(outlier)}")
    print(outlier)
    print('-' * 30, '\n')
 

def iqr(desc):
    IQR = desc['75%'] - desc['25%']
    cut_off = IQR * 1.5
    
    lower_limit = desc['25%'] - cut_off
    upper_limit = desc['75%'] + cut_off
    return lower_limit, upper_limit
    return mask
    
def std(desc):
    data_std = desc['std'] 
    cut_off = data_std * 3 
    
    lower_limit = desc['mean'] - cut_off
    upper_limit = desc['mean'] + cut_off
    return lower_limit, upper_limit
    
def find_outlier_mask(pdf):
    desc = pdf['cnt'].describe()
    print(desc)
    
    # IQR - detect outlier 
    iqr_lower_limit, iqr_upper_limit = iqr(desc)
    iqr_mask = (pdf['cnt'] < iqr_lower_limit) | (pdf['cnt'] > iqr_upper_limit)
    # iqr_mask = (pdf['cnt'] < iqr_lower_limit)
    print(f"[IQR] lower_limit: {iqr_lower_limit}, upper_limit: {iqr_upper_limit}")
    
    # Standard Deviation - detect outlier 
    std_lower_limit, std_upper_limit = std(desc)  
    std_mask = (pdf['cnt'] < std_lower_limit) | (pdf['cnt'] > std_upper_limit)
    # std_mask = (pdf['cnt'] < std_lower_limit) 
    print(f"[STD] lower_limit: {std_lower_limit}, upper_limit: {std_upper_limit}")  
    
    return iqr_mask & std_mask  
```

* 하나의 테이블에 대해서 테스트

```python
start_date = '2020-10-01'
end_date = '2020-10-31'
table = # table_name

query = f"""
SELECT
    dt,
    COUNT(*) AS cnt
FROM
    {table}
WHERE dt BETWEEN '{start_date}' AND '{end_date}'
GROUP BY dt
ORDER BY dt ASC
"""
 
stats = spark.sql(query)
pdf = stats.toPandas()
pdf = pdf.set_index('dt')

fig, axes = plt.subplots(1, 2, figsize=(10, 5))
plt.tight_layout()

pdf['cnt'].hist(ax=axes[0])
pdf['cnt'].plot(grid=True, ax=axes[1])

mask = find_outlier_mask(pdf) 
pdf[mask]
```

* [ref](https://towardsdatascience.com/5-ways-to-detect-outliers-that-every-data-scientist-should-know-python-code-70a54335a623)

### Find All Zero Rows

```python
all_zeros_udf = udf(lambda arr: sum(arr) == 0, BooleanType())
def count_all_zero_rows(table, dt): 
    query = f"""
    SELECT
        *
    FROM {table}
    WHERE
        dt = "{dt}"
    """
    
    df = spark.sql(query)
    all_zero_row_cnt = df.withColumn('all_zeros', all_zeros_udf(struct([c for (c, c_type) in df.dtypes if c_type not in ('timestamp', 'date', 'string')])))\
        .filter(col('all_zeros'))\
        .drop('all_zeros')\
        .count()
    return all_zero_row_cnt

all_zeros = defaultdict()
for single_date in daterange(start_date, end_date):
    dt = single_date.strftime("%Y-%m-%d") 
    all_zeros[dt] = defaultdict() 
    
    for table in tables:
        cnt = count_all_zero_rows(table, dt)
        all_zeros[dt][table] = cnt # pdf.sum(axis=1).values[0]

all_zeros_pdf = pd.DataFrame.from_dict(dict(all_zeros), orient='index')
all_zeros_pdf.sum() # 전체 합산

n_col = len(tables) // 2 + 1 # 테이블이 1개일때는 +1을 해주자 (고쳐야 하는데 귀찮다)
n_col = len(tables) // 2 + 2 if len(tables) == 1 else len(tables) // 2 + 1
fig, axes = plt.subplots(2, n_col, figsize=(n_col * 10, 10))
plt.tight_layout()

for i, table in enumerate(tables):
    x = all_zeros_pdf[table].plot(grid=True, ax=axes[ i // n_col, i % n_col], title=table)
```

## 참고

* https://towardsdatascience.com/7-steps-to-ensure-and-sustain-data-quality-3c0040591366