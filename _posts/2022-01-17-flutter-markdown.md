---
title: "[Flutter] Markdown"
categories: [flutter]
tags: [flutter, markdown]
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

<https://pub.dev/packages/flutter_markdown/example>

```sh
flutter pub add flutter_markdown
```

```dart
appBar: AppBar(title: const Markdown(data: '### Vagazine'))
```

Another exception was thrown: Assertion failed:

flutter_markdown에서 data에는 `.md` 파일을 넣어줘야 한다.

<https://github.com/asjqkkkk/markdown_widget>을 참고