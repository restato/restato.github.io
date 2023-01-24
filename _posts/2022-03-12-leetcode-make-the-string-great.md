---
title: "[Algorithm] 1544. Make The String Great"
categories: [알고리즘]
tags: [leetcode]
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

<https://leetcode.com/problems/make-the-string-great/>

```python
class Solution(object):
    def makeGood(self, s):
        """
        :type s: str
        :rtype: str
        """
        for i in range(len(s)-1):
            if (s[i] != s[i+1]) & (s[i].lower() == s[i+1].lower()):
                return self.makeGood(s[:i] + s[i+2:])
        return s
```

<https://github.com/restato/Algorithms/blob/master/leetcode/make-the-string-great.py>