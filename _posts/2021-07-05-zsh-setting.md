---
title: iterm + zsh 설정
tags: [zsh, iterm2, color, text, dev, environment, terminal]
categories: [개발환경]
---

`zsh`은 `mac`에서 기본 `shell`인데 `plugin`도 설치하고 하면 좀더 컬러풀하고 기능 사용이 가능하니 세팅하고
이후에 바로 사용해보자

## OhMyZsh을 설치

```
sh -c "$(curl -fsSL https://raw.github.com/robbyrussell/oh-my-zsh/master/tools/install.sh)"
```

설치하고 `~/.zshrc`를 한번 들여다보자

```
ZSH_THEME="agnoster"
```

폰트가 깨지니까

https://github.com/naver/d2codingfont 에서 다운로드 하고

`D2Coding`으로 `Text`를 변경

> [Profile] - [Text]

## iTerm Color Preset

```sh
git clone https://github.com/mbadolato/iTerm2-Color-Schemes.git
tools/import-scheme.sh schemes/*
```

> [Profile] - [Color] 에서 `schemes/*`의 값을 import하고 원하는 color scheme을 선택

## 디바이스/사용자명 지우기

`~/.zshrc`의 마지막에 아래와 같이 추가

{% raw %}
```sh
prompt_context() {
  if [[ "$USER" != "$DEFAULT_USER" || -n "$SSH_CLIENT" ]]; then
    prompt_segment black default "%(!.%{%F{yellow}%}.)$USER"
  fi
}
```
{% endraw %}

이름을 지우고 싶으면 `$USER`을 제거

## Visual Studio Code 에 적용

Terminal에도 적용하고 싶다면 아래 설정으로 들어가서

> [Preference] - [Settings]

* Font에 `D2Coding` 추가
* `terminal`을 검색해서 `[Terminal > Integrated: Default Profile: Osx`에 `zsh`로 설정