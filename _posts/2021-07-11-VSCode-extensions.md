---
title: "VS Code Extentions"
categories: [개발환경]
tags: [ide, vscode, dev-env, vscode, extention]
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

### Python Docstring Generator

* 코드 작성한 이후에 문서 작성할때 템플릿 형태로 제공 (기본값은 구글포맷)
* `[cmd] + [shift] + p` -> `Generate Docstring`

```python
def func(key=1):
    """[summary]

    Args:
        key (int, optional): [description]. Defaults to 1.

    Returns:
        [type]: [description]
    """    
    (...)
```

### Magic Python

* `cutting-edge technology`라고 설명함...
* 코드에서 사용하지 않는 변수는 회색으로 표시 해줘서 좋음, 아직 다른 장점은 찾지 못함

### [Kite](https://www.kite.com/)

* `M1`이여서 사용하지 못함 - `2021-07-11`기준
* 문서를 자동으로 만들어줘서 내가 사용하는 함수의 파라미터, 함수, 사용법을 확인 가능
* VS Code의 `Extention`이라고 하기 보다는 하나의 별도의 앱을 맥에 설치하는 방식
  * Editor Plugins을 설치해서 `VSCode`, `Sublime Text` 등 에서 사용가능
* 자동으로 코드 completion을 해준다고 한다.
