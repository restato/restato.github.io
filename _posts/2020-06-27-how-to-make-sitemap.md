---
title: "gatsby plugin을 통해 advanced sitemap 추가하는 방법"
tags: [gatsby, plugin, sitemap]
image: 
    path: /assets/2020-06/how-to-make-sitemap-after.png
---

사이트맵이란? 우리의 사이트가 어떤 구조로 글이 작성되어 있는지 지도를 보여주는 것으로 이해하면 간단하다. 인터넷상에는 여러개의 봇(bot)들이 돌아다니는데 이 봇들은 사이트를 돌아다니며 어떤 내용을 포함하고 있는지를 수집한다. 이렇게 수집된 사이트들은 이후에 사용자의 검색어를 통해 결과물로서 사용이 된다. 포털(구글 ,네이버, 다음, ..)의 결과물로서 사용되고 싶다면 `sitemap`을 생성하고 등록해야 한다.

[sitemap generator](https://www.xml-sitemaps.com/)를 통해 내 사이트의 호스트를 넘기고 내 사이트의 구조(=sitemap.xml)을 받아올 수 있지만 매번 사이트맵을 만드는것은 노력이 필요하다. gatsby에서는 `plugin`으로 `sitemap`을 자동으로 생성해주고 있다. 좀더 자세하게 sitemap에 대해서 알고 싶다면 [gatsby에서 설명하는 sitemap](https://www.gatsbyjs.org/docs/creating-a-sitemap/)을 참고하자

### gatsby sitemap 적용하기

```shell
npm install gatsby-plugin-sitemap
```

plugin을 `npm`을 통해 설치하고 아래 내용을 `gatsby-config.js`에 추가하자

```js
module.exports = {
  siteMetadata: {
    siteUrl: `https://www.example.com`,
  },
  plugins: [`gatsby-plugin-sitemap`],
}
```

`production`에서 `sitemap.xml`이 생성된다. (=`gatsby build`를 해야지 생김)

> **Note: The siteUrl property must be defined and not left empty.**

![gatsby-plugin-sitemap 의 결과](/assets/2020-06/how-to-make-sitemap-before.png)

`production`에 적용하고 나면 위와 같이 sitemap이 생성된것을 볼수 있다. 생성된 sitemap은 이후에 구글이나, 네이버에 url로 넘겨주면 구글 크롤러와 네이버 크롤러가 나의 사이트의 위치를 저장하고, 결과적으로 검색 결과에 포함된다. (시간에 따라 다르지만 글을 하나씩 수동으로 등록하면 10분정도 소요되지만, 사이트 맵을 제출하고 내 글이 검색 결과에 포함되는 시간은 다음날 보는게 좋다)

### gatsby advanced sitemap 적용

`sitemap`을 그냥(?) 생성하는 것보다 `gatsby-plugin-advanced-sitemap`을 사용하면 좀더 사람이 읽을 수 있는 화면처럼 구성이 되고, sitemap을 SEO 성능에 맞게 자동으로 업데이트되고 완전히 최적화를 할 수 있다고 말한다. 결과적으로 좋은 결과(=클릭)을 얻는다고 한다. 성능은 내가 아직 알수 없고 더 좋다고 하니까 적용해보자

![gatsby-plugin-advanced-sitemap 의 결과](/assets/2020-06/how-to-make-sitemap-after.png)

적용하고 나면 위처럼 `url/sitemap.xml`의 결과가 좀더 사용자가 보기 쉽도록 나타난다.

- 참고
  - https://www.gatsbyjs.org/blog/2019-05-07-advanced-sitemap-plugin-for-seo/
  - https://www.gatsbyjs.org/packages/gatsby-plugin-sitemap/
  - https://github.com/tryghost/gatsby-plugin-advanced-sitemap
  - https://www.gatsbyjs.org/packages/gatsby-plugin-advanced-sitemap/?=sitemap
