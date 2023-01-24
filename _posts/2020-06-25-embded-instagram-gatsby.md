---
title: markdown에 instagram 추가 하는 방법
tags: [gatsby, instagram, blog, markdown]
image:
    path: /assets/2020-06/after.png
---

`markdown`에 인스타그램에 업로드한 사진 가져와 표시하고 싶다. 매번 인스타그램에 사진을 올리고, 올린 사진을 블로그에 다시 올리는 작업을 하다보니 언제부턴가는 둘중에 하나도 아닌 두개를 다 안하고 있더라.. 디스크 용량만 차지하는 사진들을 인스타에만 업로드하고 인스타에 업로드한 사진을 간단한 방법으로 `markdown`에 표시해보자

물론... `markdown`에 인스타그램을 표시하는 방법은 매우 다양하고 이미 플러그인으로 제공을 하고 있지만, 약간의 삽질이 있었으니 그 삽질한 내용을 공유하고 최종으로 어떻게 간단하게 적용하였는지 정리하였다.

- gatsby plugin related to instagram
  - https://www.gatsbyjs.org/packages/gatsby-remark-embedder/?=instagram#instagram
  - https://github.com/MichaelDeBoey/gatsby-plugin-instagram-embed

위 `gatsby-plugin`을 설치해서 instagram을 내장시키려고 했으나 정상적으로 동작하지 않았다. 해결 방법을 보기 위해서는 아래 최종 해결 방법을 참고하자

![인스타그램에서 담기를 누르면 표시되는 화면](/assets/2020-06/embed.png)

```js
<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/CBVlsG8AcB7/?utm_source=ig_embed&amp;utm_campaign=loading" data-instgrm-version="12" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);

....

"<div style=" display:x; text-align:center; text-overflow:ellipsis; white-space:nowrap;"><a href="https://www.instagram.com/doubly8f/?utm_source=ig_embed&amp;utm_campaign=loading" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> doubly8f</a>(@doubly8f)님의 공유 게시물님, <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2020-06-12T13:50:15+00:00">2020 6월 12 6:50오전 PDT</time></p></div></blockquote> <script async src="//www.instagram.com/embed.js"></script>
```

위 방법을 통해 복사해서 붙여넣으면 아래와 같이 `View this post on Instagram` or `Instagram에서 이 게시물 보기`라고 화면에 표시가 된다.

![게시물의 사진이 보이지 않음](/assets/2020-06/before.png)

### 해결 방법

구글에서 검색해보니 위 문제를 해결하기 위해 `iframe`을 사용하면 문제가 해결된다고 해서 사용해보니 아래와 같이 문제 없이 잘 동작했다.

```js
<code>
  <iframe
    id="instagram-embed-0"
    class="instagram-media instagram-media-rendered"
    style="background: white; max-width: 658px; width: calc(100% - 2px); border-radius: 3px; border: 1px solid #dbdbdb; box-shadow: none; display: block; margin: 0px 0px 12px; min-width: 326px; padding: 0px;"
    src="https://www.instagram.com/p/CBVlsG8AcB7/embed?utm_source=ig_embedembed/captioned/"
    scrolling="no"
    data-instgrm-payload-id="instagram-media-payload-0"
    height="750"
    frameborder="0"
  >
    <span
      data-mce-type="bookmark"
      style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;"
      class="mce_SELRES_start"
    ></span>
    <span
      data-mce-type="bookmark"
      style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;"
      class="mce_SELRES_start"
    ></span>
    <span
      data-mce-type="bookmark"
      style="display: inline-block; width: 0px; overflow: hidden; line-height: 0;"
      class="mce_SELRES_start"
    ></span>
  </iframe>
</code>
```

![게시물이 정상적으로 표시](/assets/2020-06/after.png)

### 좀더 나은 해결 방법

내가 만약 `<blockquote> </blockquote>` (현재 동작하지 않는 embed 방식) 을 사용해 `markdown`으로 글을 작성했다면, 이후에 작동하지 않을때 모든 글을 하나씩 `<iframe> ... </iframe>`의 코드로 변환을 시켜줘야 한다. 내가 원하는 방식은 `instagram`에서 `id`만을 입력하는 방식으로 `markdown`에 입력을 하고 싶다.

```
<blockquote></blockquote> (x)
<iframe></iframe> (x)
![instagram](id) (0)
```

위 방법을 사용하기 위해서 `gatsby-transformer-remark`을 구현을 해보려고 했으나 이미 부지런하고 훌륭한 개발자들이 많다. [gatsby-remark-instagram-embed](https://www.gatsbyjs.org/packages/gatsby-remark-instagram-embed/)에 대해서 이미 원하는 방식대로 동작하는 `plugin`이 있었고, 아래와 같이 적용하니 정상적으로 동작을 확인할 수 있었다.

실제 내가 `![instagram](id)`를 입력하면 아래 코드의 `iframe`과 같은 방식으로 markdown에 embed가 된다. 이후에는 아래 코드만 수정하면 `markdown`의 본문 내용인 `![instagram](id)`는 수정할 필요가 없다. 변수에 코드를 넣는 느낌? 이후 변수는 수정하지 않고 코드만 변경하면 되는 느낌?

```html
<div>
  <iframe
    src="https://instagram.com/p/BpKjlo-B4uI/embed"
    frameborder="0"
    allowfullscreen
    scrolling="no"
    allowtransparency
    width="320"
    height="320"
  ></iframe>
</div>
```

```js
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [
          {
            resolve: "gatsby-remark-instagram-embed",
            options: {
              width: 320,
              height: 320,
            },
          },
          `gatsby-remark-responsive-iframe`, // optional plugin but recommended
        ],
      },
    },
  ],
}
```

추가로 `gatsby-remark-responsive-iframe`을 사용하면 다른 디바이스 사이즈에서 iframe의 dimension의 변화가 동적으로 할당되기 때문에 함께 사용하는게 추천 최종적으로 `markdown`의 이전/이후의 instagram embed 방식 코드는 아래와 같다.
![최종 코드 변화](/assets/2020-06/code.png)

- 참고
  - https://www.gatsbyjs.org/packages/gatsby-remark-instagram-embed/