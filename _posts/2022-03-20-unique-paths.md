---
title: "[Algorithm] Unique paths"
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

<https://leetcode.com/problems/unique-paths/>

### 문제

There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]). The robot tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time.

Given the two integers m and n, return the number of possible unique paths that the robot can take to reach the bottom-right corner.

The test cases are generated so that the answer will be less than or equal to 2 * 109.

### 풀이

* the number of possible unique paths: 이전에 계산한 이력을 다음에 사용
* dp

### 코드

```python
class Solution(object):
    def uniquePaths(self, m, n):
        """
        :type m: int
        :type n: int
        :rtype: int
        """
        
        # edge cases # 🔑
        if m <= 0 or n <= 0:
            return 0
        if m == 1 or n == 1:
            return 1
        
        # build an empty matrix (m x n)
        matrix = [[1 for j in range(n)]for i in range(m)]
        
        # record steps for each cell using DP 
        # Expect the first row and the first column, since there are only one way to get the cells in these places 
        for i in range(1, m):
            for j in range(1, n): 
                matrix[i][j] = matrix[i-1][j] + matrix[i][j-1] # 🔑
                # print(i, j, matrix[i][j])
        return matrix[-1][-1]
```

<https://github.com/restato/Algorithms/blob/master/DP/unique_paths.py>