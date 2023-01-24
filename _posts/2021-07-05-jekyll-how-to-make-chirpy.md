---
title: "블로그 만들기 (theme: jekyll-theme-chirpy)"
tags: [blog, jekyll, chirpy, theme]
categories: [sandbox]
---

## 들어가며

`jekyll-theme-chirpy`를 설치해보려고 했는데 기본 `jekyll`를 설치하고
`theme`만 `_config.yaml`에서 변경해봤는데 적용이 안되더라

[jekyll-theme-chirpy github](https://github.com/cotes2020/jekyll-theme-chirpy) 에서 fork 해서 바로 설치하는게 다른 디펜던시를 신경쓸 필요가 없다.

## Gihtub 설정

`github`에 `repository`를 생성하는데 이때는 `username`이랑 동일해야 한다.
다르면 사이트가 뜨지 않으니 `github.com/<username>`에서 `username`을 사용하자

```sh
git clone <url>
git add .
git commit -m "Initial commits"
```

## Theme의 프로젝트 설정

위와 같이 커밋을 해서 저장소를 설정하고 `jekyll-theme-chirpy`를 `ROOT`에 넣는다. 이때 `ROOT`에 넣는게 중요하다. 그 이유는 `jekyll-theme-chipry`의 프로젝트에는 `Github Action`이 포함되어 있는데 이 파일이 `ROOT`에 있어야 하기 때문이다.

![프로젝트 루트에 `.github`이 포함되어 있음](/assets/2021-07/jekyll-project-structure.png)

`init.sh`를 수행하면 초기화가 완료되고, 

```sh
git add .
git commit -m "commit"
git push origin master
```

`master`에 push하고 `github`에서 `Action`의 탭을 들어가면 아래와 같이 산규 `Action`이 생긴다.

![Github Action](/assets/2021-07/jekyll-page-deploy.png)
![page-deploy-steps](/assets/2021-07/jekyll-page-deploy-steps.png)
![page-deploy-success](/assets/2021-07/jekyll-page-deploy-success.png)

최초에 페이지를 빌드하는게 생각보다 시간이 오래걸리는데 Ruby 환경을 설정하는데 시간이 걸리기 때문이니 기다리면 완료된다. 대략 5분 정도 기다리면 완료된다. 완료를 확인하기 위해서 새로운 `gh-pages`가 있는지 확인

## github pages 설정

`[Settings] - [Pages]` 에 들어가서 `branch`를 `gh-pages`로 변경하면 끝.
그리고 `https://<username>.github.io`를 들어가면 끝나고 이후에는 포스트 작성 및 내게 필요한 설정을 추가하면 된다.

## `_post`에 글 작성하기

글은 `master` 브랜치에 작성하고 `Actions`을 들어가면 알아서 `gh-pages`에 배포를 해준다. 결론적으로 우리는 `gh-pages`의 브랜치는 신경쓸 필요가 없으며 `master`의 `_post`에 글을 작성하면 된다. 아마도 `jekyll`가 `.md`의 파일을 `.html`로 빌드하기 때문에 빌드한 `.html`의 파일만 `gh-pages`에 생성하는게 아닌가 싶다. `.md`파일은 `master`에서 관리하고~

```sh
git add .
git commit -m "add First post"
git push origin master
```

글을 작성한 이후에 `master`에 `push`하면 아래와 같이 `Actions`이 동작

![post action](/assets/2021-07/jekyll-actions.png)

## tools 이용하기

`chirpy`의 경우 `tools`을 아래와 같이 제공한다

```
bump.sh
deploy.sh
init.sh
run.sh
test.sh
```

* `init.sh`
  * 최초에 프로젝트를 추가한 이후에는 `init.sh`를 수행한다.
  * `init.sh`를 실행하면 불필요한 파일을 제거하고 `github Action`을 추가한다.
* `run.sh`
  * 로컬에서 프로젝트를 실행할때 사용한다.
  * 수행한 뒤에 `localhost:4000`을 들어가보면 사이트가 띄워져 있다.

지금은 `post.sh`를 생성해서 포스트 작성하고  `push`하는 스크립트로 사용하고 있다.
더 좋은 방법이 뭘까 생각하다가... `crontab`을 걸어놔도 괜찮을것 같고, 일단은 꾸준히 작성하는게 중요하니 외적인건 나중에

```sh
# post.sh
git add .
git commit -m "add Posts"
git push origin master
```

## 참고

* https://github.com/cotes2020/jekyll-theme-chirpy