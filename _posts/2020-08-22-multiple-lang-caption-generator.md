---
title: "파이썬을 이용해서 여러 국가의 자막을 만드는 스크립트 (SRT, GoogleTrans를 이용)"
tags: [python, srt, google-translate]
categories: [python]
image:
    path: /assets/2020-08/caption-results.png
---

한개의 언어로 자막을 만들고 여러 국가의 자막을 만드는 방법을 찾아보니 생각보다 복잡하고 정확하게 그 기능이 가능한 사이트를 찾지 못했다. 아무래도 서비스를 제공하는 제공자 입장에서 이것저것 덕지덕지 붙이다보니 제공하기 어려웠을듯, 추가로 만드는데 어렵지 않아서 사람들이 각자 만들어서 사용할 수도... 일단 FCPX에서 캡션을 생성해보고 어떤 파일의 포맷인지를 확인하고 해당 파일의 포맷을 읽고 구글의 번역기를 이용해서 최종 여러 언어를 지원하도록 자막을 생성하는 코드를 파이썬으로 구현하였다. 이후에 번역이 100% 믿음이 간다면 블로그도 여러개의 언어로 작성이 가능하지 않을까 싶다.

위 코드는 [github](https://github.com/restato/playground)

# SRT 파일 (포맷, 처리)

SRT의 파일은 아래와 같은 형태로 포맷팅이 되어있다. 해당 파일을 읽는 리더를 만들어도 좋지만 파이썬은 패키지가 다양하기 때문에 물론 이 SRT파일을 읽는 패키지도 있지 않을까 생각해서 검색했는데 역시나 있었다. 단순히 리더역할이 아닌 자막 자체를 객체 형태로 갖고 있어서 캡션에 자막(텍스트) 부분만 치환하는데 어려움이 없었다.

- https://pypi.org/project/srt/

```
1
00:00:00,000 --> 00:00:02,001
안녕하세요. 주말 아침입니다.

2
00:00:05,505 --> 00:00:07,507
아직도 자고있는 남편을 위해서

3
00:00:10,969 --> 00:00:12,971
오늘은 모닝 토스트를 만들어보려고 해요.
```

아래와 같이 `pysrt`를 이용해 srt의 파일을 읽고, 아래와 같이 간단한 반복문으로 자막을 출력할 수 있다. `sub`의 자체가 객체이기 때문에 자막 부분을 접근하기 위해서는 `sub.text`를 해주면 `Hello. Weekend morning.`과 같은 문자만 추출할 수 있다. 우리가 원하는 부분은 해당 `sub.text`를 치환하면 되기 때문에 다른 객체의 변수들은 건들일 필요가 없다.

```python
import pysrt
subs = pysrt.open(input_srt)

for sub in subs:
    print (sub)

'''
1
00:00:00,000 --> 00:00:02,001
Hello. Weekend morning.

2
00:00:05,505 --> 00:00:07,507
For my husband who is still sleeping

3
00:00:10,969 --> 00:00:12,971
Today, I’m going to make morning toast.
'''
```

번역한 결과가 `translations`에 들어왔다고 가정하면 우리는 위에서 말한것과 같이 `sub.text`를 치환하고 `subs`의 형태가 객체이기 때문에 내부 변수를 변경하고 바로 저장하면 새로운 `SRT`의 포맷 자막이 생성된다.

```python
for sub, translation in zip(subs, translations):
  sub.text = translation.text
subs.save('data/SRT_%s.srt' % language_code, encoding='utf-8')
```

# Google 번역

위에서 SRT처리하는 방법은 알았고 `translations`의 결과만 우리가 필요하다. 아래와 같이 `googletrans`의 패키지를 이용하면 단 두줄에 번역이 가능하다.

- https://py-googletrans.readthedocs.io/en/latest/

```python
from googletrans import Translator

translator = Translator()
result = translator.translate('안녕하세요. 이탈리아 두번째 날이예요.', dest="ja") # 일본어로 번역
print(result.text)
result = translator.translate('안녕하세요. 이탈리아 두번째 날이예요.', dest="en") # 영어로 번역
print(result.text)

'''
こんにちは。イタリアの二日目なんです。
Hello. It's the second day in Italy.
'''
```

아무래도 자막의 경우 한줄이 아닌 여러줄이기 때문에 벌크의 형태로 요청하는게 좋을것 같아서 아래와 같이 `translate()` 함수 안에 list를 넘겨 한번에 처리를 했다.

```python
from googletrans import Translator

translator = Translator()
translations = translator.translate(
    ['The quick brown fox', 'jumps over', 'the lazy dog'], dest='ko')
for translation in translations:
    print(translation.origin, ' -> ', translation.text)
```

# 최종 두개의 코드를 합치면

SRT의 파일을 읽고, 구글번역하고 최종 SRT를 저장하는 코드는 아래와 같다. 내가 필요한 언어의 코드를 입력으로 받아 최종 파일을 생성할 수 있다.

```python
subs = pysrt.open(input_srt)
language_code = 'en'

def translate(subs, language_code):
    print('processing %s...' % language_code)
    text_list = []
    for sub in subs:
        text_list.append(sub.text)

    translator = Translator()
    translations = translator.translate(text_list, dest=language_code)
    # for translation in translations:
        # print(translation.origin, ' -> ', translation.text)

    for sub, translation in zip(subs, translations):
        sub.text = translation.text
    subs.save('data/SRT_%s.srt' % language_code, encoding='utf-8')
```

아래 언어코드를 넣었는데 이 언어코드가 어떤 언어인지 확인하기 위해서는 [확인하러가기](http://help.ads.microsoft.com/apex/index/18/ko/10004) 또는 구글번역기로 번역해도 좋다.

![무슨 언어인지 모르겠음](/assets/2020-08/caption-results.png)

```python
import pandas as pd

langs = []
for k, v in LANGCODES.items():
    langs.append(k)

translator = Translator()
translations = translator.translate(langs, dest='ko')

for translation in translations:
    print(translation.text)

lang_list = []
for item, translation in zip(LANGCODES.items(), translations):
    print(item[0], item[1], translation.text.replace(' ',''))
    lang_list.append({'name':item[0], 'code':item[1], 'kor_name':translation.text.replace(' ','')})

df = pd.DataFrame(lang_list)
df.to_csv('code.csv', index=False)
df = pd.read_csv('code.csv')
'''
frikaans af 아프리카어
albanian sq 알바니아
amharic am 암하라어
arabic ar 아라비아말
armenian hy 아르메니아사람
azerbaijani az 아제르바이잔
basque eu 바스크사람
belarusian be 벨로루시
bengali bn 벵골사람
bosnian bs 보스니아인
bulgarian bg 불가리아사람
catalan ca 카탈로니아사람
cebuano ceb 세부아노
chichewa ny 치체와
chinese (simplified) zh-cn 중국어(간체)
chinese (traditional) zh-tw 중국전통)
'''

# 이후 한글 파일명으로 생성할때
import pysrt
from googletrans import Translator

input_srt = './data/SRT_Korean.srt'

for row in df.iterrows():
    name, code, kor_name = row[1]
    subs = pysrt.open(input_srt) # 새롭게 한글로 로딩 (영어를 최초에 한번하고 영어로 넘기는게 좋아보임)
    translate(subs, language_code=code, filename=kor_name)

def translate(subs, language_code, filename):
    print('processing %s...' % language_code)
    text_list = []
    for sub in subs:
        text_list.append(sub.text)

    translator = Translator()
    translations = translator.translate(text_list, dest=language_code)
    # for translation in translations:
        # print(translation.origin, ' -> ', translation.text)

    for sub, translation in zip(subs, translations):
        sub.text = translation.text
    subs.save('data/SRT_%s_%s.srt' % (code, filename), encoding='utf-8') # 번역결과가 이상한 경우가 있으니 코드도 함께 저장
```

<details><summary>언어 코드</summary>
<p>

#### yes, even hidden code blocks!

```python
LANGUAGES = {
    'af': 'afrikaans',
    'sq': 'albanian',
    'am': 'amharic',
    'ar': 'arabic',
    'hy': 'armenian',
    'az': 'azerbaijani',
    'eu': 'basque',
    'be': 'belarusian',
    'bn': 'bengali',
    'bs': 'bosnian',
    'bg': 'bulgarian',
    'ca': 'catalan',
    'ceb': 'cebuano',
    'ny': 'chichewa',
    'zh-cn': 'chinese (simplified)',
    'zh-tw': 'chinese (traditional)',
    'co': 'corsican',
    'hr': 'croatian',
    'cs': 'czech',
    'da': 'danish',
    'nl': 'dutch',
    'en': 'english',
    'eo': 'esperanto',
    'et': 'estonian',
    'tl': 'filipino',
    'fi': 'finnish',
    'fr': 'french',
    'fy': 'frisian',
    'gl': 'galician',
    'ka': 'georgian',
    'de': 'german',
    'el': 'greek',
    'gu': 'gujarati',
    'ht': 'haitian creole',
    'ha': 'hausa',
    'haw': 'hawaiian',
    'iw': 'hebrew',
    'hi': 'hindi',
    'hmn': 'hmong',
    'hu': 'hungarian',
    'is': 'icelandic',
    'ig': 'igbo',
    'id': 'indonesian',
    'ga': 'irish',
    'it': 'italian',
    'ja': 'japanese',
    'jw': 'javanese',
    'kn': 'kannada',
    'kk': 'kazakh',
    'km': 'khmer',
    'ko': 'korean',
    'ku': 'kurdish (kurmanji)',
    'ky': 'kyrgyz',
    'lo': 'lao',
    'la': 'latin',
    'lv': 'latvian',
    'lt': 'lithuanian',
    'lb': 'luxembourgish',
    'mk': 'macedonian',
    'mg': 'malagasy',
    'ms': 'malay',
    'ml': 'malayalam',
    'mt': 'maltese',
    'mi': 'maori',
    'mr': 'marathi',
    'mn': 'mongolian',
    'my': 'myanmar (burmese)',
    'ne': 'nepali',
    'no': 'norwegian',
    'ps': 'pashto',
    'fa': 'persian',
    'pl': 'polish',
    'pt': 'portuguese',
    'pa': 'punjabi',
    'ro': 'romanian',
    'ru': 'russian',
    'sm': 'samoan',
    'gd': 'scots gaelic',
    'sr': 'serbian',
    'st': 'sesotho',
    'sn': 'shona',
    'sd': 'sindhi',
    'si': 'sinhala',
    'sk': 'slovak',
    'sl': 'slovenian',
    'so': 'somali',
    'es': 'spanish',
    'su': 'sundanese',
    'sw': 'swahili',
    'sv': 'swedish',
    'tg': 'tajik',
    'ta': 'tamil',
    'te': 'telugu',
    'th': 'thai',
    'tr': 'turkish',
    'uk': 'ukrainian',
    'ur': 'urdu',
    'uz': 'uzbek',
    'vi': 'vietnamese',
    'cy': 'welsh',
    'xh': 'xhosa',
    'yi': 'yiddish',
    'yo': 'yoruba',
    'zu': 'zulu',
    'fil': 'Filipino',
    'he': 'Hebrew'
}
LANGCODES = dict(map(reversed, LANGUAGES.items()))

subs = pysrt.open(input_srt)
for k, v in LANGCODES.items():
    translate(subs, language_code=v)
```

</p>
</details>