---
title: "[Python] 시계열 예측을 위한 Prophet"
categories: [파이썬]
tags: [python, prophet, machine-learning, timeseries, facebook]
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

## 들어가며

[Prophet](https://facebook.github.io/prophet/docs/quick_start.html)을 이용해서 시계열 예측을 할 수 있다고 해서 조사를 해봤다. 처음에는 어떤 이벤트가 영향을 주었는지에 대해서 조사를 해보다. 가설검증하는게 쉽지 않아. 역으로 내가 타겟으로 하는 이벤트를 예측해보고, 예측한 값과는 차이가 존재한다면? 그때는 그 시점에서 특정 이벤트가 있지 않았을까 역으로 찾아보려고 했다.

## Prophet 장점

* 통계적 지식이 없어도 직관적으로 파라미터 수정이 가능
* 높은 성능을 보여준다.
* 내부가 어떻게 동작하는지 고민할 필요가 없다.
* Python을 지원한다.

## Prophet 이란?

* Growth, Seasonality, Holiday, 에러를 식으로 y를 예측한다.
* Growth
  * Change Point는 자동으로 탐지
  * 예측할때는 특정 지점이 change point인지 여부를 확률적으로 결정한다.
  * Non-Linear Growth (Logistic Growth)
    * 상한선이 존재할때 Logistic을 사용
* Seasonality
  * 사용자들의 시즌성을 반영한다.
  * Fourier Series 를 이용해 패턴의 근사치를 찾는다.
* Holiday
  * 주기성을 가지진 않지만 전체 추이에 큰 영향을 주는 이벤트가 조재
  * 이벤트의 효과는 독립이라고 가정
  * 이벤트 앞뒤로 윈도우 범위를 지정해 해당 이벤트가 미치는 영향의 범위를 설정할수 있다.

## Model

* stan을 통해 모델 학습
  * probabilistic programming language for statistical inference
* MAP (Maximum A Posteriori): Default로 fitting 속도가 빠르다.
* MCMC (Markov Chain Monte Carlo): 모형의 변동성을 더 자세히 살펴볼수 있다.
* Analyst in the loop Modeling
  * 통계적인 지식이 없어도 직관적 파라미터를 통해 모형을 조정할 수 있다.
  * 일반적인 경우 기본값만 사용해도 높은 성능을 가짐
  * 내부가 어떻게 동작하는지 고민 노노
  * 요소
    * Capacities: 시계열 데이터 전체의 최대값
    * Change Points: 추세가 변화하는 시점
    * Holidays & Seasonlaity: 추세에 영향을 미치는 시기적 요인
    * Smoothing: 각각 요소들이 전체 추이에 미치는 영향의 정도

## Trend Change Points

* Prophet 에서는 기본적으로 트렌드가 변경되는 지점을 자동으로 감지해 트렌드를 예측
  * 감지하는 것을 사용자가 조절 가능
* Prophet 객체를 생성할때
  * changepoint_range, changepoint_prior_scale, changepoints
  * changepoint_range (default: 0.8)
    * 기본적으로는 Prophet은시계열 데이터의 80% 크기에서 잠재적으로 ChangePointㅡㄹ 지정
    * 90% 만큼 ChangePoint로 지정하고 싶다면 아래와 같이 설정

```python
m = Prophet(changepoint_range=0.9)
```

* changepoint_prior_scale (default: 0.05)
  * changepoint의 유연성 조정
  * overfitting이 심하면 유연한 그래프가 나와 모든 값에 근점, underfitting일 경우 유연성이 부족
  * 이 값을 늘리면 그래프가 유연해(underfitting 해결), 이 값을 줄이면 유연성이 감소 (overfitting 해결)

```python
m = Prophet(changepoint_prior_scale=0.05)
```

* changepoints(list)
  * 잠재적으로 change point일 수 있는 날짜들
  * 명시하지 않으면 잠재적인 changepoint가 자동으로 설정

## 시각화

```python
from fbprophet.plot import add_changepoints_to_plot

fig = m.plot(forecast)
a = add_changepoints_to_plot(fig.gca(), m, forecast)
```

* 빨간 실선은 Trend, ㅂ빨간 점선은 ChangePoint

## Holiday Effects

* 휴일이나 모델에 반영하고 싶은 이벤트가 있으면 반영이 가능
* 이벤트는 과거 데이터와 미래 데이터 모두 포함되어 있어야 한다.
* 주변 날짜를 포함시키기 위해 `lower_window`, `upper_window`를 사용해 업데이트 영향을 조절 가능

```python
playoffs = pd.DataFrame({
    'holiday': 'playoff',
    'ds': pd.to_datetime(['2008-01-13', '2009-01-03', '2010-01-16',
    '2010-01-24', '2010-02-07', '2011-01-08',
    '2013-01-12', '2014-01-12', '2014-01-19',
    '2014-02-02', '2015-01-11', '2016-01-17',
    '2016-01-24', '2016-02-07']),
    'lower_window': 0,
    'upper_window': 1,
})
superbowls = pd.DataFrame({
    'holiday': 'superbowl',
    'ds': pd.to_datetime(['2010-02-07', '2014-02-02', '2016-02-07']),
    'lower_window': 0,
    'upper_window': 1,
})

m = Prophet(holidays=holidays)
forecast = m.fit(df).predict(future)
holidays = pd.concat((playoffs, superbowls))
```

* holiday effect는 아래 코드로 확인

```python
forecast[(forecast['playoff'] + forecast['superbowl']).abs() > 0][
    ['ds', 'playoff', 'superbowl']][-10:]
```

* `plot_componnents`로 holiday의 영향도 확인이 가능
* `holidays_prior_scale`을 조정해 smooth 하게 변경이 가능 (default: 10)

```python
m = Prophet(holidays=holidays, holidays_prior_scale=0.05).fit(df)
forecast = m.predict(future)
forecast[(forecast['playoff'] + forecast['superbowl']).abs() > 0][['ds', 'playoff', 'superbowl']][-10:]
```

* [holiday github](https://github.com/facebook/prophet/blob/master/python/fbprophet/hdays.py) 을 참고해서 커스텀 이벤트 생성이 가능. `add_contry_holidasy(country_name='US'` 한국은 없음

## Seasonality

* Fourier Order for Seasonalities, 푸리에의 합을 사용해 추정
* 푸레이 급수는 주기함수를 삼각함수의 급수로 나타낸 것
* `yearly_seasonality`의 값은 default: 10
  * seasonliaty가 자주 발생하면 20으로 수정 (overfitting 위험이 있음)

```python
from fbprophet.plot import plot_yearly
m = Prophet(yearly_seasonality=10).fit(df)
a = plot_yearly(m)
```

* custom하게 seasonality를 생성할 수 있음
* 기본적으로 weekly, yearly 특성 제공
* `m.add_seasonality`로 추가하며 인자는 `name`, `period`, `fourier_order`가 있음

```python
m = Prophet(weekly_seasonality=False)
m.add_seasonality(name='monthly', period=30.5, fourier_order=5)
forecast = m.fit(df).predict(future)
fig = m.plot_components(forecast)
```

* `prior_scale`을 조절해 강도를 조절할 수 있음

## Additional regressors

* `add_regressor` 메소드를 사용해 모델의 linear 부분에 추가할 수 있음
* `NFL 시즌의 일요일`에 추가 효과를 더함 (내셔널 풋볼리그가 NFL)

```python
def nfl_sunday(ds):
    date = pd.to_datetime(ds)
    if date.weekday() == 6 and (date.month > 8 or date.month < 2):
        return 1
    else:
        return 0
            
df['nfl_sunday'] = df['ds'].apply(nfl_sunday)
    
m = Prophet()
m.add_regressor('nfl_sunday')
m.fit(df)
    
future['nfl_sunday'] = future['ds'].apply(nfl_sunday)
    
forecast = m.predict(future)
fig = m.plot_components(forecast)
```

## Multiplicative Seasonality

* 단순한 seasonality가 아닌 점점 증가하는 seasonality를 다룰때 사용하면 좋은 기능
* 데이터가 엄청 많을 경우 유용
* 사용하는 방법 매우 단순

```python
m = Prophet(seasonality_mode='multiplicative')
```

## Uncertainty Intervals

* 불확실성의 범위가 나타나는 원인
  * Trend의 불확실성
  * Seasonality 추정의 불확실성
  * 추가 관찰되는 잡음
* Uncertainty in the trend
  * 예측하면 yhat_lower, yhat_upper가 나타나는데 이 범위도 사용자가 조절할 수 있음
  * interval_width는 기본값이 80%
  * changepoint_prior_scale을 조절하면 예측 불확실성이 증가함

```python
forecast = Prophet(interval_width=0.95).fit(df).predict(future)
```

* Uncertainty in seasonality
  * seasonality의 불확실성을 알기 위해 베이지안 샘플링을 사용해야 한다.
  * `mcmc.samples` 파라미터를 사용. 이 값을 사용하면 최초 n일에 대해 적용한다는 뜻

```python
m = Prophet(mcmc_samples=300)
forecast = m.fit(df).predict(future)
fig = m.plot_components(forecast)
```

## Outliers

* Uncentainty Intervals
  * 흐린 파란색
* 너무 튀는 값은 제거하고
* 상한선, 하한선을 설정해서

```python
df.loc[(df['ds'] > '2010-01-01') & (df['ds'] < '2011-01-01'), 'y'] = None
model = Prophet().fit(df)
fig = model.plot(model.predict(future))
```

## Sub-daily Data

* Daily 데이터가 아닌 `Timestamp`의 값도 가능
  * `YYYY-MM-DD HH:MM:SS` 형태로
* Data with regular gaps
  * 정기적인 gap이 있는 데이터도 예측할 수 있음
  * 매달 1일의 데이터만 있어도 월별로 예측이 가능