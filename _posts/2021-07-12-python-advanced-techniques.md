---
title: "[Python] Advanced Techniques"
categories: [파이썬]
tags: [python, advanced, techniques]
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

---

# 기술

* 문서 테크닉
* 코딩 테크닉
* 테스팅 테크닉
* Verification 테크닉
* Continuous Integration (CI) 테크닉

## 기술 1

버전관리를 1.1.0 과 같이 minor, subversion, sub-subversion으로 나누어서 관리, minor는 아키텍쳐의 변화가 있거나 코드에서 많은 변화가 있을때, subversion은 major보다 아래, sub-subversion은 bug fixes

git branch로 버전관리, git status를 통해 해당 버전에서 무엇이 수정되었는지

## 기술 2

코드에서 documentation [#](https://www.datacamp.com/community/tutorials/docstrings-python)

```python
@staticmethod
def load_json(photon_package: str) -> Any:
    """
    load_json Loads JSON file.
The class init PipelineElement('name',...)
    stores the element metadata in a json file.
The JSON files are stored in the framework folder
    by the name convention 'photon_<package>.json'.
    (example:$HOME/PROJECTS/photon/photonai/base/registry/PhotonCore.json)
The file is of format
    { name-1: ['import-pkg-class-path-1', class-path-1)],
      name-2: ['import-pkg-class-path-2', class-path-2)],
     ....}
Parameters
    ----------
        photon_package:  The name of the photonai package of element metadata
    Returns
    -------
        [file_content, file_name]
    Notes
    -------
    if  JSON file does not exist, then create blank one.
    """
```

## 기술 3

* 코멘트는 최대한 자세하기 남겨라

## 기술 7

PEP-8 naming conventions을 적용

* global constant는 `ELEMENT_TYPE` uppercase
* variable `machine_learning_type`: lowercase

## 기술 8

* type hitting을 모든 function, class method에 추가
* python 3.5 보다 높은 버전에서는 PEP484의 enable type hints를 허용

```python
def is_maching_learning_type(ml_type: str) -> bool:
```

## 기술 12

코드를 작성하기 전에 다른 코드를 살펴보자. 어떻게 구성되어 있는지!

* Papers with code
  * <https://github.com/paperswithcode>
* Awesome Git
  * <https://github.com/dictcp/awesome-git>
* Awesome lists
  * <https://github.com/sindresorhus/awesome>
* Awesome Machine Learning
  * <https://github.com/josephmisiti/awesome-machine-learning>
* Vision Machine Learning
  * <https://paperswithcode.com/lib/mmdetection>

## 기술 16

encapsulate

```python
@staticmethod
def is_machine_learning_type(ml_type: str) -> bool:
    """
    :raises
    if not known machine_learning_type
:param machine_learning_type
    :return: True
    """
    if ml_type in Scorer.ML_TYPES:
        return True
    else:
        logger.error(
            "Specify valid ml_type to choose best config: {}".format(ml_type)
        )
    raise NameError(becomes
```

## 기술 19

faut handler를 사용해서 stack tracebacks을 표시

## 기술 20

`globals()`를 통해 패키지내의 모든 글로벌들을 확인

## 기술 21

`locals()`를 통해 unused local variablse을 제거

## 기술 22

Python 3.7+ `@dataclass` decorator를 class definition 전에 적용

* 자동으로 생성되는 double dunder methods
  * `__init__()`
  * `__repr__()`
  * `__str__`
  * `__eq()__`
  * `__hash()`

```python
class PhotonRegistry:
    """
    Helper class to manage the PHOTON Element Register
    ...
    """
base_PHOTON_REGISTRIES = ['PhotonCore', 'PhotonNeuro']
PHOTON_REGISTRIES = ['PhotonCore', 'PhotonNeuro']
def __init__(self, custom_elements_folder: str = None):
    if custom_elements_folder:
        self._load_custom_folder(custom_elements_folder)
    else:
        self.custom_elements = None
        self.custom_elements_folder = None
        self.custom_elements_file = None

```

```python
@dataclass
class PhotonRegistry:
    """
    Helper class to manage the PHOTON Element Register
    ...
    """
    custom_elements_folder: str = None
    custom_elements: str = None
    custom_elements_file: str = None
    base_PHOTON_REGISTRIES: ClassVar[List[str]] =/
   ["PhotonCore", "PhotonNeuro"]
    PHOTON_REGISTRIES: ClassVar[List[str]] =/
   ["PhotonCore", "PhotonNeuro"]
def __post_init__(self):
    if self.custom_elements_folder:
        self._load_custom_folder(self.custom_elements_folder)
```

# Testing Techniques

## 기술 23

* pytest를 사용해

## 기술 24

* <https://coverage.readthedocs.io/en/coverage-5.0.4/>

## 기술 25

* integration tests는 모든 외부 (API) functions, classes, class attributes, and class methods를 100%를 커버해야 한다.

## 기술 27, 28, 29 [Testing 관련한](https://betterprogramming.pub/seventeen-coding-tools-for-your-python-developer-sandbox-35d033c3075a)

* Code type hinting checking
* Test coverage
* Performance profiling
* Check security
* Code reliability

# Verification Techniques

## 기술 30 

Code review, Codacy 툴을 이용해 코드 리뷰

* <https://www.codacy.com/>

# DevOps for Your Sandbox

* <https://levelup.gitconnected.com/transform-your-favorite-python-ide-into-a-devops-tool-c087fc4418c9>


## 참고

* https://betterprogramming.pub/thirty-two-advanced-techniques-for-better-python-code-6717226eb611