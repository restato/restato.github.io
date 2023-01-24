---
title: A/B 테스트에서 두 표본평균 사이의 차이를 어떻게 비교할까? (t-distribution와 t-test)
tags: [abtest, t-distribution]
categories: [statistics]
---

# T-분포

- `t 분포`는 정규분포와 생김새가 비슷하지만 꼬리 부분이 약간 더 두껍고 길다.
- 표본통계량의 분포를 설명하는데 광범위하게 사용
- 표본 평균의 분포는 일반적으로 t분포와 같은 모양, 표본의 크기에 따라 다른 계열의 t분포가 있다.
- 표본이 클수록 더 정규분포를 닮은 t분포가 형성된다.
- 표본분포를 근사화하기 위한 수학적 기법과 t분포와 같은 함수를 사용
- 정확도는 표본의 통계량의 분포가 정규분포를 따른다는 조건을 필요로 한다.
- 모집단이 정규분포를 따르지 않을때 조차도, 표본통계량은 보통 정규분포를 따르는 것으로 나타남(=t분포가 널리 적용되는 이유)
  - 중심극한정리
- 표본평균, 두 표본평균 사이의 차이(a/b테스트에서 사용), 회귀 파라미터 등의 분포를 위한 기준으로 널리사용

# t 검정

- 데이터 횟수나 측정값을 포함하는지, 표본이 얼마나 큰지, 측정 대상이 무엇인지에 따라 다양한 유형의 유의성 검정 방법

# 검정력과 표본크기

- 효과크기<sup>effect size</sup>: 통계 검정을 통해 판단할 수 있는 효과의 최소 크기
- 검정력<sup>power</sup>: 주어진 표본크기로 주어진 효과크기 알아낼 확률
  - 두개의 그룹 사이의 차이가 작을수록 더 많은 데이터가 필요하다. 검정력이란 특정 표본 조건(크기와 변이)에서 특정한 효과크기를 알아낼 수 있는 확률을 의미.
- 유의수준<sup>significance level</sup>: 검증시 사용할 통계 유의수준

# 표본크기

- 검정력의 주된 용도는 표본크기가 어느 정도 필요한가를 추정
- 표본 크기의 계산과 관련하여 다음 4가지 중요한 요소
  - 표보크기 (effective size)
  - 탐지하고자 하는 효과 크기
  - 가설검정을 위한 유의수준 (significance leve)
  - 검정력 (power)
- 위에 3가지를 정하면 나머지 하나를 알 수 있다.

# Python

## 샘플 사이즈가 얼마나 필요할까?

```python

from scipy import stats

def get_power(n, p1, p2, cl):
    alpha = 1 - cl
    qu = stats.norm.ppf(1 - alpha/2)
    diff = abs(p2-p1)
    bp = (p1+p2) / 2

    v1 = p1 * (1-p1)
    v2 = p2 * (1-p2)
    bv = bp * (1-bp)

    power_part_one = stats.norm.cdf((n**0.5 * diff - qu * (2 * bv)**0.5) / (v1+v2) ** 0.5)
    power_part_two = 1 - stats.norm.cdf((n**0.5 * diff + qu * (2 * bv)**0.5) / (v1+v2) ** 0.5)

    power = power_part_one + power_part_two

    return (power)

get_power(1000, 0.1, 0.12, 0.95)

def get_sample_size(power, p1, p2, cl, max_n=100000000):
    n = 1
    while n <= max_n:
        tmp_power = get_power(n, p1, p2, cl)
        if tmp_power >= power:
            return n
        else:
            n = n + 10
    return "Increase Max N Value"

click_rate = 15.6847 / 100
power = 0.8
cl = 0.95
percent_lift = 7 / 100

click_rate_p2 = click_rate * (1 + percent_lift) # relative
get_sample_size(power, click_rate, click_rate_p2, cl)
```

## confidence interval을 어떻게 계산할까?

```python
def mean_confidence_interval(data, confidence=0.95):
    a = 1.0 * np.array(data)
    n = len(a)
    m, se = np.mean(a), scipy.stats.sem(a)
    h = se * scipy.stats.t.ppf((1 + confidence) / 2., n-1)
    return m, m-h, m+h

def get_confidence_ab_test(click_a, num_a, click_b, num_b):
    rate_a = click_a / num_a
    rate_b = click_b / num_b
    std_a = np.sqrt(rate_a * (1 - rate_a) / num_a)
    std_b = np.sqrt(rate_b * (1 - rate_b) / num_b)
    z_score = (rate_b - rate_a) / np.sqrt(std_a**2 + std_b**2)
    return norm.cdf(z_score)

num_a, click_a = 30450, 4776
num_b, click_b = 30418, 5104
get_confidence_ab_test(click_a, num_a, click_b, num_b)
```

## p-value

```python
def get_pvalue(con_conv, test_conv, con_size, test_size):
    lift = -abs(test_conv - con_conv)

    scale_one = con_conv * (1-con_conv) * (1/ con_size)
    scale_two = test_conv * (1-test_conv) * (1/ test_size)
    scale_val = (scale_one + scale_two) ** 0.5

    p_value = 2 * stats.norm.cdf(lift, loc=0, scale = scale_val)
    return p_value


# Trial 1
# click_a = 100
# click_b = 105
# num_a = 110000
# num_b = 120000
p_value = get_pvalue(click_a / num_a, click_b / num_b, click_a, click_b)
```

## t-test

```python
a = [1000, 100000, 2000, 6000, 6000, 0, 0, 0,]
b = [1000,100000, 1000, 100, 100, 10, 10]

np.array(a).mean()
np.array(b).mean()

print(stats.ttest_ind(a=a, b=b))
print(stats.ttest_ind(a=b, b=a))
```

## t-test w/ distribution

```python
a = [1000, 2000, 3000, 2000, 3000, 3000] * 10000
b = [1000, 2000, 3000, 2000, 3000, 2900] * 10000

a = np.array(a)
b = np.array(b)

np.random.shuffle(a)
np.random.shuffle(b)

np.array(a).mean()
np.array(b).mean()

print(stats.ttest_ind(a=a, b=b))

x1 = a
x2 = b

ax = sns.distplot(x1, kde=False, fit=sp.stats.norm, label="1번 데이터 집합")
ax = sns.distplot(x2, kde=False, fit=sp.stats.norm, label="2번 데이터 집합")

ax.lines[0].set_linestyle(":")
plt.legend()
plt.show()
```

## t-test w/ stat

```python

from __future__ import print_function

import numpy as np
from scipy.stats import ttest_ind, ttest_ind_from_stats
from scipy.special import stdtr

np.random.seed(1)

# Create sample data.
a = np.random.randn(40)
b = 4*np.random.randn(50)

# Use scipy.stats.ttest_ind.
t, p = ttest_ind(a, b, equal_var=False)
print("ttest_ind:            t = %g  p = %g" % (t, p))

# Compute the descriptive statistics of a and b.
abar = a.mean()
avar = a.var(ddof=1)
na = a.size
adof = na - 1

bbar = b.mean()
bvar = b.var(ddof=1)
nb = b.size
bdof = nb - 1

# Use scipy.stats.ttest_ind_from_stats.
t2, p2 = ttest_ind_from_stats(abar, np.sqrt(avar), na,
                              bbar, np.sqrt(bvar), nb,
                              equal_var=False)
print("ttest_ind_from_stats: t = %g  p = %g" % (t2, p2))

# Use the formulas directly.
tf = (abar - bbar) / np.sqrt(avar/na + bvar/nb)
dof = (avar/na + bvar/nb)**2 / (avar**2/(na**2*adof) + bvar**2/(nb**2*bdof))
pf = 2*stdtr(dof, -np.abs(tf))

print("formula:              t = %g  p = %g" % (tf, pf))
```