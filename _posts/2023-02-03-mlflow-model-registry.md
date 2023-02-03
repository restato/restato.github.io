---
title: "[MLflow] Model Registry"
categories: [MLflow]
tags: [mlflow, python, model, registry]
mermaid: true
math: true
comments: true
pin: false
---

# Intro

* centralized model store
* set of APIs
* UI
* Model 라이프사이클 관리
* model lineage 를 제공
* model versinoing
* stage transitions
  * staging에서 production
* annotations

# Concepts

모델의 전체 수명 주기를 설명하고 facilitate(용이하게).

* Model
  * experiment로 부터 생성
  * `mlflow.<model_flavor>.log_model() method`
  * 한번 로깅되면 model은 Model Registry에 등록
* Registered Model
  * 등록된 모델은 아래 값을 갖고 있음
    * unique name
    * contain versions
    * transitional stages (과도기 단계)
    * model lineage
    * metadata
* Model Version
  * 각 registered model은 한개 또는 여러개 버전을 갖음
  * 모델이 Model Registry에 추가되면 모델 버전 1로 추가
  * 이후에 모델이 추가되면 모델 버전이 한개씩 증가
* Model Stage
  * 각각의 개별 모델 버전은 하나의 stage에 할당이 가능
  * MLflow는 Staging, Production, Archived와 같은 일반적인 사용 사례에 대해서 미리 정의된 stages를 제공
  * 한 단계에서 다른 단계로 모델 버전을 전환할 수 있음
* Annotations and Descriptions (`.md`로 작성)
  * 알고리즘 설명, 사용된 데이터 셋 또는 방법론과 같은 팀에 유용한 설명 및 관련 정보 작성 가능
  * top-level 모델 과 각 버전에 개별적으로 주석이 가능

# Model Registry Workflows

MLflow server를 띄웠다면 UI OR API를 통해 model registry를 접근하기 위해서는 database-backed store를 사용해야 한다.

모델 flavors에 상응하는 `log_model` methods를 사용해야 Model Registry에 추가가 가능하다. 모델이 등록되면 UI, API를 통해 Model Registry에서 modify, update, transition, or delete model이 가능하다.

# API Workflow

Model Registry와 interact 하는 다른 방법은 MLflow model flavor 또는 MLflow Client Tracking API interface를 사용하는 것이다. 특히 MLflow 실험 실행 중이나 모드 실험 실행 후에 모델을 등록할 수 있다.

## Adding an MLflow Model to the Model Registry

* `mlflow.<model_flavor>.log_model()`: model flavor의 log_model method로
* `mlflow.register_model()`: 실험 종료한 이후에
* `create_registered_model()`

```python
from random import random, randint
from sklearn.ensemble import RandomForestRegressor

import mlflow
import mlflow.sklearn

with mlflow.start_run(run_name="YOUR_RUN_NAME") as run:
    params = {"n_estimators": 5, "random_state": 42}
    sk_learn_rfr = RandomForestRegressor(**params)

    # Log parameters and metrics using the MLflow APIs
    mlflow.log_params(params)
    mlflow.log_param("param_1", randint(0, 100))
    mlflow.log_metrics({"metric_1": random(), "metric_2": random() + 1})

    # Log the sklearn model and register as version 1
    # 있으면 모델 번호가 증가
    mlflow.sklearn.log_model(
        sk_model=sk_learn_rfr,
        artifact_path="sklearn-model",
        registered_model_name="sk-learn-random-forest-reg-model"
    )
```

```python
# (train)

# runs:URI argument가 필요
result = mlflow.register_model(
    "runs:/d16076a3ec534311817565e6527539c0/sklearn-model",
    "sk-learn-random-forest-reg"
)
# result: Mlflow object
```

```python
from mlflow import MlflowClient

client = MlflowClient()
client.create_registered_model("sk-learn-random-forest-reg-model")

client = MlflowClient()
result = client.create_model_version(
    name="sk-learn-random-forest-reg-model",
    source="mlruns/0/d16076a3ec534311817565e6527539c0/artifacts/sklearn-model",
    run_id="d16076a3ec534311817565e6527539c0"
)
```

## Fetching an MLflow Model from the Model Registry

MLflow model이 등록이 된 이후에는 아래 두가지 방법으로 모델을 fetch

* `mlflow.<model_flavor>.load_model()`
* `load_model()`

```python
import mlflow.pyfunc

model_name = "sk-learn-random-forest-reg-model"
model_version = 1 # 특정 버전으로 fetch

model = mlflow.pyfunc.load_model(
    model_uri=f"models:/{model_name}/{model_version}"
)

model.predict(data)
```


```python
import mlflow.pyfunc

model_name = "sk-learn-random-forest-reg-model"
stage = 'Staging' # latest model version in a specific stage

model = mlflow.pyfunc.load_model(
    model_uri=f"models:/{model_name}/{stage}"
)

model.predict(data)
```

# Serving an MLflow Model from Model Registry

```python
#!/usr/bin/env sh

# Set environment variable for the tracking URL where the Model Registry resides
export MLFLOW_TRACKING_URI=http://localhost:5000

# Serve the production model from the model registry
mlflow models serve -m "models:/sk-learn-random-forest-reg-model/Production"
```

# Adding or Updating an MLflow Model Descriptions

`update_model_version()`을 사용

```python
client = MlflowClient()
client.update_model_version(
    name="sk-learn-random-forest-reg-model",
    version=1,
    description="This model version is a scikit-learn random forest containing 100 decision trees"
)
```

# Renaming an MLflow Model

* `rename_registered_model().`을 사용

```python
client = MlflowClient()
client.rename_registered_model(
    name="sk-learn-random-forest-reg-model",
    new_name="sk-learn-random-forest-reg-model-100"
)
```

# Transitioning an MLflow Model's Stage

```python
client = MlflowClient()
client.transition_model_version_stage(
    name="sk-learn-random-forest-reg-model",
    version=3,
    stage="Production" # Staging, Archived, None
)
```

# Listing and Searching MLflow Models

```python
from pprint import pprint

client = MlflowClient()
for rm in client.search_registered_models(): # 너무 많이 나오니 아래 모델 이름으로 검색
    pprint(dict(rm), indent=4)

client = MlflowClient()
for mv in client.search_model_versions("name='sk-learn-random-forest-reg-model'"):
    pprint(dict(mv), indent=4)
```

# Archiving an MLflow Model

Production에서 Archived stage로 변경이 가능하고, 이후에 삭제도 가능

```python
# Archive models version 3 from Production into Archived
client = MlflowClient()
client.transition_model_version_stage(
    name="sk-learn-random-forest-reg-model",
    version=3,
    stage="Archived"
)
```

# Deleting MLflow Models

모델 삭제하면 다시 복구가 어려우니 신중하게

```python
# Delete versions 1,2, and 3 of the model
client = MlflowClient()
versions=[1, 2, 3]
for version in versions:
    client.delete_model_version(name="sk-learn-random-forest-reg-model", version=version)

# Delete a registered model along with all its versions
client.delete_registered_model(name="sk-learn-random-forest-reg-model")
```

# Registering a Saved Model

MLflow로 학습을 하지 않고, 모델을 등록하는 경우

```python
import numpy as np
import pickle

from sklearn import datasets, linear_model
from sklearn.metrics import mean_squared_error, r2_score

# source: https://scikit-learn.org/stable/auto_examples/linear_model/plot_ols.html

# Load the diabetes dataset
diabetes_X, diabetes_y = datasets.load_diabetes(return_X_y=True)

# Use only one feature
diabetes_X = diabetes_X[:, np.newaxis, 2]

# Split the data into training/testing sets
diabetes_X_train = diabetes_X[:-20]
diabetes_X_test = diabetes_X[-20:]

# Split the targets into training/testing sets
diabetes_y_train = diabetes_y[:-20]
diabetes_y_test = diabetes_y[-20:]


def print_predictions(m, y_pred):

    # The coefficients
    print('Coefficients: \n', m.coef_)
    # The mean squared error
    print('Mean squared error: %.2f'
          % mean_squared_error(diabetes_y_test, y_pred))
    # The coefficient of determination: 1 is perfect prediction
    print('Coefficient of determination: %.2f'
          % r2_score(diabetes_y_test, y_pred))

# Create linear regression object
lr_model = linear_model.LinearRegression()

# Train the model using the training sets
lr_model.fit(diabetes_X_train, diabetes_y_train)

# Make predictions using the testing set
diabetes_y_pred = lr_model.predict(diabetes_X_test)
print_predictions(lr_model, diabetes_y_pred)

# save the model in the native sklearn format
filename = 'lr_model.pkl'
pickle.dump(lr_model, open(filename, 'wb'))
```

위에서 생성한 모델을 아래와 같은 방법으로 Model Registry에 등록

```python
import mlflow

# load the model into memory
loaded_model = pickle.load(open(filename, 'rb'))

# log and register the model using MLflow scikit-learn API
mlflow.set_tracking_uri("sqlite:///mlruns.db")
reg_model_name = "SklearnLinearRegression"
print("--")
mlflow.sklearn.log_model(loaded_model, "sk_learn",
                             serialization_format="cloudpickle",
                             registered_model_name=reg_model_name)
```

```python
# load the model from the Model Registry and score
model_uri = f"models:/{reg_model_name}/1"
loaded_model = mlflow.sklearn.load_model(model_uri)
print("--")

# Make predictions using the testing set
diabetes_y_pred = loaded_model.predict(diabetes_X_test)
print_predictions(loaded_model, diabetes_y_pred)
```

# Registering an Unsupported Machine Learning Model

* 지원하지 않는 모델의 경우 = built-in MLflow Model flavor support 없는 경우
* VaderSentiment Library의 겨우 Mlflow flavor 가 없어서 MLflow Model fluent APIs를 사용해서 모델을 등록하거나 로깅 할 수없음.
* `mlflow.pyfunc` 인스턴스를 생성해서 사용이 가능

# Reference

* [MLflow Model Registry](https://mlflow.org/docs/latest/model-registry.html)를 참고
