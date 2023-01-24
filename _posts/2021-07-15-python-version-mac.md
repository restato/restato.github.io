---
title: "[Python] 파이썬 버전 설치 및 변경"
categories: [파이썬]
tags: [python, version, installation]
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

## `pyenv` 사용하는 방법 (추천)

https://apple.stackexchange.com/questions/237430/how-to-install-specific-version-of-python-on-os-x

```sh
brew install pyenv
pyenv install 3.9.6
pyenv virtualenv 3.9.6 venv
pyenv local venv

Note that you must update PATH to override the default Python version:
PATH="~/.pyenv/versions/3.5.0/bin:${PATH}"
pyenv versions
```

> M1의 경우 에러가 나는데 이때는 아래와 같이 HomeBrew를 다시 재설치
> Unexpected output of 'arch' on OSX (using Mac M1 installing elastic beans)

```sh
arch -x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

https://stackoverflow.com/questions/65457674/unexpected-output-of-arch-on-osx-using-mac-m1-installing-elastic-beans

> python -V # 해도 버전이 변경되지 않았음. 아래와 같이 ~/.zprofile or ~/.zshrc 에 추가하니 문제 해결

```shell
# --path로 입력해야 한다. --가 아님
echo 'eval "$(pyenv init --path)"' >> ~/.zprofile
```

> M1의 경우 UserWarning: Could not import the lzma module. Your installed Python is incomplete. Attempting to use lzma compression will result in a RuntimeError.
  warnings.warn(msg)

```sh
CFLAGS="-I$(brew --prefix xz)/include" LDFLAGS="-L$(brew --prefix xz)/lib" pyenv install 3.9.4
```

## `brew` 사용하는 방법

```sh
brew install python
# brew install python@<version>
brew install python@3.7
echo 'export PATH="/usr/local/opt/python@3.7/bin:$PATH"' >> ~/.zshrc
```

## 현재 버전 확인 및 강제로 변경

https://dev.to/malwarebo/how-to-set-python3-as-a-default-python-version-on-mac-4jjf

```sh
# 여러 버전을 사용해야 하는 경우에는 추천 안함
ls -l /usr/local/bin/python*
ln -s -f /usr/local/bin/python3.7 /usr/local/bin/python
python --version
```
