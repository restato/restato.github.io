---
title: "[Python] M1에서 Could not import the lzma module"
categories: [파이썬]
tags: [python, error, lzma, xa, lima, m1]
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

### 해결방법

```sh
>>> import pandas
UserWarning: Could not import the lzma module. Your installed Python is incomplete. Attempting to use lzma compression will result in a RuntimeError.
  warnings.warn(msg)
```

```sh
brew install xz
brew install readline xz
brew install lima
```

해도 에러가 계속 나고 있어서 찾아보니, M1에서는 아래와 같이 설치

```sh
pyenv uninstall 3.9.4
CFLAGS="-I$(brew --prefix xz)/include" LDFLAGS="-L$(brew --prefix xz)/lib" pyenv install 3.9.4
```

잘 동작한다.

```pythpon
Type "help", "copyright", "credits" or "license" for more information.
>>> import pandas as pd
```

### 참고

* <https://stackoverflow.com/questions/57743230/userwarning-could-not-import-the-lzma-module-your-installed-python-is-incomple>