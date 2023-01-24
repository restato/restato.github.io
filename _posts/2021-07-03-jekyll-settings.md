---
title: "나만의 블로그 만들기"
---

### 설치

https://jekyllrb.com/

```sh
sudo gem install bundler jekyll
jekyll new my-awesome-site
cd my-awesome-site
bundle exec jekyll serve
```
gem "jekyll-theme-chirpy"

### Github Page

https://pages.github.com/

```sh
git clone https://github.com/restato/doubly.github.io.git
cd username.github.io
echo "Hello World" > index.html
```

```
git add --all
git commit -m "Initial commit"
git push -u origin main
```

### jekyll를 github pages에 설정

https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll


## Ruby 설치

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

## 환결 설정 추가

```
vi ~/.zshrc
export PATH={$Home}/.rbenv/bin:$PATH && \
eval "$(rbenv init -)"
source ~/.zshrc
```

## Jekyll 추가

```sh
mkdir docs
cd docs
git checkout --orphan gh-pages
jekyll new .
```

## Gemfile 수정

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

## Github 에 적용

```
git add .
git commit -m 'Initial GitHub pages site with Jekyll'
git push origin gh-pages
```

## Github 설정

* `[Settings] -> [Pages] -> [Source]` 에서 Branch를 `gh-pages`로 변경
* 경로에서 `Change theme`을 통해 설정도 가능

### 참고

* https://github.com/cotes2020/jekyll-theme-chirpy
* https://docs.github.com/en/pages/setting-up-a-github-pages-site-with-jekyll
* https://jekyllrb.com/
* https://pages.github.com/