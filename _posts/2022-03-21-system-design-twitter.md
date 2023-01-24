---
title: System Design Twitter
categories: [시스템디자인]
tags: [system design, twitter]
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

* interviewers really want is **high-level ideas** about how you will solve the problem.
* how you define the problem
* how you design the solution
* how you anlysis the issue step by step are truly important
* [8 Things You Need to Know Before a System Design Interview](http://blog.gainlo.co/index.php/2015/10/22/8-things-you-need-to-know-before-system-design-interviews/)

### Define the problem

* making problem clearer and more concrete
* only design core features of Twitter instead of everything.
  * the whole product should allow people follow each other and view others feeds.
* registration, moment, security is out of the scope

### High-level solution

* don't jump into all the details immediately
* to divide the whole system into several core components
  * frontend/backend, offline/online logic
* following two things:
  * Data modeling:
    * define user object and feed object
    * releations are also necessary
  * How to serve feeds
    * way is to fetch feeds from all the poeple you follow and render them by time.

### Detail questions

* Q. When users followed a lot of people, fetching and rendering all their feeds can be costly. How to improve this?
* A.
  * infinite scroll feature, to fetch the most recent N feeds instead of all of them.
  * consider cache, which might also be helpful to speed things up.
* Q. How to detect fake users?
* A.
  * features(e.g., registration date, the number of followers, the number of feeds), build a machine learning system to detect if a user is fake
* Q. Can we order feed by other algorithms?
* A. (should clarify)
  * How to measure the algorithm?
    * by the average time users spend on Twitter
    * users interaction like favorite/retweet.
  * What signals to use to evaluate how likely the user will like the feed?
    * Users relatio nwith the author, the number of replies/retweets of this feed,
* Q. How to implement the @feature and retweet feature?
* A. We can simply store a list of user IDs inside

### Trending Topics

* Clicking each topic will direct you to all related tweets
* high-level approach first
* two subproblems:
  * How to get trending topic candidates?
    * the most frequent hashtags over the last N hours.
    * the hottest search queries.
    * the recent most popular feeds and extract some common words or phrases
  * How to rank those candidates?
    * rank based on frequency
    * reply/retweet/favorite numbers, freshness.
    * personalized signals like whether there are many follows/followers talking about the topic.

### Who to follow

* How to scale the system when there are millions/billions of users?
* How to evaluate the system?
* How to design the same feature for Facebook (bi-directional relationship)

### Moments

* show you a list of intersting topics for different categories

### Search

* [How Do Search Engines Work?](https://www.makeuseof.com/tag/how-do-search-engines-work-makeuseof-explains/)
* build indexing, ranking and retrieval.

### Reference

* <https://gist.github.com/vasanthk/485d1c25737e8e72759f>
* <http://blog.gainlo.co/index.php/2016/02/17/system-design-interview-question-how-to-design-twitter-part-1/>
* <http://blog.gainlo.co/index.php/2016/02/24/system-design-interview-question-how-to-design-twitter-part-2/>