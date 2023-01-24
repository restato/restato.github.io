---
title: "[Algorithm] Merge two sorted linked lists"
categories: [알고리즘]
tags: [algorithm, linkedlist, sort, merge]
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

<https://www.educative.io/m/merge-two-sorted-linked-lists>

### 문제

Given two sorted linked lists, merge them so that the resulting linked list is also sorted.

### 풀이

* `two sorted linked lists`: 이미 정렬된 두개의 list
* 두개의 리스트 중에 하나가 None인 경우는 다른 리스트를 return
* mergedHead를 어떤 리스트로 해야할지 결정
* 두개 리스트에서 큰 값을 리스트에 추가
* 남은 리스트를 뒤에 붙여준다.

### 코드

```python
def merge_sorted(head1, head2):
  # if both lists are empty then merged list is also empty
  # if one of the lists is empty then other is the merged list

  # ⚠️ edge case 주의
  if head1 == None:
    return head2
  elif head2 == None:
    return head1

  mergedHead = None
  if head1.data <= head2.data:
    mergedHead = head1
    head1 = head1.next
  else:
    mergedHead = head2
    head2 = head2.next

  mergedTail = mergedHead

  # 🔑 
  while head1 != None and head2 != None:
    temp = None
    if head1.data <= head2.data:
      temp = head1
      head1 = head1.next
    else:
      temp = head2
      head2 = head2.next

    mergedTail.next = temp
    mergedTail = temp

  # 남은 list 를 뒤에 붙이도록
  if head1 != None:
    mergedTail.next = head1
  elif head2 != None:
    mergedTail.next = head2

  return mergedHead

array1 = [2, 3, 5, 6]
array2 = [1, 4, 10]
list_head1 = create_linked_list(array1)
print("Original1:")
display (list_head1)
list_head2 = create_linked_list(array2)
print("\nOriginal2:")
display (list_head2)
new_head = merge_sorted(list_head1, list_head2)

print("\nMerged:")
display(new_head)
```

<https://github.com/restato/Algorithms/blob/master/Sort/merge_two_sorted_linked_lists.py>

### 정리

* Runtime Complexity: Linear, O(m+n), m, n은 linked lists의 길이
* Memory Complexity: Constant, O(1)
