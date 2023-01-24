---
title: "[Algorithm] Climbing Stairs"
categories: [알고리즘]
tags: [leetcode, algorithm, dp, fibonacci]
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

<https://leetcode.com/problems/climbing-stairs/>

### 문제

You are climbing a staircase. It takes n steps to reach the top.

Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?

### 풀이

* `x[i] = x[i-1] + x[i-2]`

### 코드

```python
# https://leetcode.com/problems/climbing-stairs/submissions/

class Solution:
    def climbStairs(self, n: int) -> int: 
        if n == 0: return 0
        
        dp = {}
        dp[1] = 1
        dp[2] = 2
        
        for i in range(3, n+1):
            dp[i] = dp[i-1] + dp[i-2]
        return dp[n]
```

* <https://github.com/restato/Algorithms/blob/master/DP/climbing_stairs.py>
