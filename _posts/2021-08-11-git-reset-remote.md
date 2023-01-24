---
title: "[Git] Remote branch로 덮어 씌우는 방법"
categories: [깃]
tags: [git, remote, reset, branch]
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

## Remote Branch로 덮어씌우는 방법

특정 branch에서 작업하고 있다. 다시 remote에 있는 내용으로 덮어씌우고 싶을때

### 방법 1

```sh
git fetch --all 
git branch backup-master # backup

# two options
git reset --hard origin/master
git reset --hard origin/<branch>
```

* `fetch`: remote에 있는 latest 를 다운로드하는데 이때 merge, rebase를 하지 않음
* `reset`: reset은 master branch를 방금 fetched한 것으로 재설정한다
* `--hard`: working tree에 있는 모든 files을 `origin/matser`에 매칭

### 방법 2

```sh
git reset --hard HEAD
git pull
```

## 참고

* https://stackoverflow.com/questions/1125968/how-do-i-force-git-pull-to-overwrite-local-files