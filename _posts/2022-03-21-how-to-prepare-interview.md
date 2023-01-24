---
title: Interview 준비
categories: [면접]
tags: [interview]
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

* `Big-O concepts` — know how to look at a solution and evaluate its “Big-O” and know how to improve the “Big-O” of your solution.
  * [bigocheatsheet](https://www.bigocheatsheet.com/)
* Sorting and Searching - <https://www.geeksforgeeks.org/fundamentals-of-algorithms/#SearchingandSorting>
  * Linear Search vs Binary Search - <https://www.geeksforgeeks.org/linear-search-vs-binary-search/>
    * Know the most efficient type of search for the input given to the search.
    * 주어진 리스트가 정렬이 되어 있나요? (=Are the given values sorted?) 
    * 정렬이 되어 있다면:binary search [binary search](https://www.geeksforgeeks.org/binary-search/)
      * repeatedly dividing the search interval in half.
      * time complexity: O(Logn)
    * 아니라면: seaquencial search
      * time complexity: O(n)
  * Quick Sort, Selection Sort, Merge Sort, Heap Sort...

```python
# binary search
def binary_search(arr, l, r, x):
    if r >= l:
        mid = l + (r - 1) // 2 # 🔑 l + r 의 값이 int의 범위를 넘어가면 에러가 발생한다. maximum positive int value (2^31-1)
        if arr[mid] == x:
            return mid
        elif arr[mid] > x:
            return binary_search(arr, l, mid-1, x)
        else:
            return binary_search(arr, mid+1, r, x)
    else:
        return -1

arr = [2, 3, 3, 10, 40]
x = 10

result = binary_search(arr, 0, len(arr)-1, x)
```
  
* `Data structures` — at a minimum, make sure you know how to work with and are comfortable talking about Arrays, LinkedLists, Hashtables, Stacks, Queues and Binary Trees.
  * Binary Trees

### Object Oriented Design  - [#](https://www.freecodecamp.org/news/object-oriented-programming-concepts-21bb035f7260/)
  
* Understand how to conceptually break a program down into objects that work together to create a solution

The four principles of object-oriented programming are `encapsulation`, `abstraction`, `inheritance`, and `polymorphism`.

`Encapsulation`: is achieved when each object `keeps its state private inside a class`. Othere objects don't have direct access to this state. Instead, they can only call a list of pulbic functions

So, the object manages its own state via methods. you should use the method provided. You can't change the state.

Let's say we're building a tiny Sims game. There are people and there is a cat. They communicate with each other. We want to apply encapsulation, so we encapsulate all 'cat' logic into a Cat class. It may look like this: 

"state" of the cat is the `private variables`. We can only change private variable through public method.

`Abstraction`: Applying abstraction means that each object should only expose a `high-level mechanism` for using it. This mechanism should hide internal implementation details.

e.g., Cell phones are complex. But using them is simple. what's going on under the hood? We don't have to know.

`inheritance`: Objects are often very similar. They share common logic. But they're not entirely the same. So `how do we reuse the common logic and extract the unique logic into a separate class`? One way to achieve this is inheritance. It means that you create a child class by deriving from another parent class. This way, we form a hierarchy.

The child class reuses all fields and moethods of the parent class (common part) and can implement its own (unique part)

e.g., A private teacher is a type of teacher. And any teacher is a type of Person.

`Polymorphism`: means "many shapes" in Greek. we have a parent class and a few child classes which inherit from it. Sometimes we want to use a collection - which contains a mix of all these classes. Or we have a method implemented for the parent class - but we'd like to use it for the children, too.

This can be solved by using polymorphism.

Figure > Triangle, Circle, Rectangle.
methoc: calculate the surface for an element

```python
class Triangle(Figure)

  def calculate_surface():
    return a * b / 2

figure1 = Triangle()
figure2 = Circle()
figure3 = Rectangle()

figures = [figure1, figure2, figure3]
for figure in figures:
  figure.calculate_surface()
```

### System Design- please review attached documents

* scalable, reliable, cost optimal, and performant systems
* go ahead ask more questions
  * about the scale
  * about performance
  * about whether it needs an API

* Design example: Book Store
  * What kind of books? ebooks or regular book
  * How many user?
  * What your transactions per second
  * 

It's going to have: ~을 가질것이다. DB에서 설명할때 필드명
And so on.: 

* 질문해
* edge case가 어떤게 있을지
* input, ouput은 어떻게 되는지?
* comment를 적어라





* Think about all the use cases and capabilities within the design
i.      What is the output and work backwards.
ii.      Break out into components, figure out the inputs and outputs of each component keeping it decoupled.
iii.      How do the components talk to each other, synchronous calls and asynchronous calls and what databases will be used?
iv.      What are the components that work and those that don’t work?

We are assessing how you deal with ambiguity, your thought process and if you ask the right questions.


Some Sample Questions:

"Here's a string with numbers from 1-250 in random order, but it's missing one number. How will you find the missed number?"
"Describe what happens in your browser as soon as you hit enter after writing a URL in the address bar."
"How would you improve Amazon's website?"
"Design an online payment system."
