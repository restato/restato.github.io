---
title: "[Python] M1에서 파이썬 패키지 설치 오류 및 설치 방법" 
categories: [파이썬]
tags: [python, pyarrow, m1, numpy, streamlit]
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

M1이 아직 개발하는데 장애물이 있구나 M1이 아니라면 문제 없을 것을... 장비 욕심에..
`numpy`와 같은 패키지도 M1 에서 `pip`로 설치할때 에러가 발생하고 있었다.

* <https://github.com/numpy/numpy/issues/17807>
* <https://github.com/numpy/numpy/issues/17784>
* <https://github.com/streamlit/streamlit/issues/2356>

## OPENBLAS

```sh
brew install openblas
OPENBLAS="$(brew --prefix openblas)" pip install numpy
OPENBLAS="$(brew --prefix openblas)" pip install streamlit
OPENBLAS="$(brew --prefix openblas)" pip install pyarrow
```

### OPENBLAS로 아래와 같이 에러

`OPENBLAS`로 실패함

```sh
  ERROR: Failed building wheel for pyarrow
Successfully built pandas pyrsistent pyzmq argon2-cffi
Failed to build pyarrow
ERROR: Could not build wheels for pyarrow which use PEP 517 and cannot be installed directly
```

## `--no-binary :all:`, `--no-use-pep517`

만약 위 방법으로 동작하지 않으면 아래 방법으로 시도

<https://github.com/streamlit/streamlit/issues/2356#issuecomment-739455412>

```sh
pip3 install . --no-binary :all: --no-use-pep517
pip3 install pyarrow --no-binary :all: --no-use-pep517
```

## Anaconda로 설치 (최종으로 성공)

이것만은.. 싫었지만 일단 개발을 하는게 중요하니까

```sh
brew install anaconda
# 설치하고 PATH를 별도 지정하는게 좋다 (전역으로 anaconda의 파이썬을 사용하기 보다는)
# 설치한 경로의 PATH를 VS Code에 추가해서 사용 (프로젝트에서만 사용되도록)
# 실제로 M1에 설치하면 아래 경로에 설치 안됨 Anaconda.NAVIGATOR 실행해서 추가로 환경을 추가 가능 (dev로 추가)
# source /opt/homebrew/anaconda3/envs/dev/bin/activate (보통은 이렇게 하는데)
# . /opt/homebrew/anaconda3/bin/activate && conda activate /opt/homebrew/anaconda3/envs/dev; 
# . /opt/homebrew/anaconda3/bin/activate && conda activate /opt/homebrew/anaconda3/envs/dev;  python -i # 인터프리터 시작
pip install streamlit 
streamlit hello
```

## Docker 사용

위 방법도 실패한다? 그럼 docker에서 하는 사람도 있더라

<https://github.com/jroes/streamlit-getting-started-m1>