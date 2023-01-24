---
title: "[Bash] String 포함되었는지 확인하는 방법"
categories: [배쉬]
tags: [bash, shell, string, include]
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

```sh
string='My string';

if [[ $string =~ "My" ]]; then
   echo "It's there!"
fi
```