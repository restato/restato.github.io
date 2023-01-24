---
title: 블로그 만들기
tags: [blog, jekyll]
categories: [sandbox]
---

`Gatsby`에서 `Jekyll`로 블로그를 옮겼는데, 그 이유가 `Gatsby`를 배포하는게 `netlify`를 사용하다가 배포 과정이 번거로워서 어느 순간부터 작성을 안하고 있더라.

그래서 이번에는 나만의 블로그를 어떻게 만드는지에 대해서 과정을 정리해볼까 한다.
`Jekyll`로 `Github page` 만드는 방법이다. 처음에는 쉬운줄 알고 그냥 쉽게 생각했는데
생각보다 삽질을 많이했다. 그래서 이후에도 블로그를 개설할때 이 글을 참고해서 개설할 수 있도록

## 들어가며

`Jeykll`를 `github page`에 추가하는건 어렵지 않다. 하지만 내가 원하는 `Theme`을 지정해서 배포하는건 생각보다 어려웠다. 과정 설명이 너무 친절하지 못하다.

`Jekyll`의 기본 `Theme`으로 설정하는건 그냥 `github page`를 참고하면 되고,
내가 애초에 시작하고 싶은 `Theme`이 있다면 해당 `github`가서 설치하는 방법을 참고하자

## 환경 구성

### Ruby 설치

```sh
# Mac M1의 경우 `jekyll new . ` 시에 에러가 난다.
brew install rbenv ruby-build
rbenv versions
rbenv install -l
rbenv install -list-all
# rbenv install <version>
rbenv install 2.7.3 # 3.0.1, 을 설치할 경우 `jekyll-theme-chirpy`는 디펜던시 문제가 난다.

# rbenv 버전 설정
rbenv global 2.7.3
rbenv rehash
```

* 환결 설정 추가

```sh
vi ~/.zshrc
export PATH={$Home}/.rbenv/bin:$PATH && \
eval "$(rbenv init -)"
source ~/.zshrc
```

### Jekyll 설치

https://jekyllrb.com/

```sh
sudo gem install bundler jekyll
jekyll new my-awesome-site
cd my-awesome-site
bundle exec jekyll serve
```

여기까지 설치가 완료. 
`bundle exec jekyll serve`를 하면 `localhost:4000`으로 접속하면
현재 구성된 블로그 페이지 확인이 가능하다.

## Github Page에 배포하기

### Github Page 설정

https://pages.github.com/
https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll

```sh
git clone https://github.com/restato/restato.github.io.git
cd username.github.io
echo "Hello World" > index.html
```

```
git add --all
git commit -m "Initial commit"
git push -u origin main
```

### Jekyll 추가

`ROOT`에서 `docs`를 생성하고 해당 폴더에 `jekyll`를 생성한다.

> 기존에 생성했던 `jekyll`가 있다면  `docs/`하위에 이동

```sh
mkdir docs
cd docs
git checkout --orphan gh-pages
jekyll new .
```

### Gemfile 수정

```
vi Gemfile
# gem "jekyll" 앞에 # 으로 주석처리
# gem "github-pages" 를 아래와 같이 수정
gem "github-pages", "~> GITHUB-PAGES-VERSION", group: :jekyll_plugins
```

`GITHUB-PAGES-VERSION`은 아래 참고 현재는 `215`
https://pages.github.com/versions/

```
# Happy Jekylling!
# gem "jekyll", "~> 4.2.0"
# This is the default theme for new Jekyll sites. You may change this to anything you like.
gem "minima", "~> 2.5"
# If you want to use GitHub Pages, remove the "gem "jekyll"" above and
# uncomment the line below. To upgrade, run `bundle update github-pages`.
# gem "github-pages", group: :jekyll_plugins
gem "github-pages", "~> 215", group: :jekyll_plugins
```

`Gemfile` 저장한 이후에 

```sh
bundle update
```

(선택) `_config.yaml`에 아래와 같이 추가 (하위 디렉토리에서 호스팅될때만, 보통은 추가할 필요 없음)


```sh
domain: my-site.github.io       # if you want to force HTTPS, specify the domain without the http at the start, e.g. example.com
url: https://my-site.github.io  # the base hostname and protocol for your site, e.g. http://example.com
baseurl: /REPOSITORY-NAME/      # place folder name if the site is served in a subfolder   
```

### Github 에 배포

```
git add .
git commit -m 'Initial GitHub pages site with Jekyll'
git push origin gh-pages
```

### Github 설정

* `[Settings] -> [Pages] -> [Source]` 에서 Branch를 `gh-pages`로 변경
* 경로에서 `Change theme`을 통해 설정도 가능

## 참고

* https://github.com/cotes2020/jekyll-theme-chirpy
* https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll
* https://jekyllrb.com/
* https://pages.github.com/