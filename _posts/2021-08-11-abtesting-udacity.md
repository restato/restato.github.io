---
title: "Udacity A/B Testing"
categories: ["통계"]
tags: [abtest, statistics, udacity]
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

## Lesson 1: Overview of A/B Testing

### 1.Introduction to Course

* design a task
* choose metrics
* analyize results

### 2.Course Format

* choose a metric
* review statistics
* design
* analyze experiments

### 3.Intro to A/B Testing

* 목표가 있고 그 목표를 조금씩 달성하기 위한것, 목표가 다르다면 A/B Testing은 올바르지 않다
* 응답속도가 100ms 안에 들어오는지 확인했을때 늦으면 매출도 감소하게 된다. 

### 9.Metric Choice

* click-throught-rate (X)
  * number of clicks / number of page views
  * you want to emasure the usability of a particular button
  * users have a variety of different places on the page that they can actually choose to click on
  * rate will say how often do they actually find that button
* click-throught-probability (O)
  * unique visitors who click / unique visitors to page
  * you just want to know how often users went to the second level page on your site
  * you don't want to count if double-clicked, reload, all of those types of issues
  * we're intested in whether users are progressing to the second level of the funnel
* <https://towardsdatascience.com/a-b-testing-c9cb90d2b6aa>
  * CTP는 사용자가 click view를 얼마나 했는지 중요하지 않고 최소 한번만
  * CTR은 두개의 버튼을 비교할때 좋고

### 10.Estimating Click-Through-Probability

* 전체 영향을 측정하고 싶을 때는 확률을 사용
* 일반적으로 사이트의 사용성을 측정하고 싶을 때는 비율을 사용
* 특정 버튼의 유용성을 측정하려는 경우 사용자가 실제로 클릭하도록 선택할 수 있는 페이지의 다양한 위치가 있기 때문에 비율을 사용
* 사용자가 사이트의 두번째 수준 페이지로 이동한 빈도를 알고 싶다면 확률을 사용
  * 사용자가 방금 두 번 클릭했는지, 새로고침을 했는지, 아니면 모든 문제의 유형
  * funnel을 생각할때는 probability를 사용

### 11.Repeating the Experiment

* Visitors = 1000
* Unique clicks = 100
* Click Through Probability = 10%
* 100, 101, 110, 150, 900이 있을때, 150, 900의 결과가 놀라운 결과, 나머지는 가능성이 있음
* 그렇다면 가능성이 있다는걸 어떻게 측정? -> standard error of sample

### 12.Which Distribution

* 150개가 클릭이 발생했다면 놀라워?
* 성공(=click)/실패(=no click)만 있으니 binomial distribution

### 13.Binomial Distribution

* p = 3/ 4`
* p<hat> = estimate of the probability
* N=20, X=16, p<hat> = 16 / 20 = 4 / 5
* binomial distribution 언제 사용?
  * 2types of outpcomes
    * success/fail
  * indenpedent events
  * indentical distribution
  * p same ofr all
* example
  * drawing 20 cards from a shuffled deck (outcomes: red and black)
    * red를 뽑은 뒤에 다음 카드가 독립이 아니니까 (dependent events)
  * roll a die 50 times (outcomes: 6 or others)
  * clicks on a search results page (outcome: click or no click)
    * is not independent, 검색한 결과가 원하는 결과가 아니면 다시 다른 키워드로 검색하니까
  * student completion of course after 2 months (outcome:complete or not)
  * purchase of items within a week (outcome: purchased or not)
    * is not independent, shopping cart, 한 사람이 여러개의 items을 cart에 추가하고 모두 구매할수 있다. 

### 14.confidence intervals

* sample standard error for the binomial to esimate how variable we expect our overall probability of a click
* confidence interval: 95%의 이미는 실험을 반복적으로 수행했을때, population 95%가 cover

### 15.Calculating a Confidence Interval

* interval 의 center를 찾았고 (=probability of a click)
* p hat, estimated probabiliy equals X over N
  * X: users who clicked, N: users
* p hat, 100 / 1000 = 0.1
* m = margin error
  * interval center에서 떨어진 에러를 의미
  * binomial distribution에서의 standard error는 차트 간격을 의미
* m = z score * standard error
  * = z score * np.sqrt(p(1-p) / N)
  * = 0.019
  * width = confidence interval
* confidence ineterval = [0.081 ~ 0.1 ~ 0.119]
  * 클릭이 80, 120이면 pretty surprising

* N = 2000, X =300
* confindence level 99%
* p<hat> = 300 / 2000 = 0.15
* margin of error
  * 2.58 x np.sqrt((0.15 * 0.85) / 2000) = 0.021
  * confidence interval = [0.129 ~ 0.15 ~ 0.171]

### 17.Null and Alternative Hypotehsis

* Hypothesis Testing
* P(results due to chance)