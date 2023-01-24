---
title: "[Python] TF Serving with Docker"
categories: [파이썬]
tags: [python, tensorflow, serving, docker, k8s]
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

https://medium.com/tensorflow/serving-ml-quickly-with-tensorflow-serving-and-docker-7df7094aa008

## Production에 서빙할때

* reproducible
* enforces isolation
* secure

## TF Serving with Docker

* tensorflow/serving docker
  * https://hub.docker.com/r/tensorflow/serving/
* tensorflow serving을 이용해서 model을 deploy
* ResNet model을 production에 어떻게 배포하는지
  * https://github.com/tensorflow/models/tree/master/official/vision/image_classification/resnet
* image category분류하는

## Serving ResNet with TensorFlow Serving and Docker

* Tensorflow Serving은 SavedModel format을 사용한다
  * https://www.tensorflow.org/guide/saved_model#save_and_restore_models
  * language-neutral
  * recoverable
  * hermetic serialization format that enables higher-level systems and tools to produce, consume, and transform TensorFlow models
* SavedModel로 export하는 방법은 여러가지가 있다.
* pre-trained ResNet을 다운로드

```sh
mkdir /tmp/resnet
curl -s https://storage.googleapis.com/download.tensorflow.org/models/official/20181001_resnet/savedmodels/resnet_v2_fp32_savedmodel_NHWC_jpg.tar.gz | tar --strip-components=2 -C /tmp/resnet -xvz

ls /tmp/resnet/1538687457
saved_model.pb	variables
```

* Docker에 tf-model 올리기

```sh
docker pull tensorflow/serving
docker run -p 8501:8501 --name tfserving_resnet \
--mount type=bind,source=/tmp/resnet,target=/models/resnet \
-e MODEL_NAME=resnet -t tensorflow/serving &```
```

* source에는 반드시 절대경로로 작성해야 한다.
* 실행 결과

```sh
2021-03-15 22:36:14.342755: I tensorflow_serving/model_servers/server_core.cc:464] Adding/updating models.
2021-03-15 22:36:14.343462: I tensorflow_serving/model_servers/server_core.cc:587]  (Re-)adding model: resnet
2021-03-15 22:36:14.462383: I tensorflow_serving/core/basic_manager.cc:740] Successfully reserved resources to load servable {name: resnet version: 1538687457}
2021-03-15 22:36:14.462423: I tensorflow_serving/core/loader_harness.cc:66] Approving load for servable version {name: resnet version: 1538687457}
2021-03-15 22:36:14.462455: I tensorflow_serving/core/loader_harness.cc:74] Loading servable version {name: resnet version: 1538687457}
2021-03-15 22:36:14.464186: I external/org_tensorflow/tensorflow/cc/saved_model/reader.cc:32] Reading SavedModel from: /models/resnet/1538687457
2021-03-15 22:36:14.488432: I external/org_tensorflow/tensorflow/cc/saved_model/reader.cc:55] Reading meta graph with tags { serve }
2021-03-15 22:36:14.490133: I external/org_tensorflow/tensorflow/cc/saved_model/reader.cc:93] Reading SavedModel debug info (if present) from: /models/resnet/1538687457
2021-03-15 22:36:14.492140: I external/org_tensorflow/tensorflow/core/platform/cpu_feature_guard.cc:142] This TensorFlow binary is optimized with oneAPI Deep Neural Network Library (oneDNN) to use the following CPU instructions in performance-critical operations:  AVX2 FMA
To enable them in other operations, rebuild TensorFlow with the appropriate compiler flags.
2021-03-15 22:36:14.546144: I external/org_tensorflow/tensorflow/cc/saved_model/loader.cc:206] Restoring SavedModel bundle.
2021-03-15 22:36:14.554801: I external/org_tensorflow/tensorflow/core/platform/profile_utils/cpu_utils.cc:112] CPU Frequency: 2592000000 Hz
2021-03-15 22:36:16.481778: I external/org_tensorflow/tensorflow/cc/saved_model/loader.cc:190] Running initialization op on SavedModel bundle at path: /models/resnet/1538687457
2021-03-15 22:36:16.502345: I external/org_tensorflow/tensorflow/cc/saved_model/loader.cc:277] SavedModel load for tags { serve }; Status: success: OK. Took 2038162 microseconds.
2021-03-15 22:36:16.511639: I tensorflow_serving/servables/tensorflow/saved_model_warmup_util.cc:59] No warmup data file found at /models/resnet/1538687457/assets.extra/tf_serving_warmup_requests
2021-03-15 22:36:16.521358: I tensorflow_serving/core/loader_harness.cc:87] Successfully loaded servable version {name: resnet version: 1538687457}
2021-03-15 22:36:16.526361: I tensorflow_serving/model_servers/server.cc:371] Running gRPC ModelServer at 0.0.0.0:8500 ...
[warn] getaddrinfo: address family for nodename not supported
2021-03-15 22:36:16.528969: I tensorflow_serving/model_servers/server.cc:391] Exporting HTTP/REST API at:localhost:8501 ...
[evhttp_server.cc : 238] NET_LOG: Entering the event loop ...
```


* Client 를 다운로드

```sh
curl -o /tmp/resnet/resnet_client.py https://raw.githubusercontent.com/tensorflow/serving/master/tensorflow_serving/example/resnet_client.py
```

* 이미지 다운로드 받고, 반복적으로 서버에 요청

```sh
python /tmp/resnet/resnet_client.py
Prediction class: 286, avg latency: 114.61890000000001 ms
```

## Improving performance by building an optimized serving binary

```sh
Your CPU supports instructions that this TensorFlow binary was not compiled to use: AVX2 FMA
```

* 바이너리가 CPU에 최적화되도록 만들어야 한다.

https://github.com/tensorflow/serving/blob/master/tensorflow_serving/g3doc/setup.md#optimized-build

```sh
docker build -t $USER/tensorflow-serving-devel \
-f Dockerfile.devel \ 
https://github.com/tensorflow/serving.git#:tensorflow_serving/tools/docker
```

```sh
docker kill tfserving_resnet
docker run -p 8501:8501 --name tfserving_resnet \
  --mount type=bind,source=/tmp/resnet,target=/models/resnet \
  -e MODEL_NAME=resnet -t $USER/tensorflow-serving &
```

## Kubernetes에서 Tensorflow Serving 사용

* yaml
* 배포까지

https://www.tensorflow.org/tfx/serving/serving_kubernetes

```sh
docker run -d --name serving_base tensorflow/serving
docker cp /tmp/resnet serving_base:/models/resnet
docker commit --change "ENV MODEL_NAME resnet" serving_base \
  $USER/resnet_serving

docker kill serving_base
docker rm serving_base

docker run -p 8500:8500 -t $USER/resnet_serving &
```

## Tf-Serving Examples

https://github.com/tensorflow/serving/tree/master/tensorflow_serving/example

* Client, client_grpc
* k8s.yaml
* resnset_warmup