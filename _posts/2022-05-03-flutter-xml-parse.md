---
title: "[Flutter] XML Parsing"
categories: [flutter]
tags: [flutter, xml, parsing]
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

### 코드

```dart
final myTranformer = Xml2Json();
var xmlString = '''<?xml version="1.0"?>
<site>
    <tut>
    <id>tut_01</id>
    <author>bezKoder</author>
    <title>Programming Tut#1</title>
    <publish_date>2020-8-21</publish_date>
    <description>Tut#1 Description</description>
    </tut>
    <tut∑>
    <id>tut_02</id>
    <author>zKoder</author>
    <title>Software Dev Tut#2</title>
    <publish_date>2020-12-18</publish_date>
    <description>Tut#2 Description</description>
    </tut>
</site>''';
myTranformer.parse(xmlString);
var jsonString = myTranformer.toParker();
final parsed = jsonDecode(jsonString)['site']['tut']
    .cast<Map<String, dynamic>>();
return parsed
    .map<Transaction>((json) => Transaction.fromJson(json))
    .toList();
```

요청을 받은 결과에서 `.parse`에서 에러가 나는 경우 아래와 같이 `utf8.decode`를 해주면 된다.

```dart
final utf16Body = utf8.decode(response.bodyBytes);
myTranformer.parse(utf16Body);
```

### Reference

* <https://stackoverflow.com/questions/54801488/dart-xml-parser-doesn-t-decode-utf-8-characters>
* <https://www.bezkoder.com/dart-flutter-xml-to-json-xml2json/>