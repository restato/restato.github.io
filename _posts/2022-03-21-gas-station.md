---
title: "[Algorithm] Gas station"
categories: [알고리즘]
tags: [leetcode, algorithm, dp]
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

<https://leetcode.com/problems/gas-station/>

### 문제

There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i].

You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. You begin the journey with an empty tank at one of the gas stations.

Given two integer arrays gas and cost, return the starting gas station's index if you can travel around the circuit once in the clockwise direction, otherwise return -1. If there exists a solution, it is guaranteed to be unique

### 풀이

* `granteed to be unique`
* sum(gas) > sum(cost)

### 코드

```
[2,3,4]
[3,4,3]
-1
```

```python
class Solution:
    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:
        if (sum(gas) - sum(cost) < 0): # 🔑
            return -1
        
        start_index = 0
        tank = 0
        for i, value in enumerate(gas):
            print(f'tank: {tank}, gas: {gas[i]}, cost: {cost[i]}')
            tank += gas[i] - cost[i]
            print(f'tank: {tank}')
            if tank < 0:
                start_index = i + 1
                tank = 0
        return start_index
```

<https://github.com/restato/Algorithms/blob/master/Greedy/gas_station.py>

### 정리

* time complexity: O(n)
* space complexity: O(1)
