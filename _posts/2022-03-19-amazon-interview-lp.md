---
title: "Amazon Onsite Interview LP(Leadership Principles)"
categories: [면접]
tags: [amazon, onsite, interview]
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

[Leadership Principles STAR template.pdf](https://duaa2xs5z3ldn.cloudfront.net/assets/EH5MHfVk0f1VRWa0_LRX21Ro-EvUopwEW-LeadershipPrinciplesSTARtemplate.pdf) 에 맞춰서 미리 작성해보자.

### LP

* Earn Trust
* Deliver Results
* Customer Obsession
* Ownership
* Invent and Simplify
* Are right, A lot
* Learn and Be Curious
* Hire and Develop the Best
* Insist on the HIghest Standards
* Think Big
* Bias for Action
* Frugality
* Dive Deep
* Have Backbone; Disagree and Commit
* Strive to be Earth's Best Employer
* Success and Scale Bring Broad Responsibility

### LP 평가를 어떻게?

* behavioral-based
* about past expperiences, challenges you've faced
* how you've handled them
* what you learned from them

> your past behaviors are a great indicator for your future performance and success.

* "what" and "how" of your past experiences
* "why" of your decisions along the way

### 답변 준비를 어떻게?

* previous professional experiences, independent of the LP
* consider how you've applied the LP in those experiences.
* failure is a necessary part of innovation
* STAR method: situation, task, action, result
  * situation: provide context, background (describe a specific event or situation)
  * task: task that you needed to accomplish. consider quantitative and qualitative goals
  * action: describe the actions you took to address the situation. Use the word "I", not ~"we"~
  * result: describe the outcomes of your action (cost sacing, revenue generation, quality improvements.)
* [Earn trust examples](https://www.amazon.jobs/en/software-development-interview-prep?cmpid=ECOTOT700005B#/lessons/vtUiq3n_3lcfen59P5J5g9EOjUugaN0N)
  * Q. Tell me about a time when you uncovered a significant problem in your team. What was it and how did you communicate it to your manager and other stakeholders? What did you do to address the problem? How did you manage the impact of this problem for the rest of your team?
  * A.
    * (S) Whild troubleshooting a production issue, I found that my team logged senstive customer information for the past year. -> Taking responsibility for a shortfall (sensitive information logging)
    * (T) When I saw this, I pinged the team in our Slack channel, contacted our manager directly, and contacted our IT Security department. I also scheduled a war room meeting for the following morning to discuss the issue and next steps.
    -> Represents information transparently (engaged with the team and also with security, didn't try and hide anything)
    * (A) To prepare for the meeting, I created a slide deck explaining the issue, how we could fix it moving forward, and what strategies we had to deal with existing data. Then, I presented the issues during the meeting and asked for team feedback on my proposed solution for fixing things moving forward and the proprosed startegies for dealing with existing data. -> Honored commitments and tracked items to completion. Was transparent with the team, although the responded led efforts they were inclusive and asked the team for feedback and ideas
    * (R) Once we agreed on the approach, I worked with our manager to assign resources and added dates for task completion. I also owned the tracking of this overall program, provided daily status updates, and we were able to get everything done on time. -> No finger-pointing about who caused the issue, the focus was on getting it fixed.
  * Q. Give me an example of a tough or critical piece of feedback you received. What was it, and what did you do about it? 
  * A.
    * (S/T) I remember the first time I was asked to develop a feature with Java. I was a noiice with Object-Oriented Design(ODD) and new to the team, so I wanted to give a good impression. So I rewardched design patterns, and I applied several of them in the code and published a code review. I was super proud of it. The way I saw it, my code was beautiful, extensible, clean, and could cope with anything thrown at it. -> They wanted to build a good relationship with the team, as they were new, so they made an extra effort to produce a better solution
    * (A) Given that it was my first ODD solution, I asked serveral peers to review the code. After reviewing it, my team lead had a chat with me, asking me what my code intended to solve. They saw I overcomplicated the solution just to impress and recommended that I provide the simplest case for the requirements. As we spoke, they refactored my code, simplifying it. In less than 10 minutes & 15 lines, they produced a solution better than mine that was easier to understand by everybody else in the team -> They asked several people for feedback. They listened to their team lead feedback, recognized their mistake(trying to impress instead of focusing on the solution or maintainability of the code) and accepted it.
    * (R) It was a code jar of water thrown at me, but I learned the lesson, which has helped me in my career. Whenever I suspect I'm overcomplicating things, I take a step back and remember his words. I've applied this several times in my career, almost every day. Also, as you can see, I tend to overthink things, which I'm still working to improve with training and my mentor. -> The candidate later demonstrated that feedback and lessons learned stuck with them and applied them on other ocaasions. Without being asked, they acknowledge another mistake: they overthink things and demonstrated they are actively working to improve them.
* [Deliver results examples](https://www.amazon.jobs/en/software-development-interview-prep?cmpid=ECOTOT700005B#/lessons/vtUiq3n_3lcfen59P5J5g9EOjUugaN0N)
  * Q. Tell me about a time when you delivered an important project under a tight deadline. What sacrifices did you have to make to meet the deadline? How did they impact the final deliverable? What was the final outcome?
  * A.
    * (S) My team was under pressure to deliver a project in 6 months.
    * (T) Our initial technical estimations pointed out we needed three extra months to finish verything, so we decided we needed to cut things off, prioritize the critical paths or find ways to simplify the project. Given the features we had to implement couldn't be reduced in number, I did two things:
    * (A) I saw testing would take us more time, so I started seeing the feature prioritization and built a test plan for the project accordingly, Once I had it, I marked what tests we could postpone because they were repeated or checked at other levels (e.g., usability testing, because we were going to run end-to-end tests) or UI automation for certain features, as we were going to implement JS unit test cases. I also suggested reducing accessibility tests, running just a subsset of it for the first release, then the rest later. -> they tried to find ways of delivering the project on time with the right quality (focused on simplifying and removing already covered items)
    * (A) Whenever we had to implement a feature, I encouraged my team mates to think if we could reuse existing code or systems to simplify the implemenation, and reduce time. For example I remember we had to add a feature were customers can buy products in a physical store that are out of stock: they will pay them at the store and get them sent to their house. I realized we already had a feature that allowed customers to buy products in the physical store with coupons, we were later sending them the products. This flow fit nicely with that feature, we only had to implement a mechanism for customers to "buy the coupons" in the backgorund, when they come tothe cashier. This simplified development by several weeks. -> They commnucated and agreed to all simplifications with the projet owner.
    * (R) I checked both proposals with the project owner and acted as bridge between them and my team to share our progress and obstacles every week. We were able to deliver with only a one week delay (vs the estimated 12 weeks) without affecting the quality of the features we delivered. We ran the reamining tests and automation in another release. -> They decided to act as the bridge with the project owner and share the status of the project.
* Ownership example
  * Q. Tell me about a time when you took on something significant outside your area of responsibility. Why was it important? What was the outcome?
  * A.
    * (S/T) A couple of months ago I attended a business meeting, just to hear how our company was doing. They raised that the conversion rate between paid and free users was not as good as expected. As my team owns the front-end, I felt responsible for that space. Even though nobody asked me to do something about it, when the meeting finished, I tried to check if there was any technical exaplanation to it. -> They took ownership of a business problem related to their team domain, even though they weren't asked to look into the issue.
    * (A) I checked our customer metrics and Google Analytics, focusing on the difference between both flows. I realised that some particular flows and buttons that result in monetary benefits were not used at all by customers. I suspected the cause was the UI design's lack of clarity and proposed some UX changes to those flows. -> The candidate completed actions end-to-end. They took ownership of root causing, designing a proposal, convincing business, doing AB testing and release the change.
    * (R) I presented those proposals to the business with my justification, requesting to do an AB test to check if those would improve conversion. They accepted it. I ran the AB tests and saw that the conversion improved from 5% to 9% with one of the changes, so we deployed the changes.
* Learn and be curious example
  * Q. What is the coolest thing you have learned on your own that has helped you better perform your job?
  * A.
    * (S/T) I'm a backend developer. This example is not related to work that I had assigned on my team, but I got to experience something new because of my curiosity. We wanted to refactor one of our legacy applications (that included backend and front-end). My team already knew how to do that for the backend, but there were still discussions on the front-end team as to the best way to do it. So they scheduled a meeting to discuss it and opened it to everybody (even outside of their team). -> The candidate went beyond their day-to-day work to learn new technologies. Doing it in their free time and even using it to help other team select the best architecture for the refactor.
    * (A) Even though I didn't know anything about front-end, I decided it could be nice to participate, learn something new and help others improve as well. So I spent the previous week before the meeting learning about the existing architecture, front-end refactors in our company, and front-end technologies(expecially nodejs and react). I also saw another front-end reference architecture in our company, written in nodejs, was talking a lot of time to be deloped because they had to install a lot of npm dependecies. -> They went out of their comfort zone, learned new things(external technology and front-end architectures in the company) and applied them to practice.
    * (R) When the time to discuss arrived, the team proposed to use nodejs, as the refactor was going to be similar to the reference front-end architecture I checked. I explained the cons I saw, especially regarding deployment times, and proposed to use React. They didn't know about React, so I gave them a quick intro and a small demo of what we could do. They agreed to use Reactjs and offered me to be part of the front-end team for this refactor. I moved to work with them for a couple of months, and we successfully implemented it. It was great because I learned about front-end and React, and I was able to apply that knowlege to practice.
* Insist on the highest standards example
  * Q. Tell me about a time when you have been unsatisfied with the status quo. What did you do to change it? Were you successful?
  * A.
    * (S) Last year, I worked on a project that involved multiple teams and changes in various system that worked interconnected. Our dev environments have been typically unstable because we commit changes several times a day. But it wans't a big deal, as the environment was getting fixed within the day at max. However, at some point in our development, I realised this time was increasing. Not only that, given we were relying on features from other teams, we were being blocked by their dev environment failures as well, causing days and days of delays.
    * (T) reached out to other teams involved to see if they were facing the same situation and to our QA team, which was using our dev environment totest. And it was a big problem for all of them as well. So I proposed to create mocks with our dependencies in the lower environments, and once everything was stable, move to our integration stage and run our tests against real dependencies. If the integration environment is down, we should stop everything and go and fix it because that could block other teams.
    * (A) In the beginning, they pushed back. They thought that wasn't needed and it was too much work. We could assume the dev environment is not reliable and test in the integration one. I raised that it would be easier to detect issues with your feature earlier (at dev environment) rather than at the integeration environment, testing everything all together, and the mechanisms weren't so difficult to implement by the benefit they gave. -> The candidate didn't stick to the status quo but pushed back and found a solution to facilitate development and testing in all teams, unblocking everybody and reducing delays.
    * (R) I created a sample of mocks for our team, and I also realised these mocks could help us identify issues between the contract of our services. I demoed it, tlaked to all teams, and paid attention to the adoption of the mocs in all four teams and the environment stability issues for a month. As a result, development issues in dev were reduced to a couple of hours. QA started to test earlier, and we identified at least 10+ bugs related to API integerations between our services since each of the teams had to talk to each other to extended the mocks when they were impelmenting changes in the boundaries of their services. -> The candidate worked to improve processes in their team and extended it to other teams involved -> The candidate oversaw the implementation from end to end, as they supported other teams to implement the mocks and gathered metrics to see the improvement worked well.
* Have backbone; disagree and commit example
  * Interviewer: Describe a time when you felt strongly about something on a project, but the team decided to go in a different direction.
  * Candidate: Alright. In my company, they are used to work in a waterfall process, taking several months to release the software. But last year, I was assigned to a project to create an Android app for a client, and the business and project management team decided they wanted to follow the usual waterfall approach. And I disagreed with them. From my past experience building apps, I thought building first an MVP (minimal viable product), meaning having smaller releases, sharing them with the client, and getting feedback, will work better. Both for the client and for my team to minimise the risks and see the impact early on. I pushed back to leadership in 3 different ways:  1) I raised it in an informal way during an internal meeting, explaining what agile was and the benefits it gave (no buy-in from the business, but buy-in from the tech team). 2) On a project planning meeting where I had to present the roadmap for releases, I presented a plan with both approaches (waterfall and agile), sharing pros and cons and demonstrating that agile approach would help us to deliver the critical features earlier. They didn't buy this again. And they were concerned that if we give clients the critical features first, they wouldn't want the rest. 3) I gave a presentation at our internal conference. Even with that, they still didn't agree as they were concerned about giving the features to the clients one-by-one. So, I stayed with the original approach from the first release. When we released it, the client had a lot of feedback - they did not like the app. Leadership changed their minds and wanted to be agile, and I had a plan ready on how to implement agile releases for the next iteration of the project.
  * Interviewer: That's great that you were able to use the agile approach for the next iteration. Initially, how did you approach the project after leadership didn't accept your proposal?
  * Candidate: It affected me, but I understood this is a big change. They are used to working in waterfall for so many years, and they don't have experience with it, so it is normal to be afraid. I committed to the delivery and worked as expected. But given the only piece they ended up disagreeing with was releasing the software, I still followed an agile approach while planning (meaning sprints, retros, demos to business), coding/testing and deploying to lower environments with my team.

### Reference

* https://www.amazon.jobs/en/software-development-interview-prep#/
