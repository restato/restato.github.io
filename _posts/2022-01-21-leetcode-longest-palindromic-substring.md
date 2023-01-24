---
title: "[Leetcode] longest-palindromic-substring Time Limit Exceeded 지옥"  
categories: [leetcode]
tags: [leetcode, algorithm]
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

<https://leetcode.com/problems/longest-palindromic-substring/>
<https://leetcode.com/submissions/detail/624631254/testcase/>
결국 풀지 못했고 다른 답을 참고해서 풀었다.


```python
class Solution:
    def longestPalindrome(self, s: str) -> str:
        candidates = {}
        index_dict = {}
        length = len(s)
        result = None
        max_length = 0
        if length == 1:
            return s
        for index1 in range(length):
            if max_length > (length - index1):
                break
            for index2 in range(length+1, index1+1, -1):
            # for index2 in range(index1+1, length+1):
                if max_length > (index2 - index1):
                    continue
                substring = s[index1:index2]
                substring_length = len(substring)
                
                i = 0
                j = substring_length - 1
                
                while True:
                    if j < i:
                        candidates[substring_length] = substring
                        if max_length < substring_length:
                            max_length = substring_length
                            index_dict[max_length] = {'start': index1, 'end': index2}
                            result = substring
                        break
                    if substring[i] != substring[j]:
                        break
                    i += 1
                    j -= 1
        print(index_dict)
        return result
```

```python
class Solution:
    def checkPalindrome(self,s, l, r):
        while(l>=0 and r<len(s) and s[l]==s[r]):
            l-=1;
            r+=1;
        return(r-l-1)
    def longestPalindrome(self, s: str) -> str:
        start = 0
        end = 0
        res = ""
        for i in range(len(s)):
            len1 = self.checkPalindrome(s,i,i)
            len2 = self.checkPalindrome(s,i,i+1)
            leng = max(len1,len2)
            if(leng>end-start):
                start = i-(leng-1)//2
                end = i+leng//2
                res = s[start:end+1]
        return(res)
```

<https://github.com/restato/Algorithms/blob/master/leetcode/longest-palindromic-substring.py>