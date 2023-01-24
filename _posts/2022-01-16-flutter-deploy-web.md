---
title: "[Flutter] Deploy netlify"
categories: [flutter]
tags: [flutter, netlify]
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
flutter build web
```

`build/web`에 결과가 나오고, 결과 파일을 netlify에 업로드해도 가능

### github action을 활용

* github token 발급
* netlify auth token, site id
* github settings에 sercrets 추가
* `.github/workflow/deploy.yml` 작성 (프로젝트 ROOT에 작성)
  * `run cd frontend; flutter config --enable-web; flutter build web`

```yml
# .github/workflows/netlify.yml
name: Build and Deploy to Netlify
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-18.04
    steps:
      - uses: actions/checkout@v2
      - uses: subosito/flutter-action@v1
        with:
          channel: beta
      - run: cd frontend; flutter config --enable-web; flutter build web --web-renderer html --release

      - name: Deploy to Netlify
        uses: nwtgck/actions-netlify@v1.2
        with:
          publish-dir: './frontend/build/web'
          production-branch: main
          github-token: ${{ secrets.MY_GITHUB_SECRET }}
          deploy-message: "Deploy from GitHub Actions"
          enable-pull-request-comment: false
          enable-commit-comment: true
          overwrites-pull-request-comment: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
        timeout-minutes: 1

```

### 참고

* <https://github.com/nwtgck/actions-netlify>
* <https://github.com/marketplace/actions/netlify-actions>
* <https://dev.to/agustinustheo/automating-flutter-web-deployments-to-netlify-using-github-actions-2g71>