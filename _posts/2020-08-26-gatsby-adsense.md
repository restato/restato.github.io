---
title: "Gatsby에 Google Adsense를 추가하는 방법 (Netlify add snippet을 선택)"
tags: [gatsby, google adsense, advertisement]
categories: [gatsby]
coverImage: /assets/2020-08/add-google-adsense.png
---

[gatsby-plugin-google-adsense](https://www.gatsbyjs.com/plugins/gatsby-plugin-google-adsense/)

# 설치

```
npm install --save gatsby-plugin-google-adsense
```

# 사용하는 방법

```
// In your gatsby-config.js file
plugins: [
    {
      resolve: `gatsby-plugin-google-adsense`,
      options: {
        publisherId: `ca-pub-xxxxxxxxxx`
      },
    },
]
```

# 애드센스에 사이트 연결

1. 애드센스 계정을 생성하고 사이트 추가
2. 애드센스 코드를 발급 (해당 코드를 붙여넣으라고 하는데 어디에 붙여야 하는거지)

```html
<script
  data-ad-client="ca-pub-53xxxxxx73"
  async
  src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"
></script>
```

현재 deploy를 netlify를 사용하고 있기 때문에

[stackoverflow](https://stackoverflow.com/questions/54294345/how-to-add-adsense-to-a-website-built-with-gatsbyjs)를 보면 아래와 같이 추가 하면 된다. 그 방법 외에는 [gastby에 추가하는 방법](https://malloc.fi/google-adsense-with-gatsby-js)

```
settings -> build & deploy -> post processing -> snippet injection -> add snippet
```

![netlify add snippet](/assets/2020-08/netlify-add-snippet.png)

추가할때 `</head>` 전에 추가하도록 설정하면 된다. 이 방법의 장점은 별도의 배포 없이 바로 사이트 등록이 가능하다는 점!

![추가한 결과](/assets/2020-08/add-google-adsense.png)

추가하고 제출하면 사이트의 광고 게재 가능 여부를 검토해서 안내해준다.
이후에 승인되면 사이트에 어떻게 추가하는지에 대해서 찾아볼 예정

https://support.google.com/adsense/answer/9261307?hl=en&visit_id=637340240610901873-475359289&rd=1
