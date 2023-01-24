---
title: "[Algorithm] Find the missing number in the array"
categories: [알고리즘]
tags: [algorithm, array]
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

<https://www.educative.io/blog/crack-amazon-coding-interview-questions>

### 문제

You are given an array of positive numbers from 1 to n, such that all numbers from 1 to n are present except one number ‘x’. You have to find ‘x’. The input array is not sorted.

### 풀이

* `1 to n`, `one number`가 문제의 핵심
* `sum(1 to n)`: (n * (n + 1)) / 2
* `one number`: `1 to n` - sum(array)

### 코드

```python
def find_missing(input):
  # calculate sum of all elements 
  # in input list
  sum_of_elements = sum(input)
  
  # There is exactly 1 number missing 
  n = len(input) + 1
  actual_sum = (n * ( n + 1 ) ) / 2 # 🔑
  return actual_sum - sum_of_elements


def test(n):
  missing_element = random.randint(1, n)
  v = []
  for i in range(1, n):
    if i != missing_element:
      v.append(i)
```

<https://github.com/restato/Algorithms/blob/master/Array/find_the_missing_number_in_the_array.py>

### 정리

* Runtime Complexity: Linear, O(n)
* Memory Complexity: Constant, O(1)
