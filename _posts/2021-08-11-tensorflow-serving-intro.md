---
title: "[Tensorflow] Serving"
categories: [텐서플로우]
tags: [tensorflow, serving, python]
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

## Tensorflow Serving

## Architecture

* <https://www.tensorflow.org/tfx/serving/architecture>
* flexible, high-performance serving system for machine learning models
* designed for production environments
* APIs와 serve architecture를 유지하면서 새로운 알고리즘을 쉽게 배포할 수 있음
* 다른 유형의 모델을 제공하도록 쉽게 확장 가능

## Key Concepts

### Servables

* `Servable`은 클라이언트가 계산(e.g. lookup, inference)을 수행하는데 사용하는 기본 object
* granularity(세분성)와 크기가 유연하다.
  * 단일 Servable에는 조회 테이블의 단일 샤드에서 단일 모델 추론 튜플에 이르기까지 모든것이 포함
  * 모든 유형과 인터페이스가 될 수 있으므로 다음과 같은 유연성과 향후 개선 사항이 가능
    * Streaming results
    * Experimental APIs
    * asynchronous modes of operation
  * Servable 은 자체 수명 주기를 관리하지 않는다.
    * 일반적인 Servables에는 다음이 포함
      * a Tensorflow SavedModelBundle (`tensorflow::Session`)
      * a lookup table for embedding or vocabulary lookups
* Servable Versions
  * Tensorflow Serving은 단일 서버 인스턴스의 lifetime에 하나 이상의 servable 버전을 처리
  * 새로운 알고리즘 구성, 가중치 및 기타 데이터를 로드할 수 있다.
  * 버전을 사용하면 두 가지 이상의 서빙 가능 버전을 동시에 로드할 수 있으므로 점진적인 rollout 과 실험을 지원한다.
  * 서비스를 제공할 때 클라이언트는 특정 모델에 대해 최신 버전 또는 특정 버전ID를 요청할 수 있다.
* Servable Streams
  * servable의 시퀀스 버전을 의미하고, 버전 숫자가 증가하도록 정렬해놓음
* Models
  * TF Serving은 모델을 여러개 서빙이 가능하다.
  * lookup or embedding tables, algorithms(including learned weights)
  * composite model (복합 모델)을 다음 중 하나로 나타낼 수 있음
    * multiple independent servables
    * single composite servable
  * servable은 모델의 일부에 해당할 수도 있다. 예를 들어 큰 조회 테이블은 여러 tensorflow serving 인스턴스에 걸쳐 분할될 수 있다.

### Loaders

* `Loaders` 는 `Servable`의 life cycle을 관리한다.
* Loader API는 관련된 특정 학습 알고리즘, 데이터 또는 제품 사용 사례와 독립적인 공통 infrastructure 지원
  * 로더는 서빙 가능한 loading과 unloading 하기 위해 API를 표준화합니다.

### Sources

* `Sources`는 `Servable`을 찾고 제공하는 플러그인 모듈
* 각 Source는 0개 이상의 servable streams을 제공한다.
* 각 servable stream에 대해서, Source는 로드할 수 있도록 하는 각 버전에 대해 하나의 Loader instance를 제공한다.(Soruce는 실제로 0개 이상의 `SourceAdapter`와 함께 연결되며 체인의 마지막 항목은 로더를 emit)
* Source의 Tensorflow Serving의 인터페이스는 abitrary stroage system에서 servable을 검색할 수 있다.
* Tensorflow Serving에는 공통적인 reference Source implementations이 포함된다. 예를 들어 Source는 RPC와 같은 메커니즘에 액세스하고 파일 시스템을 폴링할 수 있다.
* Source는 여러개의 servable또는 버전간에 공유되는 상태를 유지할 수 있다. 이는 버전 간의 delta (diff) 업데이트를 사용하는 서빙이 가능
* Aspired(열망하는?) Versions
  * 로드되어 준비되어야 하는 servable versions의 집합을 나타낸다.
  * Source는 한 번에 단일 servable stream에 대해 servable versions 세트를 전달
  * Source 관리자에게 aspired versions의 새 목록을 제공하면 해당 servable stream에 대한 이전 목록을 대체한다.
  * 목록에 더 이상 나타나지 않는 이전에 로드된 버전은 unload
  * 실제 모델이 업데이트 되는 과정은 <https://www.tensorflow.org/tfx/serving/serving_advanced> 참고

### Managers

* `Managers`는 Servables의 전체 lifecycle을 관리한다.
  * loading `Servables`
  * serving `Servables`
  * unloading `Servables`
* 

### Core

## Life of a Servable

## Extensibility

### Version Policy

### Source

### Loaders

### Batcher

TF 서빙은 C++로 작성
모델 저장서에서 자동으로 최신 버전의 모델을 배포하는 등의 작업을 수행 가능
TF 서빙 내에 여러개의 모델과 버전을 배포할 수 있음

## 모델 준비하기

* SavedModel로 저장
* tf.saved_model.save() 함수를 통해 모델과 함께 이름과 버전을 포함한 경로를 전달
* 모델의 계산 그래프와 가중치를 저장

```python
model = keras.models.Sequential([…])
model.compile([…])
History = model.fit([…])

model_version = ‘0001’
model_name = ‘myModel’
model_path = os.path.join(model_name, model_version)
tf.saved_model.save(model, model_path)
# 또는 save() 메서드를 이용해서 저장

model.save(model_path)
```

## Installation

* https://www.tensorflow.org/tfx/serving/setup

```sh
git clone https://github.com/tensorflow/serving.git
cd serving

# 빌드 (오래걸림.. 50분)
# * 빌드는 따로 할필요 없음 (서빙만을 위해서는) Tensorflow Serving with Docker 를 참고 
# * hermetic environment with all dependencies에서 build가 필요할때만
tools/run_in_docker.sh bazel build -c opt tensorflow_serving/...
# INFO: Elapsed time: 3030.728s, Critical Path: 391.62s
# INFO: 28849 processes: 4243 internal, 24606 local.
# INFO: Build completed successfully, 28849 total actions
# bazel-serving, bazel-bin, bazel-out, bazel-testlogs 가 생김

# 빌드 테스트
tools/run_in_docker.sh bazel test -c opt tensorflow_serving/...
# 바이너리는 아래 경로에 있음
bazel-bin/tensorflow_serving/model_servers/tensorflow_model_server
```

## Tensorflow Serving with Docker

* <https://www.tensorflow.org/tfx/serving/docker#installing_docker>
* [Tensorflow Serving with Docker using your GPU](https://www.tensorflow.org/tfx/serving/docker#serving_with_docker_using_your_gpu)
* [SavedModel format README.md](https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/saved_model/README.md)

```sh
# Download the TensorFlow Serving Docker image and repo
docker pull tensorflow/serving

git clone https://github.com/tensorflow/serving
# Location of demo models
TESTDATA="$(pwd)/serving/tensorflow_serving/servables/tensorflow/testdata"

# Start TensorFlow Serving container and open the REST API port
docker run -t --rm -p 8501:8501 \
    -v "$TESTDATA/saved_model_half_plus_two_cpu:/models/half_plus_two" \
    -e MODEL_NAME=half_plus_two \
    tensorflow/serving &

# Query the model using the predict API
curl -d '{"instances": [1.0, 2.0, 5.0]}' \
    -X POST http://localhost:8501/v1/models/half_plus_two:predict

# Returns => { "predictions": [2.5, 3.0, 4.5] }
```

## Mnist 예제 (학습 & 모델서빙 & 테스트)

* <https://www.tensorflow.org/tfx/serving/serving_basic>
* 내부적으로 동작하는 방식을 확인하기 위해서는 <https://www.tensorflow.org/tfx/serving/serving_advanced>

### 학습

* [mnist_saved_model.py](https://github.com/tensorflow/serving/blob/master/tensorflow_serving/example/mnist_saved_model.py)

```python
export_path = os.path.join(
    tf.compat.as_bytes(export_path_base),
    tf.compat.as_bytes(str(FLAGS.model_version)))
```

* `FLAGS.model_version` subdir값으로 사용하고 모델의 버전을 의미한다. 올라갈수록 상위 버전

```sh
# Training
tools/run_in_docker.sh python tensorflow_serving/example/mnist_saved_model.py \
  /tmp/mnist
# Check Model
ls /tmp/mnist # 1 <-- model version
ls /tmp/mnist/1 # saved_model.pb variables
```

* `saved_model.pb` serialized tensorflow::SavedModel
  * <https://github.com/tensorflow/tensorflow/blob/master/tensorflow/python/saved_model/README.md>
* `variables` serialized variables of graphs

### 서빙

```sh
docker run -p 8500:8500 \
--mount type=bind,source=/tmp/mnist,target=/models/mnist \
-e MODEL_NAME=mnist -t tensorflow/serving &
```

### 테스트

```sh
tools/run_in_docker.sh python tensorflow_serving/example/mnist_client.py \
  --num_tests=1000 --server=127.0.0.1:8500
# Inference error rate: 11.13%
```

* `mnist_client.py`를 참고해서 `client`를 작성

## 모델 생성 과정

내보낼때는 최종 모델에 모든 전처리 층을 포함하는게 좋음, 원래 형태 그대로 데이터를 주입 가능
전처리를 별도로 관리할 필요가 없고, 모델 업데이트하기가 훨씬 수월하고 모델과 필요한 전처리 단계가 맞지 않는 문제를 피할 수 있음

SavedModel은 모델의 한 버전을 나타낸다. (직렬화된 프로토콜 버퍼로 표현)
ㄴ계산 그래프를 정의한 saved_model.pb 파일
ㄴ변수값을 담은 variables 디렉토리
ㄴ 어휘 사전 파일, 클래스 이름, 모델을 위한 샘플 데이터 같은 부가적인 데이터가 들어 있는 assets 디렉토리를 포함


tf.saved_model.load() 함수를 사용해 SavedModel을 로드할 수 있다.
적절한 타입의 텐서로 입력을 전달해야 predictor를 만들 수 있음

saved_model = tf.saved_model.load(model_path) # or tf.keras.models.load_model
y_pred = saved_model(tf.constant(X_new, dtype=tf.float32))

SavedModel을 검사할 수 있는 saved_model_cli를 제공한다.
$ saved_model_cli show --dir model/version --all

SavedModel은 하나 이상의 metagraph를 포함, 하나의 메타그래프는 하나의 계산 function signature 정의 (입력과 출력 이름 타입, 크기)

saved_model_cli 명령어를 사용해서 실제 예측을 할 수 있음
np.save("test.npy", X_new) 로 저장을 하고 아래와 같이 파일을 넘겨서

$ saved_model_cli run --dir model/version --tag_set serve --signature_def serving_default --inputs flatten_input=test.npy

## TF Serving 실행

```
$ docker run -it --rm -p 8500:8500 -p 8501:8501 -v "$ML_PATH/model:/models/model" -e MODEL_NAME=model tensorflow/serving
```

-it : interactive한 모드로 컨테이너를 만든다. 서버의 출력을 화면에 나타낸다.
--rm: 중지할 때 컨테이너를 삭제한다. (이미지는 삭제하지 않음)
-p 8500:8500: 도커 엔진이 호스트 시스템의 TCP 포트 8500번을 컨테이너의 TCP포트 8500번으로 포워딩한다. 기본적으로 TF서빙은 이 포트를 사용해 gRPC API를 제공
-p 8501:8501: 호스트 시스템의 TCP 포트 8501번을 컨테이너의 TCP 포트 8501번으로 포워딩 한다. 기본적으로 TF 서빙은 이 포트를 사용해 REST API를 제공
-v "$ML_PATH/model:/models/model": 호스트 시스템의 $ML_PATH/model 디렉토리를 컨테이너의 /models/model 경로에 연결
-e MODEL_NAME=model : TF 서빙이 어떤 모델을 서빙할지 알 수 있도록 컨테이너의 MODEL_NAME 환경 변수를 설정. 기본적으로 /models 디렉토리에서 모델을 찾고 자동으로 최신 버전을 서비스한다.

## REST API로 TF서빙 쿼리

쿼리를 위해 JSON 데이터를 만든다.
호출할 함수 시그니처의 이름과 입력 데이터가 포함되어야 한다.

```python
import json

input_data_json = json.dumps({
    "signature_name": "serving_default",
    "instances": X_new.tolist(),
})
```

JSON 포맷은 100% 텍스트이므로 X_new 넘파이 배열을 파이썬 리스트로 변환 후 JSON 문자열로 만들어야 한다.

```python
import requests

SERVER_URL = "http://localhost:8501/v1/models/my_model:predict"
response = requests.post(SERVER_URL, data=input_data_json)
response.raise_for_status() # 에러가 생길 경우 예외를 발생
response = response.json()
```

응답은 predictions 키 하나를 가진 dictionary로 반환
대량의 데이터를 전송할 땐 클라이언트가 지원한다면 gRPC API를 사용하는게 훨씬 좋다. 컴팩트한 이진 포맷(HTTP/2 프레임에 기반한)과 효율적인 통신 프로토콜을 사용하기 때문이다.
ㄴ 프레임은 HTTP/2 통신의 최소단위

## gRPC API로 TF 서빙에 쿼리하기

gRPC API는 직렬화된 PredictRequest 프로토콜 버퍼를 입력
직렬화된 PredictResponse 프로토콜 버퍼를 출력한다.

위 PredictRequest, Response는 tensorflow-serving-api에 포함

```python
from tensorflow_serving.apis.predict_pb2 import PredictRequest

request = PredictRequest()
request.model_spec.name = model_name
request.model_spec.signature_name = "serving_default"
input_name = model.input_names[0]
request.inputs[input_name].CopyFrom(tf.make_tensor_proto(X_new))
```

PredictRequest 프로토콜 버퍼를 만들고 필수 필드를 채운다.
tf.make_tensor_proto() 함수는 주어진 텐서나 넘파이 배열을 기반으로 Tensor 프로토콜 버퍼를 만든다.

위에서 만든 PredictRequest를 grpcio 라이브러리를 사용해 요청하고 PredictResponse를 받는다.

```python
import grpc
from tensorflow_serving.apis import prediction_service_pb2_grpc

channel = grpc.insecure_channel('localhost:8500')
predict_service = prediction_service_pb2_grpc.PredictionServiceStub(channel)
response = predict_service.Predict(request, timeout=10.0)
```

8500번으로 gRPC 통신 채널을 만들고, 그 다음에 이 채널에 대해 gRPC 서비스를 만들고 이를 이용해 10초 timeout이 설정된 요청을 보낸다.
(이 호출은 동기적인 것은 아니다. 응답을 받거나 타임아웃이 지날 떄까지 멈춰있다.)
위 예에서는 보안 채널을 사용하지 않는다. (암호화 없음, 인증 없음) 하지만 gRPC와 텐서플로 서빙은 SSL/TLS 기반의 보안 채널도 제공

```python
output_name = model.output_names[0]
outputs_proto = response.outputs[output_name]
y_proba = tf.make_ndarray(outputs_proto)
```

PredictResponse 프로토콜 버퍼를 텐서로 변경하면 끝

## 새로운 버전의 모델 배포하기

* 새로운 버전의 모델을 만들기 위해서 models/version2 디렉토리에 SavedModel을 내보내고
* 일정한 간격으로 (간격은 tf 서빙에서 조정이 가능) TF 서빙이 새로운 버전을 확인한다.
* 새로운 버전을 찾으면 자동으로 버전을 교체 
* 대기 중인 요청이 있다면 이전 버전의 모델로 응답
* 새로운 요청은 새버전에서 처리
* 대기 중인 요청이 모두 응답을 받으면 바로 이전의 모델은 내려간다.

SavedModel이 aseets/extra 디렉토리에 샘플 데이터를 가지고 있으면 새로운 요청을 처리하기 전에 TF 서빙이 이샘플에서 모델을 실행할 수 있도록 설정할 수 있다.
이를 모델 warmup 이라고 부른다. 이를 통해 필요한 것을 모두 잘 로드하여 첫 번째 요청을 처리할 때 응답 시간이 오래 걸리지 않도록 한다.

위 방법은 버전 전환을 부드럽게 처리해주지만 많은 RAM을 사용한다. 이런 경우 새 버전의 모델을 로드하고 사용하기 전에 이전 버전의 모델로 대기중인 모든 요청을 처리하고 삭제하도록 설정 할 수 있다.
이 설정은 두 버전의 모델이 동시에 로드되는 것을 막습니다. 하지만 짧은 순간 서비스가 중지될 것이다.

버전 2 모델이 기대한 대로 작동하지 않는다면 간단하게 models/version2 의 디렉토리를 삭제하여 버전 1로 rollback 할 수 있다

TF 서빙은 자동배치기능을 제공한다. 이 기능은 시작시 --enable_batching 옵션으로 활성화가 가능하다.
TF 서빙이 짧은 시간 동안 (간격을 설정할 수 있다.) 요청을 여러개 받으면 모델을 사용하기 전에 이 요청들을 자동으로 배치로 만든다.
이렇게 하면 GPU의 장점을 활용할 수 있어서 성능이 크게 향상된다. 배치 지연 시간을 증가시키면 응답속도를 약간 희생하고 높은 처리 능력을 얻을 수 있다. 
(--batching_parameters_file 옵션을 참고)

초당 쿼리 요청이 많을것으로 예상되면 TF서빙을 서버여러대에 설치하고 쿼리를 로드밸런싱 해야 한다. 이를 해결하기 위해 쿠버네티스를 사용

## saved_model_cli 에러

```shell
!saved_model_cli show --dir model/v0.1 --all
```

```
tensorflow.python.framework.errors_impl.InvalidArgumentError: 'func' argument to TF_GraphCopyFunction cannot be null
WARNING:tensorflow:Unresolved object in checkpoint: (root).layer_with_weights-0._resources.C10.C10_lookup._initializer

SavedModel 시에 해당 값들을 사용하지 않아서 생기는 문제

WARNING:tensorflow:A checkpoint was restored (e.g. tf.train.Checkpoint.restore or tf.keras.Model.load_weights) but not all checkpointed values were used. See above for specific issues. Use expect_partial() on the load status object, e.g. tf.train.Checkpoint.restore(...).expect_partial(), to silence these warnings, or use assert_consumed() to make the check explicit. See https://www.tensorflow.org/guide/checkpoint#loading_mechanics for details.
```

* InputDictionary에 해당 Key가 없어서 생긴 에러라고 생각했는데 또 생긴다.

```
WARNING:tensorflow:A checkpoint was restored (e.g. tf.train.Checkpoint.restore or tf.keras.Model.load_weights) but not all checkpointed values were used. See above for specific issues. Use expect_partial() on the load status object, e.g. tf.train.Checkpoint.restore(...).expect_partial(), to silence these warnings, or use assert_consumed() to make the check explicit. See https://www.tensorflow.org/guide/checkpoint#loading_mechanics for details.
```

* assets에 dictionary를 넣어봐도 동일하게 에러 
* 모든 체크포인트를... 사용하지 않았다고?

### Tensorflow Serving REST APIs

* <https://www.tensorflow.org/tfx/serving/api_rest#predict_api>

```sh
GET http://localhost:8501/v1/models/model/metadata
GET http://localhost:8501/v1/models/model
```