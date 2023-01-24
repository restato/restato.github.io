---
title: "[Bash] Overwrite builtin command (rm, ls, echo)"
categories: [배쉬]
tags: [bash, shell, ovewrite, builtin]
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

### `ls`

```sh
#!/bin/bash
 
# override 'ls' command for 'ls -ltr'
ls () {
    command ls -ltr
}
ls
```

### `date`

```sh
#!/bin/bash
 
# override 'ls' command for 'ls -ltr'
echo () {
    builtin echo -n `date +"[%m-%d %H:%M:%S]"` ": "
    builtin echo $1
}
echo "Maverick Reporting. Over."
```

```sh
function date {
    if [[ $OSTYPE =~ "linux" ]]; then
        command date "$@"
    else
        command gdate "$@"
    fi
}
```

* `brew install coreutils`
* macOS와 linux에서 동작하는 `date`가 다르기 때문에 위와 같이 설정해주면 플랫폼 상관없이 사용이 가능
* date에서 사용하는 파라미터를 넘기기 위해서는 `$@` 를 사용해야 한다