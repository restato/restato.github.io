---
title: Gatsby로 블로그 만들어보기
tags: [gatsby, blog]
categories: [blog]
# pin: true
image:
  path: /assets/2020-06/gatsby-intro.jpg
---

(작성중)
gatsby는 여러개의 plugin을 붙여서 내가 원하는 사이트를 만들수 있으며, 어느정도의 개발 능력이 요구되는것은 사실이다. 처응메는 짠 하고 만들면 바로 사용을 할 수 있을거라고 생각했지만 조금씩 내가 원하는 기능을 붙이려고 시도해보면 많은 어려움을 겪게 된다. tutorial, starter를 참고하면서 작성하면 도움이 된다.

### 블로그 개발에 참고한 문서

1. [Tutorial](https://www.gatsbyjs.org/tutorial/)
2. [Docs](https://www.gatsbyjs.org/docs/)

- Doc을 언제 다읽지 싶은데, recipes를 읽다 보면 중간중간 중복되는 부분이 있어서 금방 읽는다.

3. [Recipes](https://www.gatsbyjs.org/docs/recipes/)

- [Pages and Layout](https://www.gatsbyjs.org/docs/recipes/pages-layouts#project-structure)
  - page와 layout을 어떻게 구성하는지와 흐름에 대해서 설명 (gatsby-node.js, template)
- [Styling with CSS](https://www.gatsbyjs.org/docs/recipes/styling-css/)
  - [emotion](https://www.gatsbyjs.org/docs/recipes/styling-css/#directions-6)
  - [gatsby-plugin-emotion](https://www.gatsbyjs.org/packages/gatsby-plugin-emotion/)
- [creating & modifying pages](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#creating-pages-in-gatsby-nodejs)
- [gatsby-theme-plugin](https://www.gatsbyjs.org/packages/gatsby-theme-blog/?=gatsby-theme)
  - 여러가지의 theme을 동시에 사용 가능 (초기에 프로젝트 생성하고 여러개의 theme을 설치 > customize)
    - 여러가지 themes을 적용하기 위해서는 [Using Multiple Gatsby Themes](https://www.gatsbyjs.org/docs/themes/using-multiple-gatsby-themes/)
  - [gatsby-blog-theme](https://www.gatsbyjs.org/packages/gatsby-theme-blog/#theme-options)
  - (추천) [using multiple themes together tutorial](https://www.gatsbyjs.org/tutorial/using-multiple-themes-together)
    - 설치하면 `/content/posts`에 파일을 추가하면 끝
- [sourcing data](https://www.gatsbyjs.org/docs/recipes/sourcing-data/)
  - [markdown 블로그 포스트 페이지 생성하는 방법](https://www.gatsbyjs.org/docs/recipes/sourcing-data/#directions-1)
    - [추가로 살펴보기](https://www.gatsbyjs.org/docs/recipes/sourcing-data/#additional-resources-1)
  - `gatsby-source-filesystem`을 이용하면 filesystem에서 data fetch 가능
    - `gatsby-config.js`에 images, markdown의 경로를 미리 지정
    - markdown은 frontmatter (title, date, path)를 작성
  - `gastby-source-wordpress`를 이용하면 WordPress에서 data fetch 가능
  - [createNode()](https://www.gatsbyjs.org/docs/actions/#createNode)를 이용해서 어떻게 custom data를 추가하는지에 대한 설명
    - graphQL에서 사용이 가능
  - [createPage()](https://www.gatsbyjs.org/docs/actions/#createPage) 를 통해 markdown 페이지를 다이나믹하게 생성
  - [file-list](https://www.gatsbyjs.org/tutorial/part-five/#source-plugins)
- [querying data](https://www.gatsbyjs.org/docs/recipes/querying-data/)
  - tag와 같이 데이터에서 쿼리를 통해 특정 포스트만 가져오는 방법
  - useStaticQuery hook (gatsby v2.1)
  - filtering, sort limiting,
- [working with images](https://www.gatsbyjs.org/docs/recipes/working-with-images/)
  - static 하게 src/images에 있는 이미지 불러올때 사용 (md를 사용하는것은 아님)
- [transforming data](https://www.gatsbyjs.org/docs/recipes/transforming-data/)
  - data fetch를 하고, 어떤 전처리를 할때 사용 (JSON을 Javascript object로 변환)
  - `gatsby-transformer-remark`을 이용해서 markdown files을 HTML로 변환
- [deploying your site](https://www.gatsbyjs.org/docs/recipes/deploying-your-site/)
  - 어디에 deploy를 할지에 대한 내용, github, gitlab, netflify 등 배포가 가능하다.
  - netflify에 배포하기
    - 이후에 A/B Testing with GA가 가능 [참고](https://www.gatsbyjs.org/docs/ab-testing-with-google-analytics-and-netlify/)

4. [Reference Guides](https://www.gatsbyjs.org/docs/guides/)

- Deploying & Hosting
  - [Netflify](https://www.gatsbyjs.org/docs/deploying-to-netlify/)
- Custom Configuration
  - babel, webpack, html.js에 대해서 customize가 가능
  - [using environment variables](https://www.gatsbyjs.org/docs/environment-variables/)
    - 환경변수 설정할때 (production/development)
  - [Using ESLint](https://www.gatsbyjs.org/docs/eslint/)
    - 코드 정적 분석하는데 사용
  - [Proxying API Requests](https://www.gatsbyjs.org/docs/api-proxy/)
- [Images, Files & Video in Gatsby](https://www.gatsbyjs.org/docs/images-and-files/)
  - graphQL을 만드시 사용해야 하는 것은 아님, import, static folder를 이용
  - [Working with Images in Markdown](https://www.gatsbyjs.org/docs/working-with-images-in-markdown/)
    - frontmatter field에 넣기 위해서는 `gatsby-plugin-sharp` and `gatsby-transformer-remark` or `gatsby-plugin-mdx` 사용
      - 추가로 참고하고 싶으면 [programmatically Create Pages from Data](https://www.gatsbyjs.org/tutorial/part-seven/)
    - post, image를 동일한 폴더에 넣는 설정 or image를 다른 폴더에 넣는 설정 가능
    - fontmatter에는 `featuredImage`로 경로 추가
      - 이미지가 있는 포스트 템플릿 만드는 [code](https://www.gatsbyjs.org/docs/working-with-images-in-markdown/#querying-for-images-from-frontmatter)
    - inline images with `gatsby-remark-images`
      - markdown body에 image를 추가 하기 위해서는 `gatsby-remark-images`, `gatsby-plugin-sharp`를 설치
    - [gatsby-transformer-remark](https://www.gatsbyjs.org/docs/working-with-images-in-markdown/#using-the-transformer-remark-plugin)를 사용하는 config
  - [Preprocessing External Images](https://www.gatsbyjs.org/docs/preprocessing-external-images/)
    - local이 아닌 github이나 외부에 있는 이미지를 추가할때 참고
- [Sourcing Content & Data](https://www.gatsbyjs.org/docs/content-and-data/)
  - load data from anywhere!
  - 실제 외부에서 데이터 가져올때 참고하자
- [Querying Your Data with GraphQL](https://www.gatsbyjs.org/docs/why-gatsby-uses-graphql/)
  - createPage가 어떻게 동작하는지 (/w no data)
  - data를 created pages로 넘기기 위해서는 `context`를 `createPage`로 넘겨야 한다.
  - `context`는 `templates`에서 `props`의 형태로 사용이 가능
  - `slug`을 넘겨서 다시 재쿼리 하도록 [예제 코드](https://www.gatsbyjs.org/docs/why-gatsby-uses-graphql/#generate-pages-with-graphql)
    - 이후 build에서의 performance를 얻기 위해서는 [performance implications](https://www.gatsbyjs.org/docs/creating-and-modifying-pages/#performance-implications)
  - [Querying Data in Pages with GraphQL](https://www.gatsbyjs.org/docs/page-query/)
    - tag가 가능한 page를 어떻게 만드는지 에대한 내용
  - [staticQuery](https://www.gatsbyjs.org/docs/static-query/), `useStaticQuery`로 대체
    - 컴포넌트에서 GraphQL 데이터 사용
  - (추천) 또는 v2.1.0 이후에 react hook을 이용한 [useStaticQuery](https://www.gatsbyjs.org/docs/use-static-query/)
    - hook을 내가 다시 만들어서 `siteMetaData`관련된 hook을 생성할수있다. (반복되는 코드를 줄이때 좋음) [코드](https://www.gatsbyjs.org/docs/use-static-query/#composing-custom-usestaticquery-hooks)
    - 한계로는
      - 변수를 허용하지 않음
      - 현재 gatsby에서 쿼리가 작동하는 방식 때문에 파일에서 하나의 `useStaticQuery` 인스턴스만 지원
  - [Using GraphQL Fragments](https://www.gatsbyjs.org/docs/using-graphql-fragments/)
    - graphQL의 쿼리의 일부를 재사용할 수 있다. 또한 복잡한 쿼리를 더 작고 이해하기 쉬운 구성요소로 나눌 수 있음
    - 이후에 query가 복잡해지면 보는게 좋을듯
  - [Creating Slugs for Pages](https://www.gatsbyjs.org/docs/creating-slugs-for-pages/)
    - `createNodeField`를 통해 slug을 추가할수 있다.
  - [Creating Pages from Data Programmatically](https://www.gatsbyjs.org/docs/programmatically-create-pages-from-data/)
    - `createPage`에서 slug을 넘기고, slug을 context로 받아 template에서 slug을 사용해 markdown 데이터 가져오는 방법, 코드
  - [Adding Markdown Pages](https://www.gatsbyjs.org/docs/adding-markdown-pages/)
    - 위에서 했던 얘기 또 함
  - [Adding a List of Markdown Blog Posts](https://www.gatsbyjs.org/docs/adding-a-list-of-markdown-blog-posts/)
    - `/pages/index.js`에 posts를 쿼리하고 forloop을 돌림 (+filtering)
    - `PostLink` Components에 대해서도 코드 있음 (slug을 Link to)
  - [GraphQL Playground](https://www.gatsbyjs.org/docs/using-graphql-playground/)
    - `localhost:8001`이 싫다면 해당 tool을 설치해서 사용할수 있음

4. [Starters](https://www.gatsbyjs.org/starters/?v=2)

- Gatsby로 만든 사이트의 코드를 함께 확인이 가능해 초기에 사용하는게 좋다. (400개정도 제공)
- 초기에 starter로 사이트를 만들면 우와! 라고 생각하고, 그 사이트에 다른 사이트를 붙여볼텐데, 그 방법보다는 신규 프로젝트에 내가 우와! 하는 사이트를 붙여보자. 웹개발 할때는 급한 마음에 코드를 붙이다가 내가 어떤 코드를 붙이고 있었는지 에러가 왜 나는지 확인하기가 어려웠다. 무조건 초기 프로젝트는 내가 생성하자 (천천히 가더라도)
- 프로젝트 구조가 다들 다르다. (=합칠때 프로젝트의 구조가 점점 오염된다. 기준이 필요)

5. [Theme](https://gatsbytemplates.io/)

- [amstredam](https://gatsbytemplates.io/theme/amsterdam/)

6. [Gatsby-Lifecycle](https://www.gatsbyjs.org/docs/gatsby-lifecycle-apis/)

# GraphQL 정리

- [GraphQL & gatsby](https://www.gatsbyjs.org/docs/graphql/)
  - 쿼리 예제가 있으니 참고해보자
- [GraphQL Query Options Reference](https://www.gatsbyjs.org/docs/graphql-reference/)
-

## Markdown 목록 모두 가져오기

```
{
  allMarkdownRemark {
    edges {
      node {
        frontmatter {
          path
        }
      }
    }
  }
}
```

## Markdown, Images 가져오기

https://www.gatsbyjs.org/docs/working-with-images-in-markdown/#querying-for-images-from-frontmatter

- `fluid`는 responsive image를 생성할때 사용

```js
export const query = graphql`
  query PostQuery($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
        featuredImage {
          childImageSharp {
            fluid(maxWidth: 800) {
              ...GatsbyImageSharpFluid
            }
          }
        }
      }
    }
  }
`
```

### 내가 참고한 starter

# 1단계

- 레이아웃 구성하기
- 작성된 포스트 리스트 화면에 구성
- markdown으로 작성된 포스트 화면에 출력
  - [instagram](https://www.gatsbyjs.org/packages/gatsby-remark-instagram-embed/)
  - [youtube](https://www.gatsbyjs.org/packages/gatsby-remark-embed-youtube/)
- 사용자 피드백
  - [google analytics](https://www.gatsbyjs.org/packages/gatsby-plugin-google-analytics/?=google%20analy)
    - [ga env 설정하기](https://www.gatsbyjs.org/docs/environment-variables/#google-analytics-env-var-example)
- netflify에 배포하기
  - [deploying to netflify](https://www.gatsbyjs.org/docs/recipes/deploying-your-site/#deploying-to-netlify)

### 참고한 gatsby-starter

- 카테고리, 태그
  - github: https://github.com/rmcfadzean/gatsby-pantry/tree/master/examples/starter-blog#readme
  - github: https://github.com/LekoArts/gatsby-themes/tree/master/themes/gatsby-theme-minimal-blog
  - demo: https://minimal-blog.lekoarts.de/
  - light, dark mode
- instagram layout
  - github: https://github.com/timrodz/gatsby-starter-instagram-baseweb
  - demo: https://gatsby-starter-instagram-baseweb.netlify.app/

# 2단계

- 댓글기능 추가
