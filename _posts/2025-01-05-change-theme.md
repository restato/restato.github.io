---
title: Jekyll 블로그 테마 변경
categories: [blog]
tags: [jekyll]
mermaid: true
math: true
comments: true
toc: true
toc_label: Table of Contents
toc_icon: star
toc_sticky: true
# header:
#   image: /assets/images/350x250.png
---

* [Jekyll 설치](https://jekyllrb.com/docs/installation/macos/)
* [minimal-mistakes github](https://github.com/mmistakes/minimal-mistakes?tab=readme-ov-file)
* [사용 가이드](https://mmistakes.github.io/minimal-mistakes/docs/quick-start-guide/)

작성하는 방법은 [Michael Rose의 포스트](https://mmistakes.github.io/minimal-mistakes/year-archive/)들을 참고하자, 아래 처럼 평소에 듣던/보던 링크들 넣어놔도 좋을듯

```
{% raw %}
{% include video id="212731897" provider="vimeo" %}
{% include video id="m28k8OGpL14" provider="youtube" %}
{% endraw %}
```

{% include video id="212731897" provider="vimeo" %}
{% include video id="m28k8OGpL14" provider="youtube" %}


```
![image-right](/assets/images/filename.jpg){: .align-right}
![image-right](/assets/images/filename.jpg){: .align-left}
![image-right](/assets/images/filename.jpg){: .align-center}
![image-name](image-url){: width="400" height="200"}
<figure class="align-left" style="width: 300px">
  <img src="https://mmistakes.github.io/minimal-mistakes/assets/images/image-alignment-150x150.jpg" alt="">
  <figcaption>left align</figcaption>
</figure>
```