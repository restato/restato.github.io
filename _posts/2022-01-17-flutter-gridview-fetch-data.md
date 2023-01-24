---
title: "[Flutter] GirdView 리스트 결과 출력"
categories: [flutter]
tags: [flutter, gridview, list]
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

<https://blog.logrocket.com/how-to-create-a-grid-list-in-flutter-using-gridview/>

GridView에서 각 margin의 의미

```dart

class GridListDemo extends StatelessWidget {
  const GridListDemo({Key? key}) : super(key: key);
  List<_Photo> _photos(BuildContext context) {
    return [
      _Photo(
          imageUrl:
              'http://thumbnail10.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/241314894070500-c2b90551-d723-41df-9f3f-8f4c541abdc3.jpg',
          title: 'hi',
          subtitle: 'bye'),
      _Photo(
          imageUrl:
              'http://thumbnail10.coupangcdn.com/thumbnails/remote/230x230ex/image/retail/images/241314894070500-c2b90551-d723-41df-9f3f-8f4c541abdc3.jpg',
          title: 'hi',
          subtitle: 'bye'),
    ];
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Vagazine',
      theme: ThemeData(primarySwatch: Colors.indigo),
      home: Scaffold(
        appBar: AppBar(title: const Text('Vagazine')),
        body: Center(
          child: FutureBuilder<List<Item>>(
            future: fetchItems(),
            builder: (context, snapshot) {
              if (snapshot.hasData) {
                List<Item>? resData = snapshot.data;
                return GridView.builder(
                    itemCount: resData != null ? resData.length : 0,
                    gridDelegate:
                        const SliverGridDelegateWithFixedCrossAxisCount(
                      crossAxisCount: 2,
                      crossAxisSpacing: 5.0,
                      mainAxisSpacing: 5.0,
                    ),
                    itemBuilder: (context, index) {
                      Item item = resData![index];
                      return _GridPhotoItem(item: item);
                    });
              } else if (snapshot.hasError) {
                return Text('${snapshot.error}');
              }
              return const CircularProgressIndicator();
            },
          ),
        ),
      ),
    );
  }
}
```

### 클릭 이벤트 추가

```dart
itemBuilder: (context, index) {
    Item item = resData![index];
    return GestureDetector(
        onTap: () {
        print("onTap");
        },
        child: _GridPhotoItem(item: item));
});
```