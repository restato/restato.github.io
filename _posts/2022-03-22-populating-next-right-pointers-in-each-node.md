---
title: "[Algorithm] Populating Next Right Pointers in Each Node"
categories: [알고리즘]
tags: [leetcode, algorithm, tree, binary-tree, bfs, dfs, traversal, level-traversal]
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

<https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>

### 문제

You are given a perfect binary tree where all leaves are on the same level, and every parent has two children. The binary tree has the following definition:

struct Node {
  int val;
  Node *left;
  Node *right;
  Node *next;
}
Populate each next pointer to point to its next right node. If there is no next right node, the next pointer should be set to NULL.

Initially, all next pointers are set to NULL.

### 풀이

* `perfect binary tree`
* `level traversal`
* `DFS`
* `BFS`
* 여러가지 방법으로 해결할 수 있지만 DFS를 사용하는게 가장 깔끔

### 코드

```python
"""
# Definition for a Node.
class Node:
    def __init__(self, val: int = 0, left: 'Node' = None, right: 'Node' = None, next: 'Node' = None):
        self.val = val
        self.left = left
        self.right = right
        self.next = next
"""

class Solution:
    def connect(self, root):
        if not root: return None
        
        L, R, N = root.left, root.right, root.next
        if L:
            L.next = R
            if N: R.next = N.left # 🔑
            self.connect(L)
            self.connect(R)
        return root
```

* <https://github.com/restato/Algorithms/blob/master/Tree/populating-next-right-pointers-in-each-node(bfs).py>
* <https://github.com/restato/Algorithms/blob/master/Tree/populating-next-right-pointers-in-each-node(dfs).py>
* <https://github.com/restato/Algorithms/blob/master/Tree/populating_next_right_pointers_in_each_node(level).py>

### 정리

* time complexity: O(N)
* space complexity: O(logN), recursive stack. The maximum depth of recursion is equal to the height of tree which in this case of perfect binary tree is equal to O(logN)

### 참고

* <https://www.geeksforgeeks.org/tree-traversals-inorder-preorder-and-postorder/>
* <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/discuss/1654181/C%2B%2BPythonJava-Simple-Solution-w-Images-and-Explanation-or-BFS-%2B-DFS-%2B-O(1)-Optimized-BFS>