---
title: "[Zeppelin] Notebook Level Dynamic Form (=Global Variable)"
categories: [제플린]
tags: [zeppelin, notebook, dynamic, form, global, variable]
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

zeppeline에서 세별로 변수를 지정해서 사용하고 있는데,
매번 셀마나 지정하면 모든 셀의 변수를 변경해야 하는 어려움이 있었음.
그래서 notebook level의 dynamic form이 없는지 찾아보니 있네?

아래와 같이 변수 초기화 해주면 노트 맨위에 변수 변경이 가능한 폼이 나옴
노트에서 정의한 전역변수는 `$$`를 통해 정의후 sql, python에서 모두 사용 가능

`_` underscore를 사용할때 `$$`를 함께 쓰면 사라지는 버그?가 잇는건지
`_$${var1}`이 아닌 `__$${var1}`로 사용해야 한다.

### 전역 변수 정의

```md
$${var1=A}
$${var2=A}
```

### 변수 사용 (md, hive)

```md
* 변수 1: $${var1}
* 변수 2: $${var2}
```

### 변수 사용 (python, spark)

```python
print{z.noteTextBox('var1')})
```

* 참고
  * https://issues.apache.org/jira/browse/ZEPPELIN-1363v
  * https://github.com/apache/zeppelin/pull/2641