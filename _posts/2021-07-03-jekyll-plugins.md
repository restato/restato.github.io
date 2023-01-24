---
layout: post
title: "[Jekyll] Plugins"
categories: [jekyll]
tags: [jekyll, plugin]
---

### SEO tag 추가

* https://github.com/jekyll/jekyll-seo-tag/blob/master/docs/installation.md
* https://github.com/jekyll/jekyll-seo-tag/blob/master/docs/usage.md

`Gemfile`에 아래와 같이 추가

```
gem 'jekyll-seo-tag'
```

`_config.yaml`에 아래와 같이 추가

```yaml
plugins:
  - jekyll-seo-tag
```

> Jekyll 버전이 `3.5.0` 이하라면 `plugins`대신 `gem`을 사용

`_site/index.html`에 아래 코드를 `</head>` 전에 추가

```js
{% seo %}
```

```
title - The title of the post, page, or document
description - A short description of the page's content
image - URL to an image associated with the post, page, or document (e.g., /assets/page-pic.jpg)
author - Page-, post-, or document-specific author information (see Advanced usage)
locale - Page-, post-, or document-specific locale information. Takes priority over existing front matter attribute lang.
```

## Sitemap

* https://github.com/jekyll/jekyll-sitemap

`Gemfile`에 아래와 같이 추가

```yaml
gem 'jekyll-sitemap'
```

`_config.yaml`에 아래와 같이 추가

```yaml
url: "https://example.com" # the base hostname & protocol for your site
plugins:
  - jekyll-sitemap
```

`https://example.com/sitemap.xml`을 접속해서 `sitemap`이 생성되었는지 확인

## Gist

* https://github.com/jekyll/jekyll-gist

`gist`에 있는 코드를 추가하기 위해서 사용

`Gemfile`에 아래와 같이 추가

```yaml
gem 'jekyll-gist'
```

`_config.yaml`에 아래와 같이 추가

```yaml
plugins:
  - jekyll-gist
```

## Analytics

* (동작안함) ~https://github.com/hendrikschneider/jekyll-analytics~
* (동작안함) ~https://github.com/ap-automator/jekyll-rushed-analytics~
* https://jekyllrb.com/docs/step-by-step/04-layouts/
* https://michaelsoolee.com/google-analytics-jekyll/

`_layouts/default.html`에 아래와 같이 추가

```html
<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <title>{{ page.title }}</title>
    {% include google-analytics.html %}
  </head>
  <body>
    ...
  </body>
</html>
```

`_config.yaml`에 아래와 같이 추가

```yaml
google_analytics: G-XXXXXXX
```

`_includes/google-analytics.html` 추가

```javascript
<script async src="https://www.googletagmanager.com/gtag/js?id={{ site.google_analytics }}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '{{ site.google_analytics }}');
</script>
```

![성공!](/assets/2021-07-03/ga-check.png)