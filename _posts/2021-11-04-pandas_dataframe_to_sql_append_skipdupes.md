---
title: "[Python] Pandas DataFrame to_sql 데이터 중복시 무시하는 방법"
categories: [파이썬]
tags: [python, pandas, to_sql, mysql, duplicate]
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

pandas dataframe을 sql로 넣을때 `to_sql`을 사용하는데 중복이 발생하는 경우 `IntegrityError: (1062, "Duplicate entry '46409004' for key 'PRIMARY'")` 가 발생하면서 에러가 난다. `to_sql`의 경우 <https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_sql.html> if_exists가 지원되는건 `if_exists{‘fail’, ‘replace’, ‘append’}, default ‘fail’`로 `append_skipdupes`가 없다. 누군가 구현해 놓은게 있어서 기록

```python
df.to_sql(con=engine, name='transaction', if_exists='append', index=False) 
```

```python
import random
import string

"""
This example is for inside the class.
First establish the connection into `self.conn`
"""

def table_column_names(table: str) -> str:
    """
    Get column names from database table
    Parameters
    ----------
    table : str
        name of the table
    Returns
    -------
    str
        names of columns as a string so we can interpolate into the SQL queries
    """
    query = f"SELECT column_name FROM information_schema.columns WHERE table_name = '{table}'"
    rows = engine.execute(query)
    dirty_names = [i[0] for i in rows]
    clean_names = '`' + '`, `'.join(map(str, dirty_names)) + '`'
    return clean_names


def insert_conflict_ignore(df: pd.DataFrame, table: str, index: bool):
    """
    Saves dataframe to the MySQL database with 'INSERT IGNORE' query.

    First it uses pandas.to_sql to save to temporary table.
    After that it uses SQL to transfer the data to destination table, matching the columns.
    Destination table needs to exist already. 
    Final step is deleting the temporary table.
    Parameters
    ----------
    df : pd.DataFrame
        dataframe to save
    table : str
        destination table name
    """
    # generate random table name for concurrent writing
    temp_table = ''.join(random.choice(string.ascii_letters) for i in range(10))
    try:
        df.to_sql(temp_table, engine, index=index)
        columns = table_column_names(table=temp_table)
        insert_query = f'INSERT IGNORE INTO {table}({columns}) SELECT {columns} FROM `{temp_table}`'
        engine.execute(insert_query)
    except Exception as e:
        print(e)        

    # drop temp table
    drop_query = f'DROP TABLE IF EXISTS `{temp_table}`'
    engine.execute(drop_query)


def save_dataframe(df: pd.DataFrame, table: str):
    '''
    Save dataframe to the database. 
    Index is saved if it has name. If it's None it will not be saved.
    It implements INSERT IGNORE when inserting rows into the MySQL table.
    Table needs to exist before. 
    Arguments:
        df {pd.DataFrame} -- dataframe to save
        table {str} -- name of the db table
    '''
    if df.index.name is None:
        save_index = False
    else:
        save_index = True

    insert_conflict_ignore(df=df, table=table, index=save_index)
```

```python
save_dataframe(dataframe)
```

### 참고

<https://github.com/pandas-dev/pandas/issues/15988#issuecomment-823602644>