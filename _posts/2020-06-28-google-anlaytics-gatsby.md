---
title: "이후 사이트 분석을 위한 Google Analytics를 추가"
tags: [gatsby, blog, google-analytics]
image:
    path: /assets/2020-06/ga-start.png
---

사용자의 반응을 보는게 이만한게 있을까 싶다. 사용자가 **현재** 몇명이 들어왔는지까지 보여주니 대단한 구글...
추가로 사이트에 페이지 방문자 수 측정이 가능하다. [gatsby-plugin-google-analytics-reporter](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics-reporter/)를 참고하면 이후에 `pageView`를 쿼리해서 알아볼수 있다.
이후에는 구글 애널리틱스의 리포트를 활용한 페이지를 한번 구성해보는것도 좋을것 같다. 일단 `v1.0`에서는 구글 애널리틱스만 붙여서 사용자의 반응만 확인하는 목적!

### Google Analytics Gatsby에 추가

[gatsby-plugin-google-analytics](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/?=google%20an)를 추가하기 위해서는 너무 간단해서 설명할것도 없다.
구글 애널리틱스에서 나의 URL을 입력하고, `trackingId`만 발급받고 아래와 같이 `gatsby-config.js`에 추가하면 끝.

> 이때 head `true`를 하지 않으면 google console에 등록할때 verification이 실패

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        // The property ID; the tracking code won't be generated without it
        trackingId: "YOUR_GOOGLE_ANALYTICS_TRACKING_ID",
        // Defines where to place the tracking script - `true` in the head and `false` in the body
        head: false,
        // Setting this parameter is optional
        anonymize: true,
        // Setting this parameter is also optional
        respectDNT: true,
        // Avoids sending pageview hits from custom paths
        exclude: ["/preview/**", "/do-not-track/me/too/"],
        // Delays sending pageview hits on route update (in milliseconds)
        pageTransitionDelay: 0,
        // Enables Google Optimize using your container Id
        optimizeId: "YOUR_GOOGLE_OPTIMIZE_TRACKING_ID",
        // Enables Google Optimize Experiment ID
        experimentId: "YOUR_GOOGLE_EXPERIMENT_ID",
        // Set Variation ID. 0 for original 1,2,3....
        variationId: "YOUR_GOOGLE_OPTIMIZE_VARIATION_ID",
        // Defers execution of google analytics script after page load
        defer: false,
        // Any additional optional fields
        sampleRate: 5,
        siteSpeedSampleRate: 10,
        cookieDomain: "example.com",
      },
    },
  ],
}
```

다음과 같이 추가하고 구글 애널리틱스로 들어가 실시간을 확인하면 실시간 사용자 `1`이라는 표시가 된다. 이제 내 사이트에 얼마나 사람들이 체류하고 방문하는지 확인이 가능하다.

> 만약 1이 아닌 0으로 되어 있다면 현재 모드가 `gatsby develop`이 아닌지 확인이 필요하다. 해당 plugin은 `gatsby build`를 한 이후에 활성화 되니 `gatsby server`를 한 이후에 테스트해보자

- 그 외의 기능
  - [OutBoundLink](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/#outboundlink-component): 내 사이트에서 다른 사이트로의 outbound가 얼마나 있는지 트랙킹 가능
  - [TrackCustomEvent Function](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/#trackcustomevent-function) : `customEvent`에 대해서도 트랙킹이 가능하다. 비즈니스 로직에서 특정 버튼 클릭이 유의미해 트랙킹이 필요
