---
title: "[ES] 시, 년도별 평균 거래금액 계산하는 쿼리 w/ agg, date_histogram, avg, calendar_interval"
tags: [elasticsearch, realestate, query, aggregation]
categories: [elasticsearch]
---

`elasticsearch(이하 es)`에 데이터는 들어있고 이제 쿼리만 짜면 되는데 생각보다 엘라스틱서치의 쿼리가 익숙하지 않아서 삽질을 하는중이다. `SQL`로 하면 간단하게 할 수 있을것만 같은 쿼리를! 일단 필요한 구문이 `groupby`인데 es에서는 `agg`의 구문을 통해서 계산이 가능하다. 일단 입력받는 값이 `시`, `기간`을 입력받고, 년도별로 월마다 평균의 거래액을 계산하면 된다.

# 시, 년도별 거래금액의 평균

항상 es쿼리와 node에서의 input을 함께 고려가 필요해 API, QUERY, 결과로 크게 나눠서 작성해보자

## API

`/api/budongsan/tranAmount?si=${si}&type=${type}&startDt=${startDt}&endDt=${endDt}`
API의 주소를 어떻게 정의해야 하는지 늘 고민이다. 아마도 좋은 레퍼런스가 있을것 같은데 일단 기능 구현부터! [naming은 다음 사이트참고](https://restfulapi.net/resource-naming/)

## ES Query

ES 쿼리는 두부분으로 나눠서 실행한다. 처음에는 내가 원하는 조건으로 검색. sql에서는 `where`절에 해당한다. 조건을 작성했다면 그 아래 `agg`를 통해 그룹화를 하면 된다 (sql에서는 `groupby`). 특징은 `agg`를 통해 그룹화할 내용을 하위 그룹에 작성해주면 된다. 마지막에 내가 얻고자 하는 필드의 통합값을 설정하면 된다. 아래에서는 평균이 필요하기 때문에 `avg`를 사용.

> Tip: postman을 이용해서 결과를 확인! 쿼리 작성은 `query` -> `aggs`의 순으로 나눠서 작성하면서 중간 결과를 확인하는게 좋다.

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "range": {
            "transaction_date": {
              "format": "yyyy",
              "gte": "2016",
              "lte": "2021"
            }
          }
        },
        {
          "terms": {
            "si": ["서울특별시"]
          }
        }
      ]
    }
  },
  "aggs": {
    "key": {
      "terms": {
        "field": "si"
      },
      "aggs": {
        "year": {
          "terms": {
            "field": "transaction_year"
          },
          "aggs": {
            "transactions_over_time": {
              "date_histogram": {
                "field": "transaction_date",
                "calendar_interval": "month",
                "format": "yyyy-MM"
              },
              "aggs": {
                "avg_transaction_amount": {
                  "avg": {
                    "field": "transaction_amount"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "size": 0
}
```

## 결과

위 쿼리를 하면 아래와 같이 서울특별시의 년도별, 년월에 해당하는 평균거래금액을 계산할수 있다.

```json
    "buckets": [
                {
                    "key": "서울특별시",
                    "doc_count": 779700,
                    "year": {
                        "doc_count_error_upper_bound": 0,
                        "sum_other_doc_count": 0,
                        "buckets": [
                            {
                                "key": 2016,
                                "doc_count": 211300,
                                "transactions_over_time": {
                                    "buckets": [
                                        {
                                            "key_as_string": "2016-01",
                                            "key": 1451606400000,
                                            "doc_count": 9575,
                                            "avg_transaction_amount": {
                                                "value": 47346.22496083551
                                            }
                                        },
```
