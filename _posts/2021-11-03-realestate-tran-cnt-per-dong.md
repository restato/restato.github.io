---
title: "[Python] 부동산 동별로 거래 건수 확인"
categories: [파이썬]
tags: [python, realestate, legaldong, numberoftransactions]
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

![](/assets/2021-11/numberoftransactions.png)

```python
def preprocessing(df: pd.DataFrame) -> pd.DataFrame:
    # preprocessing
    df['transaction_amount'] = df['transaction_amount'].astype(float) 
    df['transaction_date'] = pd.to_datetime(
        df['transaction_date'], format="%Y-%m-%d %H:%M:%S").dt.date
    df['transaction_ym'] = df['transaction_date'].apply(lambda x: x.strftime('%Y%m'))
    df['transaction_year'] = df['transaction_year'].astype(object)
    df['transaction_month'] = df['transaction_month'].astype(object)
    df['year_of_construction'] = df['year_of_construction'].astype(int)
    df['floor'] = df['floor'].astype(int)
    df['dedicated_area'] = df['dedicated_area'].astype(float) 
    if 'monthly_rent' in df.columns:
        df['monthly_rent'] = df['monthly_rent'].astype(int)
    return df

def tran_cnt_per_month(df: pd.DataFrame) -> pd.DataFrame:
    df = df.set_index('legal_dong')
    print(len(df))
    frames = []
    print(f' dong counts : {len(df.index)}') 
    dong_names = df.index[:3]
    for dong_name in tqdm.tqdm(dong_names):
        data = df.loc[[dong_name]]
        # data = applyParallel(
        # data[['transaction_amount']].groupby(data.index), tempFunc)
        data = data[['transaction_year']].groupby(data.index, 'transaction_year', 'transaction_month').mean()
        data = data.reset_index()
        frames.append(data)
    result_df = pd.concat(frames, axis=0)
    return result_df    

result_df = df[['legal_dong', 'transaction_ym','transaction_amount']].groupby(['legal_dong','transaction_ym']).count()    

result_df = result_df.rename(columns={'transaction_amount': 'count'})
result_df = pd.pivot(result_df.reset_index(), index='transaction_ym', columns='legal_dong', values='count')

result_df.plot(grid=True, figsize=(20, 10))
```
