---
title: "[Algorithm] Word search"
categories: [알고리즘]
tags: [leetcode, algorithm, dfs]
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

<https://leetcode.com/problems/word-search/>

### 문제

Given an m x n grid of characters board and a string word, return true if word exists in the grid.

The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.

### 풀이

* horzontally or vertically neighboring (= dfs)
* 방문한 노드를 피하기 위해서 `#`으로 대체 후 결과 받으면 다시 원복으로

### 코드

```
# 방문한 노드 테스트 케이스
[["C","A","A"],["A","A","A"],["B","C","D"]]
"AAB"
```

```python
# https://leetcode.com/problems/word-search/

class Solution:
    def exist(self, board, word):
        # board = m x n matrix
        m = len(board)
        n = len(board[0])
        # print(m, n)
        
        # check whether can find word, start at (i,j) position    
        for i in range(m):
            for j in range(n):
                if self.dfs(board, i, j, word):
                    return True
        return False

    def dfs(self, board, i, j, word):
        # print(board, i, j, word)
        if len(word) == 0: # all the characters are checked
            return True
        if i<0 or i>=len(board) or j<0 or j>=len(board[0]) or word[0]!=board[i][j]:
            return False
        
        tmp = board[i][j]  # first character is found, check the remaining part
        board[i][j] = "#"  # avoid visit agian 
        
        # 🔑 check whether can find "word" along one direction
        res = self.dfs(board, i+1, j, word[1:]) or self.dfs(board, i-1, j, word[1:]) \
            or self.dfs(board, i, j+1, word[1:]) or self.dfs(board, i, j-1, word[1:])
        
        board[i][j] = tmp # 🔑 avoids the danger of 'going back' problem.
        return res
```

https://github.com/restato/Algorithms/blob/master/Array/word_search.py
