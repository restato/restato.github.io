---
title: "[Python] Advanced Technique Python (2)"
categories: [파이썬]
tags: [python, advanced, technique]
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

## Intro

* `import`를 통해 코드를 포함시킬때 효과적으로 구조화하는게 필요
* `import`를 적절하게 사용하면 생산성이 향상되어 프로젝트 유지관리 하면서 코드 재사용이 가능
* `import`가 어떻게 동작하는지 코드로 이해
* 배우는 내용
  * module, packages, namespace packages
  * handle resources and data file inside your package
  * cutomize python's import system
* python은 `module`과 `packages`로 이루어져 있음
  * <https://realpython.com/python-modules-packages/>
    * module, package의 차이 어떻게 작업할 수 있는지 설명
 
## Modules

* Python 코드의 Unit 역할을 하는 object
* module에는 arbitrary Python Object를 포함하는 namespace가 있음
* `import`를 통해 추가

```python
import math # math module
math.pi # variable

# contents of a namespace
dir() 
dir(math)

from math import pi
pi # global namespace 에 배치

import math as m # rename moudule
m.pi
```

## Packages

* package를 사용하여 moudle을 추가로 구성할수 있다.
* submodule 또는 recursively sub packages를 포함할수 있는 Python 모듈
* 기술적으로 `__path__` 속성이 있는 파이썬 모듈
* 일반적으로 python file 및 기타 directory를 포함하는 file directory에 해당
* 파이썬 패키지를 직접 만들려면 directory와 그 안에 `__init__.py`를 만들어야 한다.
* `__init__.py` 파일은 모듈로 취급될 때 패키지의 내용을 포함한다.
  * `__init__.py`가 없으면 일반 패키지가 아니라 namespace packages
* 일반적으로 패키지를 가져올 때 하위 모듈 및 하위 패키지를 가져오지 않는다. 그러나 원하는 경우 `__init__.py`를 사용하여 일부 또는 모든 하위 모듈 및 하위 패키지를 포함 할 수 있다.  

```
world/
│
├── africa/
│   ├── __init__.py
│   └── zimbabwe.py
│
├── europe/
│   ├── __init__.py
│   ├── greece.py
│   ├── norway.py
│   └── spain.py
│
└── __init__.py
```

```python
# world/africa/__init__.py  (Empty file)
# zimbabwe를 import하지 않음

# world/africa/zimbabwe.py
print("Shona: Mhoroyi vhanu vese")
print("Ndebele: Sabona mhlaba")

# world/europe/__init__.py
# greece, norway는 import를 했지만 spain은 import하지 않음
from . import greece
from . import norway

# world/europe/greece.py
print("Greek: Γειά σας Κόσμε")

# world/europe/norway.py
print("Norwegian: Hei verden")

# world/europe/spain.py
print("Castellano: Hola mundo")

# world/__init__.py
from . import africa # europe은 import하지 않음
```

* 위 코드에서 각 `country`의 모듈은 import 될때 `print()`를 수행

```python
import world
world
world.africa
world.europe # world/__init__.py에 europe은 import하지 않았기 때문에 AttributeError가 발생

from world import europe # 하는 순간 eurpoe/__init__.py 에 포함된 greece, norway print문이 출력됨
europe.spain # AttributeError # europe/__init_-.py에 spain은 import하지 않음

import world.europe.spain # spain을 사용하기 위해서는 import하는 순간 print()가 실행
from world.europe import normway # 출력하지 않고 global namespace에 포함
```

* `world/africa/__init__.py`의 파일내부가 비어있기 때문에 `world.africa`를 import하면 다른 효과는 없이 `namespace`가 생성

```python
world.africa.zimbabwe # Attribute Error
from world.africa import zimbabwe # zimbabwe가 global namespace에 추가되면서 `print`
world.africa.zimbabwe # 로도 접근이 가능
```

* 모듈을 가져오면 내용이 로드되고 내용이 포함된 namespace가 생성된다는 점을 기억해야 한다.
* 동일한 모듈이 다른 namespace의 일부가 될 수 있음을 보여주는 예

```python
import math
math.__dict__['pi'] # module namespace는 python dict으로 구현되며 `.__dict__` attribute에서 사용 가능
# global namespace도 dictionary, `global()`로 접근 가능
```

* 사용자들이 더 쉽게 사용할 수 있도록 `__init__.py` 파일에 하위 패키지와 하위 모듈을 가져오는게 일반적
  * [requests/__init__.py](https://github.com/psf/requests/blob/v2.23.0/requests/__init__.py#L112)
  * [requests library](https://realpython.com/python-requests/)

## [Absolute and Relative Import](https://realpython.com/absolute-vs-relative-python-imports/)

* `world/__init__.py`에서 `from . import africa` 
  * `from .`의 의미는?  `.(dot)`은 현재 패키지를 가리키며 relative import의 예
  * "현재 패키지에서 subpackage africa를 import 해라" 를 의미
* `from world import africa`와 같이 absolute import도 가능하다.
* `PEP 8 style guide` 에서는 일반적으로 absolute import를 권장
* relative import는 패키지 hierarchies 구조를 구성하는 대안a

## Python's Import Path

* python에서는 modules과 packges를 어떻게 찾아서 import를 할까?
* `import path`에서 모듈과 패키지를 찾는다.
  * import하기 위한 modules을 검색하는 location의 리스트를 나타냄
* `sys.path`를 printing하여 Python의 `import list`를 inspect 할 수 있음
* `import list`에는 아래와 같이 세가지 종류의 위치가 포함
  * 현재 스크립트의 directory
  * `PYTHONPATH` envrionment variable의 contents
  * Other, installation-dependent directories
* 위 순서에서 첫번째로 매칭되는 module을 사용
* `shadow`를 조심해야 하는데, 현재 프로젝트에서 `math`의 모듈을 만들면 standard lib `math`를 사용할 수 없음 (덮어씌워짐)
  * 모듈, pakcage이름을 잘지어야해 (unique하게)

## Example: Structure Your Imports

* `PYTHONPATH` 및 `sys.path`를 조작해서 import를 구성하는 것이 가능하지만 오류가 발생하기 쉽다

```
structure/
│
├── files.py # libraray module의 역할
└── structure.py # main
```

```python
# structure/files.py

def unique_path(directory, name_pattern):
    """Find a path name that does not already exist"""
    counter = 0
    while True:
        counter += 1
        path = directory / name_pattern.format(counter)
        if not path.exists():
            return path

def add_empty_file(path):
    """Create an empty file at the given path"""
    print(f"Create file: {path}")
    path.parent.mkdir(parents=True, exist_ok=True)
    path.touch()

# structure/structure.py

# Standard library imports
import pathlib
import sys

# Local imports
import files

def main():
    # Read path from command line (=root path)
    try:
        root = pathlib.Path(sys.argv[1]).resolve()
    except IndexError:
        print("Need one argument: the root of the original file tree")
        raise SystemExit()

    # Re-create the file structure
    new_root = files.unique_path(pathlib.Path.cwd(), "{:03d}")
    for path in root.rglob("*"):
        if path.is_file() and new_root not in path.parents:
            rel_path = path.relative_to(root)
            files.add_empty_file(new_root / rel_path)

if __name__ == "__main__":
    main()
```

* `pathlib`을 사용하면 유용하다고 함
  * <https://realpython.com/python-pathlib/>
* `import files`가 가능한 이유는 Python에서 `import path`에는 항상 현재 directory 내에 있는 스크립트가 포함되어 있기 때문에 추가가 가능
  * 다른 프로젝트에서 사용하기 위해서는 <https://realpython.com/pyinstaller-python/> 를 참고

```
structure/
│
├── structure/
│   ├── files.py
│   └── structure.py
│
└── cli.py
```

* `entrypoint`를 생성 <https://realpython.com/pyinstaller-python/#preparing-your-project>

```python
# cli.py

from structure.structure import main

if __name__ == "__main__":
    main()

# $ python cli.py structure # ModuleNotFoundError: no module named 'files'
```

* 현재 스크립트를 실행하는 위치가 변경되었기 때문에 문제가 발생 (=`import path`가 변경)

```python
# Local imports -.-? 이렇게?` no
sys.path.insert(0, str(pathlib.Path(__file__).parent))
import files

# relative import를 사용해서 해결
# Local imports
from . import files
# $ python cli.py structure
# $ python structure.py . <--불가능해짐
```

* relative imports가 가져온 모듈과 스크립트에서 다르게 해석되기 때문에 발생한 문제
* absolute import를 통해 해결이 가능하지만 복잡
* 실제로 더 좋고 안정적적으로 하기 위해서는 import, packaing system과 함께 사용하고 pip를 사용하여 프로젝트를 로컬 패키지로 설치하는 것이다.

## Create and Install a Local Package

* https:/pypi.org/
* `setup.cfg`, `setup.py`의 파일을 생성

```python
# setup.cfg

[metadata]
name = local_structure
version = 0.1.0

[options]
packages = structure # 소스 코드가 포함된 디렉토리를 나열

# setup.py

import setuptools

setuptools.setup()
```

```sh
python -m pip install -e .
```

* 위와 같은 방법으로 로컬 패키지를 설치 할수 있음
* python의 `import path` 에서 `structure`를 찾을 수 있다.
* 즉, 스크립트 디렉토리, relative imports, 또한 기타 복잡한 문제에 대해 걱정할 필요 없이 어디서나 사용이 가능
* `-e` 옵션은 편집 가능함을 나타내고, 패키지를 다시 설치하지 않고도 패키지의 소스 코드를 변경할 수 있도록 해주기 때문에 중요
* publishing 할때는 <https://realpython.com/pypi-publish-python-package/> 를 참고
* `sturcture`가 설치된 이후에는 아래와 같이 `import`

```python
# Local imports
from structure import files
```

> Tip: Script와 Library를 구분해라 (Script는 실행, Library는 imported)

## Namespace Packages

* `python 3.3`부터 사용할수 있음
* 기본 hierarchy에 덜 의존적이다.
* 네임스페이스 패키지는 여러 디렉토리에 분할될 수 있다.
* `.py`의 파일은 있고 `__init.py__`는 포함하지 않은 디렉토리가 있다면 namespace package가 자동으로 생성
* namespace package가 왜 필요한지? 유용한지?
  * <https://realpython.com/factory-method-python/> 참고

```python
>>> song = Song(song_id="1", title="The Same River", artist="Riverside")
>>> song.serialize()
'{"id": "1", "title": "The Same River", "artist": "Riverside"}'
```

```
third_party/
│
└── serializers/
    ├── json.py
    └── xml.py
```

```python
# third_party/serializers/json.py

import json

class JsonSerializer:
    def __init__(self):
        self._current_object = None

    def start_object(self, object_name, object_id):
        self._current_object = dict(id=object_id)

    def add_property(self, name, value):
        self._current_object[name] = value

    def __str__(self):
        return json.dumps(self._current_object)

# third_party/serializers/xml.py

import xml.etree.ElementTree as et

class XmlSerializer:
    def __init__(self):
        self._element = None

    def start_object(self, object_name, object_id):
        self._element = et.Element(object_name, attrib={"id": object_id})

    def add_property(self, name, value):
        prop = et.SubElement(self._element, name)
        prop.text = value

    def __str__(self):
        return et.tostring(self._element, encoding="unicode")

# song.py

class Song:
    def __init__(self, song_id, title, artist):
        self.song_id = song_id
        self.title = title
        self.artist = artist

    def serialize(self, serializer):
        serializer.start_object("song", self.song_id)
        serializer.add_property("title", self.title)
        serializer.add_property("artist", self.artist)

        return str(serializer)
```

* third-party serializers packages가 설치되어 있다면 아래와 같이 사용

```python
>>> from serializers.json import JsonSerializer
>>> from serializers.xml import XmlSerializer
>>> from song import Song
>>> song = Song(song_id="1", title="The Same River", artist="Riverside")

>>> song.serialize(JsonSerializer())
'{"id": "1", "title": "The Same River", "artist": "Riverside"}'

>>> song.serialize(XmlSerializer())
'<song id="1"><title>The Same River</title><artist>Riverside</artist></song>'
```

* `third-part` lib에 `Yaml`의 Serializer가 없는경우 namepsace package의 magic~
* 나만의 `YamlSerializer`를 third-party lib을 건들지 않고 추가가 가능하다.
* `serializers`의 디렉토리를 생성

```
local/
│
└── serializers/
    └── yaml.py
$ python -m pip install PyYAML
```

```python
# local/serializers/yaml.py

import yaml
from serializers.json import JsonSerializer

class YamlSerializer(JsonSerializer):
    def __str__(self):
        return yaml.dump(self._current_object)

>>> from serializers.yaml import YamlSerializer
>>> song.serialize(YamlSerializer())
"artist: Riverside\nid: '1'\ntitle: The Same River\n"
```

* `third-party` 패키지와 `local-package`를 어떻게 합치는지 테스트를 해봤다.
* 아래와 같이 `path`를 확인해보면 다르게 나온다.

```python
import sys
sys.path.extend(["third_party", "local"])

from serializers import json, xml, yaml
json
<module 'serializers.json' from 'third_party/serializers/json.py'>

yaml
<module 'serializers.yaml' from 'local/serializers/yaml.py'>
```

## Imports Style Guide

* `PEP8`의 파이썬 스타일 가이드를 보면
  * <https://www.python.org/dev/peps/pep-0008/#imports>
  * import 는 상위에
  * import는 line을 분리해서 작성
  * imports를 그룹으로 구성 (표준라이브러리 > third-party -> local)
  * order alphabetically within each group
  * prefer absolute imports over relative imports
  * avoid wildcard imports
* 위 가이드를 매번 고려할 수 없으니 강제로 imports 스타일을 맞추자
  * <https://pypi.org/project/isort/>
  * <https://pypi.org/project/reorder-python-imports/>

## 마무리

* 여기까지 너무길다 뒤에는 Resource 관련된 내용이니 나중에
* <https://realpython.com/python-import/#resource-imports> 이어보기

## 참고

* <https://realpython.com/python-import/#basic-python-import>