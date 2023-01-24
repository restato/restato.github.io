---
title: "[Algorithm] Level Order Traversal of Binary Tree"
categories: [알고리즘]
tags: [algorithm, binary, tree]
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

<https://www.educative.io/m/level-order-traversal-binary-tree>

### 문제

Given the root of a binary tree, display the node values at each level. Node values for all levels should be displayed on separate lines. Let’s take a look at the below binary tree..

### 풀이

* binary tree traversal
* level order
* `deque`

### 코드

```python
# Using two queues
def level_order_traversal(root):
  if root == None:
    return

  queues = [deque(), deque()]

  current_queue = queues[0]
  next_queue = queues[1]
  
  current_queue.append(root)
  level_number = 0

  # 🔑
  while current_queue:
    temp = current_queue.popleft()
    print(str(temp.data) , end = " ")

    if temp.left != None:
      next_queue.append(temp.left)

    if temp.right != None:
      next_queue.append(temp.right)

    if not current_queue:
      print()
      level_number += 1
      current_queue = queues[level_number % 2] 
      next_queue = queues[(level_number + 1) % 2]
  print()
  
arr = [100,50,200,25,75,350]
root = create_BST(arr)
print("\nLevel Order Traversal:\n", end = "")
level_order_traversal(root)
```

<https://github.com/restato/Algorithms/blob/master/Array/find_the_missing_number_in_the_array.py>

### 정리

* Runtime Complexity: Linear, O(n)
* Memory Complexity: Linear, O(n)
