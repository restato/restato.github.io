---
title: Amazon interview private zone
categories: []
tags: []
mermaid: true
math: true
comments: true
pin: false
hidden: true
image:
  path:
  width:
  height:
  alt:
---

[Leadership Principles](https://www.amazon.jobs/en/principes)
* <https://jinesh.codes/blog/ace-amazon-lp-questions/>

### STAR Method

* Situation
  * What was the context/background for the situation you were in?
  * Where did it occur, when did it happen?
  * What was the goal?
* Task
  * What was your role?
  * What were you trying to achieve?
  * Why was it important?
  * What were the risks/consequences if nothing happened?
* Action
  * What did you personally own?
  * How did you do it? How did you influence the outcome?
  * Who else was involved?
  * What was the most significant obstacle you faced?
* Result
  * How did you measure success for this project?
  * What results did you achieve? (e.g., metrics)
  * What trade-offs did you have to make to achieve this?
  * What did you learn or would have done differently?

### LP questions

> Tell me about a time when you gave a simple solution to a complex problem. (Invent and Simplify)
> Tell me about a time where you were criticized(비판) and how you handled it.
> Why do you want to work for Amazon and why this is the right time?(= Why Amazon.)
> Tell me a time where you missed a deadline.
> Tell me a time when you had a different view with the manager.
> Tell me about a time where you helped a peer who was struggling.
> Dive deep. Specific question: Tell me about a time where you had to dig deep to find out a bug/problem. Explain what you did and how did you fix it.
> Tell me a time where you had to contemplate between code quality and faster velocity.
> Details of my latest project.
> My typical day at office.
> If I had a conflict and how did I resolved it.
> How much do I face customers.
> Did I solved any time critical issue and what was the approach/impact.
> Why applying for SDE1 with 10+ years of experience. Though 2 of the interviewers were in SDE role while they were senior like me and according to them, in Amazon it doesn't matter
> If any decesion I had taken, gone wrong and what would I would like to change if I get another chance.
> Tell me about yourself
> Time when you disagreed with manager
> Time when you were not satisfied with your work
> A suggestion you gave in your organisation
> Time when you did something beyond your work
> Time when you were 75% of the way through a project, and you had to pivot strategy — did you suceed or fail
> Time when you had a complex problem, how did you solve it

### Coding

* <https://leetcode.com/problems/merge-k-sorted-lists/>
* <https://leetcode.com/problems/unique-paths/>
* <https://leetcode.com/discuss/interview-question/algorithms/124715/amazon-is-cheese-reachable-in-the-maze>
* <https://leetcode.com/problems/longest-substring-without-repeating-characters/>
* <https://leetcode.com/problems/lru-cache/>
* <https://leetcode.com/discuss/interview-question/369272/Amazon-or-Onsite-or-Linux-Find-Command> 🔑
* <https://leetcode.com/problems/my-calendar-i/>
* <https://leetcode.com/problems/word-break/>
* <https://leetcode.com/problems/word-search/>
* <https://leetcode.com/problems/gas-station/>
* <https://leetcode.com/problems/populating-next-right-pointers-in-each-node/>
* <https://leetcode.com/problems/making-a-large-island/>
* <https://leetcode.com/problems/climbing-stairs/>
* <https://leetcode.com/problems/add-two-numbers-ii/description/>
* <https://leetcode.com/problems/valid-sudoku/>
* <https://leetcode.com/problems/the-skyline-problem/>

### System Design

* Design a book retail website
* Design an online ticketing system for movies (=Design bookMyShow)
* Design a recommendation system for Amazon e-commerce website

### Reference

* <https://leetcode.com/discuss/interview-experience/597078/amazon-virtual-onsite-seattle-sde-ii-april-2020-reject>
* <https://leetcode.com/discuss/interview-experience/598736/Amazon-or-SDE1-or-Luxemburg-or-April-2020-Reject>
* <https://leetcode.com/discuss/interview-experience/568757/amazon-sde1-apr-2020-offer-virtual-onsite>
* <https://www.geeksforgeeks.org/how-to-prepare-for-amazon-software-development-engineering-interview/>
* <https://jinesh.codes/blog/amazon-interview-experience/>
* <https://leetcode.com/discuss/interview-experience/1456490/amazon-sde-2-virtual-onsite>
* <https://leetcode.com/discuss/interview-question/1253358/Amazon-or-Virtual-Onsite-or-SDE-I-Reject-(April-2021)>

* Fulfilling requirements
  * Create a design for a system that fulfills captured requirements (e.g., constraints, scalability, maintenance)
* Designing for performance
  * Design for operational performance and plans for failure and can measure the results (e.g., metrics)
* Identify shortcomings
  * Identify potential shortcomings and tradeoffs with different design (e.g., performance, fault, tolerance, dependencies)
* Software design at Amazon
  * scaling is a crticial compontent
    * caching, load balancing, non-relational databases, micro services and sharding
  * Falut tolerance translates to the "Customer Obsession" Leadership principle
    * Frugal(절약하는) redundancy is paramount(최고의) to our success

* What makes this a strong system design?
* his response shows more strength criteria such as:
  * Designs for operational performance, plans for failure, and measures the results (e.g., metrics)
  * Considers both technical and business metrics, as well as data quality
  * Thinks about how to monitor for performance and catch potential problems
  * Considers resiliency and making things easier for operators

* Logical and maintainable
  * Code shows breaking functionality into separate functions and classes rather than a monolithic implementation.
  * The use of an enum helps consistency and provides an idiomatic way for users of the code to specify parameters.
  * A class structure makes the addition of new filters, even by those who don't have access to the source code easy.
  * Code is easy to read. Classes and member variables are descriptive enough to know what they represent without being verbose.

* Projects
  * 자신이 했던 프로젝트에 대해 소개 20min
* Algorithm
  * traversals: BFS, DFS
  * Binary search tree data
  * BFS: https://leetcode.com/problems/word-break/
    * https://leetcode.com/problems/word-break/discuss/43797/A-solution-using-BFS
  * 자신을 제외한 배열의 곱을 계산해라 (단, 나누기는 사용할 수 없음)
  * redundancy, partitioning, caching, indexing, load balancing, and queues 용어 및 설명
  * explain the benefit, operations, and time complexity
  * dictionary, map
    * insertion: O(1)
    * lookup: O(1)
    * By using the hash value of the key to address into an array. By taking the modulus of the hash, you are able to find the index in the array to strore the value
    * Hash collisions can occur. There are a few different ways you can solve this Open addressing looks through the array for the next oepn slot and adds the element there. Chaining means every element in the array is actually a linked list, and once you find the index, you can search thorugh the linkd list to see if the kye you are looking for is in that list.
    * best case, it's O(1) , but it could be O(N) in the worst case
* System Design
  * create a diagram
  * Considering additional factors such as performance and scaling
  * TinyURL: shorten that long URL into a tiny URL

* Topic to review:
  * software systems need software components something to store data, something to make decision(such as business logic) and APIs or process
  * distributed systems, SOA, and n-tiered software architecture is very important in answering systems design questions

* The goal is a design in production with considerations of deployment, scaling, failures, availability, and performance
* latency and concurrency
* Interview 4: Questions about project for about 20 minutes. Given a list of inputs in the form of a string array, for example [["Item: Bread", "Id:1"], ["Item: Meat", "Id:3"], ["Item: Sauce", Id:2], ["Item: Bread", "Id:4"]], we need to arrange the input string in order and output the result. The interviewer aid do not worry about parsing the string. I gave the solution of sorting based on Id and then getting the result. It was very unclear what the interviewer was expecting. Also, I made the mistake of having only screen, and the interviewer said he was nodding to my questions, and I was writing code in another window. This was a very uncomfortable interview.

### System design Scripts

* Q & A
  * 


Interviewer: Alright, now that you've had some time to review this ads scenario, I'm interested to learn how you would monitor this solution?

Candidate: There are some baseline technical metrics that we could monitor such as CPU and memory utilization for the hosts or processes that are executing our workflow (e.g. if we were using Spark jobs or something similar). We should also emit metrics on workflow success/failure. This can start out granular but we should also be able to emit these for each workflow step in order to identify if there are particular steps that have errors or are less reliable. Timing metrics, per workflow and per overall step, would also be important here so that we can catch any performance degradation early. We should also look at business metrics and data quality metrics. For example, if we processed an unexpected number of records (too many or too few) that could be something an operator needs to look into. We should consult with our business users on what kind of quality metrics are important for them, as they may be closer to the data or have a better understanding of what certain fields mean and what their expected values are.

Interviewer: Thanks for walking me through those examples. I agree capturing both technical and business metrics is important. You also mentioned having someone look into issues. How would you report and respond to failures or issues?
Candidate: Well, we could send notifications or reports (for example, via email) for someone to investigate. I've seen in past sometimes workflows can have intermittent failures, so we could also configure retries and only alarm if all retries are exhausted in order to prevent noisy work for our operators.

### Scripts

Candidate: How many items should we show? The top one or the top 10?
Interviewer: Let's say top 10.
Candidate: Are we showing the top items for all time, or are we doing it for a certain time period, like a day?
Interviewer: Let's say for the last hour.
Candidate: I'm thinking of storing all the items purchased for the last hour and then calculating the top items based on that. Can I store them somewhere like a database?
Interviewer: Let's say that we can't provision any database infrastructure for this.
Candidate: How many items are purchased per hour? If we have a lot, then maybe we can't store them all.
Interviewer: Let's assume for this that we have enough memory. 

Candidate: How reliable is the service that sends us purchases? Does it send them in order? Do we have any risk of missing data or data arriving more than once? 🔑

Interviewer: Um, let's assume that the service is reliable - it delivers in order and with "only-once" delivery with no missing data.
Candidate: Ok. If we have enough memory, I think we can store all the purchased items, and then, when we have to generate the widget, we can calculate the top items. We should also delete old items so that we can minimise memory usage.
Interviewer: When would you delete the old items?
Candidate: I think we can do it when we receive new items.
Interviewer: Ok. Any drawbacks with that approach?
Candidate: I guess if we didn't get anything purchased in an hour, then we wouldn't clear anything. In that case, we could clear it when the widget is generated. We would have to be careful of multiple requests to generate the widget so that multiple threads wouldn't try and delete records at the same time.