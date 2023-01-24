---
title: "Snippets in Visual Studio Code"
categories: [개발환경]
tags: [dev, env, vscode, snippets]
---

`_post`에 글을 작성할때마다 매번 아래를 작성해주는게 번거로움

```
---
title: #title
categories: # []
tags: # [] 
---
```

글을 작성할때 에디터로 `Visual Studio Code (이하: VSCode)`를 사용하고 있는데,
VSCode에서는 `Snippets`을 지원한다.

## 나만의 snippet 만들기

아래 경로로 들어가면 `New Global Snippets file...`을 바로 생성이 가능하다.

> [Code] - [Preference] - [User Snippets]

생성하면 아래와 같이 파일이 생성되는데 여기에 내가 원하는 `snippets`을 설정하면 된다.

```json
{
    "post": {
        "scope": "markdown,md",
        "prefix": "post",
        "body": [
			"---",
			"title:",
			"categories: []", 
			"tags: []",
			"mermaid: true",
			"math: true",
			"comments: true",
			"pin: false",
			"image:",
			"  path:",
			"  width:",
			"  height:",
			"  alt:" ,
			 "---"]
    }
}
```

* `body`: 여러줄을 사용할때는 `,`를 이용해서 구분한다.

<details><summary> Default Snippets </summary>

<p>

```json
	// Place your global snippets here. Each snippet is defined under a snippet name and has a scope, prefix, body and 
	// description. Add comma separated ids of the languages where the snippet is applicable in the scope field. If scope 
	// is left empty or omitted, the snippet gets applied to all languages. The prefix is what is 
	// used to trigger the snippet and the body will be expanded and inserted. Possible variables are: 
	// $1, $2 for tab stops, $0 for the final cursor position, and ${1:label}, ${2:another} for placeholders. 
	// Placeholders with the same ids are connected.
	// Example:
	// "Print to console": {
	// 	"scope": "javascript,typescript",
	// 	"prefix": "log",
	// 	"body": [
	// 		"console.log('$1');",
	// 		"$2"
	// 	],
	// 	"description": "Log output to console"
	// }
```
</p>

</details>

이후에 `markdown`을 작성할때 `post`를 입력하고 post `^Space`를 누르면 아래와 같이 생성된 snippet이 보인다.

![생성된 snippet](/assets/2021-07/post-snippets.png)

아래는 `snippet`으로 생성된 결과 [chipry에서 지원하는 Front Matter](https://github.com/cotes2020/jekyll-theme-chirpy/blob/master/_posts/2019-08-08-write-a-new-post.md)

```yaml
---
title:
categories: []
tags: []
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
```

## 참고

* https://code.visualstudio.com/docs/editor/userdefinedsnippets