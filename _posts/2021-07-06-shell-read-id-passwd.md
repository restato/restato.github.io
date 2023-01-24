---
title: "[Shell] 값 입력하는 방법 (id/passwd)"
categories: [쉘]
tags: [shell, read, id, passwd]
---

```sh
echo "--- Github Login: ----" 
echo -n "Username:" && read GIT_USERNAME
echo -n "Password:" && read -s GIT_PASSWORD
```

`PASSWORD`와 같이 입력하는 값이 보이지 않기 위해서는 `-s` 옵션을 사용