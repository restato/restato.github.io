---
title: BentoML Integeration MLflow
categories: [Serving]
tags: [ML, Serving, Model, BentoML, MLflow]
mermaid: true
math: true
comments: true
pin: false
---

* BentoML은 실험 플랫폼과 모델 개발 환경에 구애받지 않는다. 그래서 MLflow와 연동해서 사용이 가능
* MLflow Model Registry와 비교하여 BentoML의 모델 형식 및 모델 저장소는 예측 서비스 구축, 테스트 및 배포에 사용될 모델 아티팩트를 관리하도록 설계
* periodic training pipelines에서 최상의 결과를 산출하고 프로덕션에서 실행하기 위한 모델 집합인 최종 모델을 관리하는데 가장 적합 
  * 실험 모델들은 MLflow 관리
  * 실험에서 production 모델에 나갈 모델은 BentoML에서 관리
* BentoML은 MLflow natively와 통합
* 사용자는 high-performance 모델 서비스를 위해 MLflow Tracking으로 기록된 모델을 BentoML로 포팅할 수 있을 뿐만 아니라 MLflow projects 및 파이프라인을 BentoML의 모델 배포 워크플로우와 효율적으로 결합이 가능

# Compatibility

BentoML은 MLflow 0.9 이상을 지원

# Examples

BentoML과 MLflow integeration 샘플 코드는 [bentoml/examples: MLflow Examples](https://github.com/bentoml/BentoML/tree/main/examples/mlflow)를 확인

# Import an MLflow model

MLflow Model은 MLflow experiments와 pipelines에서 저장되는 학습된 모델 artifacts 포맷이다. BentoML에서 MLflow Model을 import 해서 사용할 수 있다.

```python
mlflow.sklearn.save_model(model, "./my_model") # 모델 저장
bentoml.mlflow.import_model("my_sklearn_model", model_uri="./my_model") # 모델 임포트
```

```python
with mlflow.start_run():
    mlflow.pytorch.log_model(model, artifact_path="pytorch-model")  # 모델 로깅

    model_uri = mlflow.get_artifact_uri("pytorch-model")
    bento_model = bentoml.mlflow.import_model( # model 임포트, save_model API와 유사
        'mlflow_pytorch_mnist', # BentoML 모델 저장소의 모델 이름, bentoml models list mlflow_pytorch_mnist
        model_uri, # 로컬 경로인 `runs:/` URI 또는 remote `s2://` URI, `models://`
        signatures={'predict': {'batchable': True}}
    )
```

## Running Imported Model

MLflow에 imported models를 BentoML로 여러 방법으로 로드가 가능

### Loading original model flavor

```python
bento_model = bentoml.mlflow.get("mlflow_pytorch_mnist:latest")
mlflow_model_path = bento_model.path_of(bentoml.mlflow.MLFLOW_MODEL_FOLDER)

loaded_pytorch_model = mlflow.pytorch.load_model(mlflow_model_path)
loaded_pytorch_model.to(device)
loaded_pytorch_model.eval()
with torch.no_grad():
    input_tensor = torch.from_numpy(test_input_arr).to(device)
    predictions = loaded_pytorch_model(input_tensor)
```
### Loading Pyfunc flavor

`bentoml.mlflow.load_model`로 MLflow model을 임포트 할 수 있음

```python
pyfunc_model: mlflow.pyfunc.PyFuncModel = bentoml.mlflow.load_model("mlflow_pytorch_mnist:latest")
predictions = pyfunc_model.predict(test_input_arr)
```

### Using Model [Runner](https://docs.bentoml.org/en/latest/concepts/runner.html)

```python
runner = bentoml.mlflow.get("mlflow_pytorch_mnist:latest").to_runner()
runner.init_local()
runner.predict.run(input_df)

# 아래 input types 만 지원
MLflowRunnerInput = Union[pandas.DataFrame, np.ndarray, List[Any], Dict[str, Any]]
MLflowRunnerOutput = Union[pandas.DataFrame, pandas.Series, np.ndarray, list]
```

> To use adaptive batching with a MLflow Runner, make sure to set signatures={'predict': {'batchable': True}} when importing the model:

```python
bento_model = bentoml.mlflow.import_model(
    'mlflow_pytorch_mnist',
    model_uri,
    signatures={'predict': {'batchable': True}} # batching 적용하려면 True 넘겨야함
)
```

### Optimizations

* `MLflow Runner`를 사용하면 몇가지 limitations이 있음
  * Lack of support for GPU
  * Lack of support for multiple inference method
* common optimization은 trained model instance를 bentoML로 직접 저장하는것 (MLflow pyfunc model을 import하는 대신에)
  * trained model instance를 BentoML로 저장하면 GPU inference, multiple inference signatures가 가능

```python
# Save model directly with bentoml
mlflow.sklearn.log_model(clf, "model")
bentoml.sklearn.save_model("iris_clf", clf)

# Load original flavor and save the BentoML
loaded_model = mlflow.sklearn.load_model(model_uri)
bentoml.sklearn.save_model("iris_clf", loaded_model)
```

## Build Prediction Service

```python
import bentoml
import mlflow
import torch

mnist_runner = bentoml.mlflow.get('mlflow_pytorch_mnist:latest').to_runner()

svc = bentoml.Service('mlflow_pytorch_mnist', runners=[ mnist_runner ])

input_spec = bentoml.io.NumpyNdarray(
    dtype="float32",
    shape=[-1, 1, 28, 28],
    enforce_shape=True,
    enforce_dtype=True,
)

@svc.api(input=input_spec, output=bentoml.io.NumpyNdarray())
def predict(input_arr):
    return mnist_runner.predict.run(input_arr)
```

## MLflow 🤝 BentoML Workflow

model serving, deployment를 어떻게 MLflow, BentoML과 통합할지

1. MLflow model instance의 `model_uri`를 찾아라

```python
# https://github.com/bentoml/BentoML/tree/main/examples/mlflow/sklearn_logistic_regression
logged_model = mlflow.sklearn.log_model(lr, "model")
print("Model saved in run %s" % mlflow.active_run().info.run_uuid)

# Import logged mlflow model to BentoML model store for serving:
bento_model = bentoml.mlflow.import_model('logistic_regression_model', logged_model.model_uri)
print("Model imported to BentoML: %s" % bento_model)
```

2. `mlflow.run` scope 내에서 model artifact path를 찾아

```python
# https://github.com/bentoml/BentoML/tree/main/examples/mlflow/pytorch
with mlflow.start_run():
    ...
    mlflow.pytorch.log_model(model, artifact_path="pytorch-model")
    model_uri = mlflow.get_artifact_uri("pytorch-model")
    bento_model = bentoml.mlflow.import_model('mlflow_pytorch_mnist', model_uri)
```

3. `autolog`할때, `model_uri`를 찾아

```python
import mlflow
import bentoml
from sklearn.linear_model import LinearRegression

# enable autologging
mlflow.sklearn.autolog()

# prepare training data
X = np.array([[1, 1], [1, 2], [2, 2], [2, 3]])
y = np.dot(X, np.array([1, 2])) + 3

# train a model
model = LinearRegression()
model.fit(X, y)

# import logged MLflow model to BentoML
run_id = mlflow.last_active_run().info.run_id
artifact_path = "model"
model_uri = f"runs:/{run_id}/{artifact_path}"
bento_model = bentoml.mlflow.import_model('logistic_regression_model', model_uri)
print(f"Model imported to BentoML: {bento_model}")
```

4. MLflow server에 모델을 등록

Model Registry를 사용하고 있으면 바로 BentoML 로 모델을 등록할 수 있음

```python
# Import from a version:
model_name = "sk-learn-random-forest-reg-model"
model_version = 1
model_uri=f"models:/{model_name}/{model_version}"
bentoml.mlflow.import_model('my_mlflow_model', model_uri)

# Import from a stage:
model_name = "sk-learn-random-forest-reg-model"
stage = 'Staging'
model_uri=f"models:/{model_name}/{stage}"
bentoml.mlflow.import_model('my_mlflow_model', model_uri)
```

## Additional Tips

### Use MLflow model dependencies config

* MLflow model dependencies config를 사용할 수 있음
  * `Service`에서 추가적인 dependencies가 없으면 MLflow에서 모델 생성하기 위한 dependenies를 BentoML에서 사용이 가능

```yaml
# bentofile.yaml
# virtualenv 는 어떻게 못하나 python_env.yaml생성해서 사용하는데 음
python:
    requirements_txt: $BENTOML_MLFLOW_MODEL_PATH/mlflow_model/requirements.txt
    lock_packages: False
conda: # Alternatively
    environment_yml: $BENTOML_MLFLOW_MODEL_PATH/mlflow_model/conda.yaml
```

이를 통해 BentoML은 user-defined environment variable 기반으로 지정된 dependency file을 동적으로 찾을 수 있습니다. 

```shell
export BENTOML_MLFLOW_MODEL_PATH=$(bentoml models get my_mlflow_model:latest -o path)
bentoml build
```

### Attach model params, metrics, and tags

* MLflow model format은 training metrics 및 parameters에 관한 많은 context information을 encapusaltes
* code snippet은 MLflow 모델에서 BentoML 모델 저장소로 기록된 메타데이터를 패키징하는 방법

```python
run_id = '0e4425ecbf3e4672ba0c1741651bb47a'
run = mlflow.get_run(run_id)
model_uri = f"{run.info.artifact_uri}/model"
bentoml.mlflow.import_model(
    "my_mlflow_model",
    model_uri,
    labels=run.data.tags,
    metadata={
        "metrics": run.data.metrics,
        "params": run.data.params,
    }
)
```


# Reference

[BentoML with MLflow](https://docs.bentoml.org/en/latest/integrations/mlflow.html)