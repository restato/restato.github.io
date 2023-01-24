---
title: "[Algorithm] Word break"
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

<https://leetcode.com/problems/word-break/>

### 문제

Given a string s and a dictionary of strings wordDict, return true if s can be segmented into a space-separated sequence of one or more dictionary words.

Note that the same word in the dictionary may be reused multiple times in the segmentation.

### 풀이

* dp
* 이전에 확인했던 값들은 확인할 필요 없기 때문에 `dp` 리스트를 사용

### 코드

```python

# https://leetcode.com/problems/word-break/

class Solution(object):
    def wordBreak(self, s, wordDict):
        """
        :type s: str
        :type wordDict: Set[str]
        :rtype: bool
        """
        # dp[i] means s[:i+1] can be segmented into words in the wordDicts 
        dp = [False] * (len(s) + 1) 
        dp[0] = True
        for i in range(len(s)):
            # print(dp[i])
            if dp[i]:
                for j in range(i + 1, len(s) + 1):
                    # print(s[i:j])
                    if s[i:j] in wordDict:
                        # print('hit', j)
                        dp[j] = True # 🔑 hit된 마지막 인덱스를 저장해 이전은 확인 안하도록 e.g., applepenapple 의 경우 apple은 다시 체크할 필요 없이 pen 부터 확인
        return dp[-1] # 마지막 char가 wordDict에 있으면 True
```

<https://github.com/restato/Algorithms/blob/master/DP/word_break.py>