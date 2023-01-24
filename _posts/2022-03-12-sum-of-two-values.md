---
title: "[Algorithm] Sum of Two values"
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

<https://www.educative.io/m/sum-of-two-values>
<https://leetcode.com/problems/two-sum/>

### 문제

Given an array of integers and a value, determine if there are any two integers in the array whose sum is equal to the given value. Return true if the sum exists and return false if it does not.

### 풀이

* `two integers in the array whose sum is equal to the given value`: val - a
* `hash`: 이미 계산한 integer는 hash에

### 코드

```python
def find_sum_of_two(A, val):
  found_values = set()
  for a in A:
    if val - a in found_values: # 🔑
      return True
    found_values.add(a) # 🔑 check visited
  return False

v = [5, 7, 1, 2, 8, 4, 3]
test = [3, 20, 1, 2, 7]

for i in range(len(test)):
  output = find_sum_of_two(v, test[i])
  print("find_sum_of_two(v, " + str(test[i]) + ") = " + str(output))
```

<https://github.com/restato/Algorithms/blob/master/Array/sum_of_two_values.py>

### 정리

* Runtime Complexity: O(n)
* Memory Complexity: O(n)
