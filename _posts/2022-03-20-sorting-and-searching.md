---
title: Sorting and Searching
categories: [알고리즘]
tags: [sorting, searching, algorithm]
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

### Sorting and Searching

* `Searching`: The processes of looking up a particular data record in the database
* `Sorting`: The process of ordering the records in a database

### What is Searching?

* requires a key field such as name, ID, code which is releated to the target item
* algorithms
  * Linear search: sequential search
    * time complexity: O(n)
  * Binary search 🔑
    * data list must be ordered list 🔑
    * time complexity: O(logn) or O(n)
    * [code](https://www.tutorialspoint.com/python_data_structure/python_binary_tree.htm)
  * Interpolation search: improvement of binary search
    * probing position of the required item 🔑
    * time complexity: O(log(logn))
  * Hash table: O(1)

### What is Sorting?

* Optimize data searching to high level
* algorithms
  * bubble sort: O(n^2)
    * not suitable for huge data sets.
  * insertion sort: O(n^2)
  * selection sort: O(n^2)
    * not suitable for huge data sets.
  * quick sort: O(n^2)
  * merge sort 🔑 : O(nlogn)
    * based on divide and conquer rule
    * [code](https://github.com/restato/Algorithms/blob/master/Sort/merge_sort.py)
  * shell sort: O(n)

### Referecne

* <https://msatechnosoft.in/blog/searching-sorting-data-structure-algorithms/>
* <https://www.tutorialspoint.com/python_data_structure/python_binary_tree.htm>