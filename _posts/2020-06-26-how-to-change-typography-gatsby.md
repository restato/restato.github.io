---
title: "Gatsby에서 Typography를 이용해 폰트를 변경하는 방법"
tags: [gatsby, blog, typography, font]
image:
    path: /assets/2020-06/how-to-change-typography-after.png
---

기본으로 `typography`가 마음에 들지 않아 변경을 하고자 한다. 이미 gatsby에서 제공하는 수 많은 `plugin`에서 `typography`에 관련된게 없을리가 없지 하고 찾아보니 https://www.gatsbyjs.org/docs/typography-js/ 를 참고하면 쉽게 폰트 변경이 가능했다.

![기본 typography](/assets/2020-06/how-to-change-typography-before.png)

`Typography.js`를 사용하면 웹사이트에 typographic theme을 적용할 수 있다. 이미 나와 같은 고민한 사람들이 typograhpic theme을 만들어놨으니 그냥 가져다가 사용하면 된다. 가져와서 사용하기 위해서는 아래 패키지 설치가 필요하다.

```shell
npm install gatsby-plugin-typography react-typography typography
```

### gatsby-config.js

`plugin`을 설치하면 이제 자동으로 `gatsby-config.js`를 수정해주자

```js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-plugin-typography`,
      options: {
        pathToConfigModule: `src/utils/typography`,
      },
    },
  ],
}
```

`gatsby-plugin-typography`는 두가지 옵션을 제공:

- `pathToConfigModule`: 내가 정의한 Typography configuration의 파일 위치를 명시한다.
- `omitGoogleFont` (boolean, `default: false`): Google Font's CDN을 요청하는 helper가 포함되어 있어서 내가 원하는 폰트를 삽입하거나, 선택한 CDN을 사용하여 고유한 글꼴을 사용할 수 있다.
  - [Adding a Local Font](https://www.gatsbyjs.org/docs/recipes/styling-css/#adding-a-local-font), font의 파일은 `.woff2`, `.ttf`, etc

### Typography configuration

```js
import Typography from "typography"
const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.666,
  headerFontFamily: [
    "Avenir Next",
    "Helvetica Neue",
    "Segoe UI",
    "Helvetica",
    "Arial",
    "sans-serif",
  ],
  bodyFontFamily: ["Georgia", "serif"],
})
export default typography
```

![](/assets/2020-06/how-to-change-typography-after.png)

위 처럼 thypography theme이 적용된것을 확인할 수 있다. 폰트의 사이즈를 조정하기 위해서는 `baseFontSize`하나만 변경하면 그 값을 기준으로 모든 폰트의 크기가 조정된다.

![](/assets/2020-06/change-font-size.png)

위 처럼 `baseFontSize`를 변경하면 전체적으로 `+/-`의 효과를 얻을 수 있다.

### Installing Typography themes

그 외외에도 `typography-theme-funston` 과 같은 `theme`을 설치해서 이미 정의되어 있는 theme을 사용 가능하다.

```shell
npm install typography-theme-funston
```

`/src/utils/typography.js`

```js
Copysrc/utils/typography.js: copy code to clipboard
import Typography from "typography";
+ import funstonTheme from 'typography-theme-funston'
const typography = new Typography(
- {
-     baseFontSize: '18px',
-     baseLineHeight: 1.666,
-     headerFontFamily: ['Avenir Next', 'Helvetica Neue', 'Segoe UI', 'Helvetica', 'Arial', 'sans-serif'],
-     bodyFontFamily: ['Georgia', 'serif'],
- },
+ funstonTheme
);
export default typography;
```