---
title: "[Jekyll] Chirpy Theme Favicon, Avatar 세팅"
categories: [블로그]
tags: [blog, jekyll, chirpy, theme, favicon, avatar]
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

### Favicon 변경

1. [Favicon-Generator](https://realfavicongenerator.net/)에 접속
2. 이미지 업로드 
3. `Generate your Favicons and HTML code` 해서 다운로드
4. 압축 해제
5. 아래 파일 제거
  * browserconfig.xml
  * site.webmanifest
6. `assets/img/favicons`에 있던 파일을 교체

갑자기 `favicon`이 안보인다... 왜 안보이지...
배포하면 문제없이 동작함, 로컬에서만 이상한가보다

### Avatar 변경

메인에 있는 사진을 변경하기 위해서는

`_config.yaml`을 수정

```yaml
# the avatar on sidebar, support local or CORS resources
avatar: /assets/img/favicons/android-chrome-512x512.png
```

## 참고

* https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_posts/2019-08-11-customize-the-favicon.md