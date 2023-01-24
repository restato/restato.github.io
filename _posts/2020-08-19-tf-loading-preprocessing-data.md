---
title: Tensorflow 데이터 로딩 및 전처리 파이프라인 구현하기
tags: [tensorflow, data, preprocessing]
categories: [machine-learning, tensorflow]
---

tensorflow를 사용하면서 가장 까다로운 부분이 입력데이터 파이프라인 처리해서 모델까지 데이터 흐르는 구간을 만드는게 아닌가 싶다. 데이터의 양이 많을때, 적을때, 그리고 형태에 따라 다양하게 구현을 해야하기 때문에 A라는 방법을 써서 구현하다 보면 모델에 데이터를 넣는 부분이 막힐때가 있다. 그래서 텐서플로우에서 입력데이터를 어떻게 처리해야 하는지에 대한 내용을 정리

아주 규모가 큰 데이터의 경우 텐서플로가 멀티스레딩, 큐, 배치, 프리페치<sup>prefetch</sup>와 같은 상세한 사항을 모두 대신 처리해준다.

## 데이터의 형태

- CSV 파일
- 텐서플로 TF Record: protocol buffer를 담은 유연하고 효율적인 이진 포맷
- SQL 데이터베이스
- 구글 BigQuery

입력된 데이터의 형태를 원-핫 인코딩, BoW 인코딩, Embedding 등을 사용하여 인코딩되어야 한다.

## 전처리 층

- TF.Transform
  - 훈련 전에 전체 훈련 세트에 대해 실행하는 전처리 함수를 작성할 수 있다.
- TFDS
  - 각종 데이터셋을 다운로드할 수 있는 편리한 함수 제공

# 데이터 API (Dataset)

데이터를 읽을때 중심이 되는 Dataset 클래스에 대해서 알아보기

## Dataset class 확인하기

```python
for m in dir(tf.data.Dataset):
    if not (m.startswith("_") or m.endswith("_")):
        func = getattr(tf.data.Dataset, m)
        if hasattr(func, "__doc__"):
            print("● {:21s}{}".format(m + "()", func.__doc__.split("\n")[0]))
```

## 사용하기

```python
X = tf.range(10)
dataset = tf.data.Dataset.from_tensor_slices(X)
dataset

tf.data.Dataset.Range(10) # 위와 동일

for item in dataset: # Tensor의 형태를 출력
  print(item)

# repeat(): 원본 데이터셋의 아이템을 N차례 반복하는 새로운 데이터셋을 반환 (복사하는 것은 아님)
# batch() : 아이템을 N개의 그룹으로 묶는다
# batch(drop_remainder=True): 마지막에 N보다 부족한 길이의 배치는 버림 (=모든 배치의 크기가 동일)
dataset = dataset.repeat(3).batch(7)
for item in dataset:
    print(item)

# 데이터에 원하는 전처리 작업에도 적용 (이미지 크기 변환, 회전계산)
# map(num_parallel_calls) 를 하면 여러개의 스레드로 나누어서 속도를 높여 처리 가능
dataset = dataset.map(lambda x: x*2)

# map은 각 아이템에 변환을 적용하지만 apply는 데이터셋 전체에 변환을 적용
# dataset = dataset.apply(tf.data.experimental.unbatch()) # deprecated
dataset = dataset.unbatch()

# filter 할때
dataset = dataset.filter(labmda x: x <10)

# 데이터셋에 있는 몇개의 아이템만 보고싶을때
for item in dataset.take(3):
    print(item)
```

## 데이터 셔플

- 경사 하강법은 훈련 세트에 있는 샘플이 독립적이고 동일한 분포일때 최고의 성능을 발휘 (=shuffle이 필요한 이유)
- 동작
  1. 원본 데이터셋의 처음 아이템을 buffer_size 개수만큼 추출하여 버퍼에 채운다.
  2. 새로운 아이템이 요청되면 이 버퍼에서 랜덤하게 하나를 꺼내 반환
  3. 원본 데이터셋에서 새로운 아이템을 추출하여 비워진 버퍼를 채운다.
  4. 원본 데이터셋의 모든 아이템이 사용될 때까지 반복
  5. 버퍼가 비워질 때까지 계속하여 랜덤하게 아이템을 반환
- 버퍼의 크기를 충분히 크게 하는 것이 중요하다. (=셔플링 효과를 올리기 위해서), 메모리의 크기를 넘지 않도록, 데이터의 크기를 넘지 않도록
  - 완벽한 셔플링을 위해서는 버퍼크기가 데이터셋의 크기와 동일
- 셔플링되는 순서를 동일하게 만들기 위해 랜덤 시드를 부여
- advanced
  - 데이터가 너무 크다면 원본 데이터 자체를 리눅스에서 `shuf`를 통해 섞어서
  - 원본 데이터를 여러 파일로 나눈 다음 훈련하는 동안 무작위로 읽기

```python
tf.random.set_seed(42) # 셔플링 순서를 동일하게

# (1) repeat하고 shuffle
dataset = tf.data.Dataset.range(10).repeat(3)
# reshuffle_each_iteration=False 를 지정하면 반복마다 동일한 순서를 사용할 수 있다.
# dataset.shuffle(reshuffle_each_iteration=False)
dataset = dataset.shuffle(buffer_size=3, seed=42).batch(7) # seed를 항상 설정을 해줘야 한다.

# (2) shuffle하고 repeat
dataset = tf.data.Dataset.range(10)
dataset = dataset.shuffle(buffer_size=3, seed=42).repeat(3).batch(7) # 반복마다 순서가 달라지도록
for item in dataset:
    print(item)
```

### 여러 파일에서 한 줄씩 번갈아 읽기

```python
'''
여러 파일로 데이터 나누기
'''

from sklearn.datasets import fetch_california_housing
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler

housing = fetch_california_housing()
X_train_full, X_test, y_train_full, y_test = train_test_split(
    housing.data, housing.target.reshape(-1, 1), random_state=42)
X_train, X_valid, y_train, y_valid = train_test_split(
    X_train_full, y_train_full, random_state=42)

scaler = StandardScaler()
scaler.fit(X_train)
X_mean = scaler.mean_
X_std = scaler.scale_

def save_to_multiple_csv_files(data, name_prefix, header=None, n_parts=10):
    housing_dir = os.path.join("datasets", "housing")
    os.makedirs(housing_dir, exist_ok=True)
    path_format = os.path.join(housing_dir, "my_{}_{:02d}.csv")

    filepaths = []
    m = len(data)
    for file_idx, row_indices in enumerate(np.array_split(np.arange(m), n_parts)):
        part_csv = path_format.format(name_prefix, file_idx)
        filepaths.append(part_csv)
        with open(part_csv, "wt", encoding="utf-8") as f:
            if header is not None:
                f.write(header)
                f.write("\n")
            for row_idx in row_indices:
                f.write(",".join([repr(col) for col in data[row_idx]]))
                f.write("\n")
    return filepaths

train_data = np.c_[X_train, y_train]
valid_data = np.c_[X_valid, y_valid]
test_data = np.c_[X_test, y_test]
header_cols = housing.feature_names + ["MedianHouseValue"]
header = ",".join(header_cols)

train_filepaths = save_to_multiple_csv_files(train_data, "train", header, n_parts=20)
valid_filepaths = save_to_multiple_csv_files(valid_data, "valid", header, n_parts=10)
test_filepaths = save_to_multiple_csv_files(test_data, "test", header, n_parts=10)

import pandas as pd

pd.read_csv(train_filepaths[0]).head()
with open(train_filepaths[0]) as f:
    for i in range(5):
        print(f.readline(), end="")

'''
데이터 나눠서 읽기
'''

filepath_dataset = tf.data.Dataset.list_files(train_filepaths, seed=42) # default: shuffle=True
n_reader = 5
# skip(1): header
# interleave(): filepath_dataset에 있는 다섯개의 파일 경로에서 데이터를 읽는 데이터셋을 생성,TextLineDataset 5개를 순회하면서 한줄씩 읽는다.
# 파일 길이가 동일할때 interleave를 사용하는게 좋음 (각파일에서 한줄씩 읽음)
# num_parallel_calls 매개변수에 원하는 스레드 개수를 지정
# tf.data.experimental.AUTOTUNE: 을 지정하면 텐서플로가 가용한 CPU를 기반으로 동적으로 적절한 스레드 개수를 선택할 수 있다.
# cycle_length: 동시에 처리할 입력 개수를 지정
dataset = filepath_dataset.interleave(lambda filepath: tf.data.TextLineDataset(filepath).sip(1), cycle_length=n_readers)

# 각 TextLineDataset의 순서가 랜덤으로 첫번째 해당하는 행을 읽음 (순서가 랜덤)
for line in dataset.take(5):
  print(line.numpy())
```

## 데이터 전처리

평균과 표준편차를 미리 계산했다고 가정

```python
X_mean, X_std = [...]
n_inputs = 8

@tf.fuction
def preprocess(line):
  defs = [0.] * n_inputs + [tf.constant([], dtype=tf.float32)]
  fields = tf.io.decode_csv(line, record_defaults=defs) # csv의 한 라인을 받아 파싱
  # stack() 모든 텐서를 쌓아 1D 배열을 생성
  x = tf.stack(fields[:-1]) # <tf.Tensor: shape=(6,), dtype=int32, numpy=array([1, 2, 3, 4, 5, 6], dtype=int32)>
  y = tf.stack(fields[-1:]) # <tf.Tensor: shape=(1,), dtype=int32, numpy=array([7], dtype=int32)>
  return (x - X_mean) / X_std, y

preprocess(b'4.2083, 44.0, 5.332,....')


record_defaults=[0, np.nan, tf.constant(np.nan, dtype=tf.float64), "Hello", tf.constant([])]
parsed_fields = tf.io.decode_csv('1,2,3,4,5', record_defaults)
'''
[<tf.Tensor: shape=(), dtype=int32, numpy=1>,
 <tf.Tensor: shape=(), dtype=float32, numpy=2.0>,
 <tf.Tensor: shape=(), dtype=float64, numpy=3.0>,
 <tf.Tensor: shape=(), dtype=string, numpy=b'4'>,
 <tf.Tensor: shape=(), dtype=float32, numpy=5.0>]
'''

parsed_fields = tf.io.decode_csv(',,,,5', record_defaults)
'''
[<tf.Tensor: shape=(), dtype=int32, numpy=0>,
 <tf.Tensor: shape=(), dtype=float32, numpy=nan>,
 <tf.Tensor: shape=(), dtype=float64, numpy=nan>,
 <tf.Tensor: shape=(), dtype=string, numpy=b'Hello'>,
 <tf.Tensor: shape=(), dtype=float32, numpy=5.0>]
'''

# Exception
try:
    parsed_fields = tf.io.decode_csv(',,,,', record_defaults) # case 1
    parsed_fields = tf.io.decode_csv('1,2,3,4,5,6,7', record_defaults) # case 2
except tf.errors.InvalidArgumentError as ex:
    print(ex)

# case 1 : Field 4 is required but missing in record 0! [Op:DecodeCSV]
# case 2 : Expect 5 fields but have 7 in record 0 [Op:DecodeCSV]
```

## 데이터 적재와 전처리를 한번에

- 위 코드를 재사용하기 위해서 하나의 함수로 생성
- CSV파일에서 캘리포니아 주택 데이터셋을 효율적으로 적재하고 전처리, 셔플링, 반복, 배치를 적용한 데이터셋을 만들어 반환

```python
def csv_reader_dataset(filepaths, repeat=1, n_readers=5,
                       n_read_threads=None, shuffle_buffer_size=10000,
                       n_parse_threads=5, batch_size=32):
    dataset = tf.data.Dataset.list_files(filepaths).repeat(repeat)
    dataset = dataset.interleave(
        lambda filepath: tf.data.TextLineDataset(filepath).skip(1),
        cycle_length=n_readers, num_parallel_calls=n_read_threads)
    dataset = dataset.shuffle(shuffle_buffer_size)
    dataset = dataset.map(preprocess, num_parallel_calls=n_parse_threads)
    dataset = dataset.batch(batch_size)
    return dataset.prefetch(1) # 학습 성능에 아주 중요한 역할

tf.random.set_seed(42)

train_set = csv_reader_dataset(train_filepaths, batch_size=3)
for X_batch, y_batch in train_set.take(2):
    print("X =", X_batch)
    print("y =", y_batch)
    print()
```

- 데이터셋이 메모리에 모두 들어갈 수 있을 정도로 작다면 RAM에 모두 캐싱할 수 있는 `cache()` 메서드를 사용하면 훈련 속도를 크게 높일 수 있음
- (캐싱) > 데이터 적재 > 젙처리 > 셔플링 > 반복 > 배치 > 프리페치

### prefetch()

- 훈련 속도를 더 빠르게
- `prefetch(1)`을 호출하면 데이터셋은 항상 한 배치가 미리 준비되도록 최선을 (=알고리즘이 한 배치로 작업하는 동안 이 데이터셋이 동시에 다음 배치를 준비)
- GPU에서 훈련하는 스텝을 수행하는 것보다 짧은 시간안에 한 배치 데이터를 준비할 수 있다. (=GPU 100%활용하는 방법)
- nterleave와 map에 `num_parallel_calls`을 함께 사용하면 데이터를 적재하고 전처리할때 CPU의 멀티코어를 사용해 더 빠르게 준비 가능
- prefetch는 일반적으로 하나도 충분, `tf.data.experimental.AUTOTUNE`을 전달하면 텐서플로가 자동으로 결정 (하지만 아직 실험 단계)
- GPU에서 데이터를 바로 프리페치할 수 있는 `tf.data.experimental.prefetch_to_device()`를 확인해보자

## tf.keras와 데이터셋 사용

- `csv_reader_dataset()`함수로 훈련 세트로 사용할 데이터셋을 만들 수 있다.

```python
train_set = csv_reader_dataset(train_filepaths, repeat=None)
valid_set = csv_reader_dataset(valid_filepaths)
test_set = csv_reader_dataset(test_filepaths)

keras.backend.clear_session()
np.random.seed(42)
tf.random.set_seed(42)

model = keras.models.Sequential([
    keras.layers.Dense(30, activation="relu", input_shape=X_train.shape[1:]),
    keras.layers.Dense(1),
])
model.compile(loss="mse", optimizer=keras.optimizers.SGD(lr=1e-3))
batch_size = 32
model.fit(train_set, steps_per_epoch=len(X_train) // batch_size, epochs=10,
          validation_data=valid_set)
model.evaluate(test_set, steps=len(X_test) // batch_size)

new_set = test_set.map(lambda X, y: X) # 레이블이 있어도 상관 없음 케라스에서 무시
X_new = X_test
model.predict(new_set, steps=len(X_new) // batch_size)


'''
전체 훈련 반복을 수행하는 텐서플로 함수를 만들수 있음
'''

optimizer = keras.optimizers.Nadam(lr=0.01)
loss_fn = keras.losses.mean_squared_error

n_epochs = 5
batch_size = 32
n_steps_per_epoch = len(X_train) // batch_size
total_steps = n_epochs * n_steps_per_epoch
global_step = 0
for X_batch, y_batch in train_set.take(total_steps):
    global_step += 1
    print("\rGlobal step {}/{}".format(global_step, total_steps), end="")
    with tf.GradientTape() as tape:
        y_pred = model(X_batch)
        main_loss = tf.reduce_mean(loss_fn(y_batch, y_pred))
        loss = tf.add_n([main_loss] + model.losses)
    gradients = tape.gradient(loss, model.trainable_variables)
    optimizer.apply_gradients(zip(gradients, model.trainable_variables))

keras.backend.clear_session()
np.random.seed(42)
tf.random.set_seed(42)

optimizer = keras.optimizers.Nadam(lr=0.01)
loss_fn = keras.losses.mean_squared_error

@tf.function
def train(model, n_epochs, batch_size=32,
          n_readers=5, n_read_threads=5, shuffle_buffer_size=10000, n_parse_threads=5):
    train_set = csv_reader_dataset(train_filepaths, repeat=n_epochs, n_readers=n_readers,
                       n_read_threads=n_read_threads, shuffle_buffer_size=shuffle_buffer_size,
                       n_parse_threads=n_parse_threads, batch_size=batch_size)
    for X_batch, y_batch in train_set:
        with tf.GradientTape() as tape:
            y_pred = model(X_batch)
            main_loss = tf.reduce_mean(loss_fn(y_batch, y_pred))
            loss = tf.add_n([main_loss] + model.losses)
        gradients = tape.gradient(loss, model.trainable_variables)
        optimizer.apply_gradients(zip(gradients, model.trainable_variables))

train(model, 5)

keras.backend.clear_session()
np.random.seed(42)
tf.random.set_seed(42)
optimizer = keras.optimizers.Nadam(lr=0.01)
loss_fn = keras.losses.mean_squared_error

@tf.function
def train(model, n_epochs, batch_size=32,
          n_readers=5, n_read_threads=5, shuffle_buffer_size=10000, n_parse_threads=5):
    train_set = csv_reader_dataset(train_filepaths, repeat=n_epochs, n_readers=n_readers,
                       n_read_threads=n_read_threads, shuffle_buffer_size=shuffle_buffer_size,
                       n_parse_threads=n_parse_threads, batch_size=batch_size)
    n_steps_per_epoch = len(X_train) // batch_size
    total_steps = n_epochs * n_steps_per_epoch
    global_step = 0
    for X_batch, y_batch in train_set.take(total_steps):
        global_step += 1
        if tf.equal(global_step % 100, 0):
            tf.print("\rGlobal step", global_step, "/", total_steps)
        with tf.GradientTape() as tape:
            y_pred = model(X_batch)
            main_loss = tf.reduce_mean(loss_fn(y_batch, y_pred))
            loss = tf.add_n([main_loss] + model.losses)
        gradients = tape.gradient(loss, model.trainable_variables)
        optimizer.apply_gradients(zip(gradients, model.trainable_variables))

train(model, 5)
```
