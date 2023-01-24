---
title: "Google Recommendation Systems"
tags: [recommendation]
categories: [machine-learning]
---

Recommendation Systems

- components
  - candidate generation
  - scoring
  - re-ranking

### [Candidate Generation](../candidate-generation-overview)

- generates a much smaller subsets of candidates
- billions of videos down to hundreds or thousands
- 주어진 모델은 여러 후보 생성자를 제공 할 수 있으며, 각각은 후보의 다른 하위 집합을 지명

### Scoring

- 다른 모델에서는 후보군의 스코어와 순위를 계산해 사용자들에게 제공
- 이 모델에서는 상대적으로 작은 하위 집합을 평가하기 때문에 시스템은 추가 쿼리에 의존하는 보다 정확한 모델을 사용

### Reranking

- 최중 순위에 대한 추가 제약(ex: 사용자가 명시적으로 싫어하는 항목을 제거하거나 최신 콘텐츠의 점수를 높이는) 을 고려
- Re-ranking은 diversity, freshness, and fairness를 보장하는데 도움을 준다.

### 참고

- https://developers.google.com/machine-learning/recommendation/overview/types
