---
title: "[Flutter] Network image"
categories: [flutter]
tags: [flutter, image]
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

<https://docs.flutter.dev/cookbook/images/network-image>

```dart
import 'package:flutter/material.dart';

void main() => runApp(const MyApp());

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var title = 'Web Images';

    return MaterialApp(
      title: title,
      home: Scaffold(
        appBar: AppBar(
          title: Text(title),
        ),
        body: Image.network('https://picsum.photos/250?image=9'),
      ),
    );
  }
}
```

```
════════ Exception caught by rendering library ═════════════════════════════════
Assertion failed:
../…/material/list_tile.dart:1771
tileWidth != leadingSize.width || tileWidth == 0.0
"Leading widget consumes entire tile width. Please use a sized widget, or consider replacing ListTile with a custom widget (see https://api.flutter.dev/flutter/material/ListTile-class.html#material.ListTile.4)"
```

### dart failed to load network image

```sh
flutter run -d chrome --web-renderer html
flutter build web --web-renderer html --release # 빌드시
```

그럼 이미지가 잘나옴

* <https://protocoderspoint.com/failed-to-load-network-image-flutter-web/>