---
title: Deep Neural Network Models for Recommendation
tags: [DeepNeuralNetwork, recommendations, model]
categories: [machine-learming, deep-learning]
---

embedding을 학습하기 위해서 matrix factorization을 사용했다. matrix factorization은 몇가지 한계가 있는데 다음과 같다.

- side features(query id, item id를 이외)을 사용하는게 어렵다. 결과적으로 모델은 training set에 있는 user또는 item 항믁으로만 쿼리가 가능하다.
- relevance of recommendations. 인기있는 item은 특히 dot product를 측정으로 사용할때 모든 사람에게 추천되는 경향이 있다. 특정 사용자의 관심사를 포착하는게 좋다.

DNN 모델은 matrix factorization의 한계들을 해결할 수 있다. DNNs은 query features와 item features를 쉽게 통합 할 수 있다. (네트워크 input layer의 flexibility로 인해서), 사용자의 특정 관심사를 포착하고 추천의 관련성을 개선하는데 도움이 될 수 있다.

## Softmax DNN for Recommendation

가능한 DNN모델 중 하나는 softmax로, 문제를 다음과 같은 multiclass 예측 문제로 처리한다.

- 입력은 사용자 쿼리

### 참고

- https://developers.google.com/machine-learning/recommendation/dnn/softmax


[2021-07-06 18:00:55] ERROR Errno::ECONNRESET: Connection reset by peer @ io_fillbuf - fd:24
	/Users/direcision/.rbenv/versions/2.7.3/lib/ruby/2.7.0/webrick/httpserver.rb:82:in `eof?'
	/Users/direcision/.rbenv/versions/2.7.3/lib/ruby/2.7.0/webrick/httpserver.rb:82:in `run'
	/Users/direcision/.rbenv/versions/2.7.3/lib/ruby/2.7.0/webrick/server.rb:307:in `block in start_thread'