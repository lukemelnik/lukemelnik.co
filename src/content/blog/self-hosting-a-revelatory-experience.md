---
title: "Self-Hosting: A Revelatory Experience"
description: "I had an epiphany about failing while learning."
publishDate: 2024-07-16
tags: ["thoughts", "development", "learning"]
---

As I SSH’d into my server to make a fix, I had an epiphany. In my coding journey, I’ve learned way more from things going wrong than when they go right.

That might not be news to you, but as a recovering perfectionist, it’s a revelation. I’ve often wrapped up my identity with the outcomes of my work. One of the best parts of my coding journey has been that it forced me to embrace unknowns, unknown unknowns, and the mistakes that come along with filling in the gaps.

I have an unscientific theory about how the brain learns, likely informed by random bits of reading that I’ll try to reference at some point. The TLDR: the subconscious mind needs enough motivation for ideas to stick. The harder something is, the less we want to do it, but the more we push through, we send a stronger signal to the brain that this actually is important to our survival. The long version:

## The Beauty of Our Subconscious Filter

The subconscious brain is an incredible filter. If you don’t agree, just look at what happens when it’s malfunctioning. Someone with hypersensitivity has a hard time interacting with the world because they’re overwhelmed with the inputs. Their experience is like a sensory stack overflow, with so many incoming signals at the same volume that it’s impossible to process.

Just look around you right now and consider all the things your conscious brain is ignoring. I’m sitting at a table outside. Aside from the complex sonic texture of the wind, there are birds, insects, dripping water, and cars. Beyond my computer screen, phone, and coffee cup, there are endless objects with their own little worlds of complexity. Internally, there are thousands of signals from the body that go unnoticed—the temperature of my big toe, for instance.

Meditation is a great way to explore all these sensations and get a more ‘accurate’ view of reality—but for the most part, we’re still alive as a species because of our ability to ignore most of these sensations and focus on the important ones.

## When the Filter is Bad

Like all things, balance is the key. Our filter helps us to focus, but it also makes it hard to learn. Our subconscious brain is focused on survival, so if it can’t see the immediate benefit in something, it’s not going to waste valuable energy on it. Which is why it can be so hard to learn new things. There’s a lot of wisdom in high school students asking, ‘_when will I ever use this?_’. In order for something to stick, we have to convince the brain that whatever we’re doing is important for survival.

The funny thing is that our conscious brain really wants the information to go in there. But that’s not who decides what sticks. The conscious brain just decides what to work on; it decides to sit down and practice.

## Why Problems are Good

A common question from people learning to code is ‘how do I escape tutorial hell?’ And the right answer, though it’s not what we want to hear, is ‘stop using tutorials’. I think they’re an amazing way to get started and understand what’s possible, but I noticed from my own experience that they only give you the illusion of learning. I believe it’s called ‘passive’ vs ‘active’ learning.

I can actually feel the difference between a line of code that I manually typed out and one that was copied and pasted in. This might be a bit weird, but it’s as if the manually typed one has form and texture, while the pasted one is vague and transparent. It’s a bit better if I’ve taken the time to truly understand what it’s doing, but even then, it’s nowhere near as effective as if I tried to figure it out myself. And why?

Because usually if I try it out myself, it doesn’t work the first time. That sounds annoying, and it is. But it’s the key to learning. When you’re following along with someone else, they’ve taken the time to make sure all the code works before they make their well-produced tutorial. You’re following along, but everything is going smoothly, so your brain says, ‘okay, cool, all safe here, I’ll go on autopilot’, putting the ‘passive’ in passive learning. But when something goes wrong, it wakes up.

When something doesn’t work, we have to spend more time on it. Time spent is one signal to the brain that this is important. When we push through the discomfort and try to solve the problem, that’s a new signal. ‘Wait, this hurts and you’re still going to do it??’ says the brain. ‘Yeah,’ we say. The more mental resources you throw at it, the bigger the signal that it’s important for your survival.

Not only that, but when you do that repeatedly, the brain says, ‘FINE. So if we’re going to keep doing this, then I guess I’ll just get really efficient at it’. Now you’re on the path to mastery. I think that true skill, as we see it externally, is the result of processes becoming subconscious, and the first step is convincing the brain that it’s worth optimizing.

## Going Deeper

Beyond convincing the brain to do its job, problems encourage us to dive deeper. When I first decided to self-host my site, I had no clue how to start. I started with a bird’s-eye view of how to accomplish it, but it wasn’t until I got into the weeds that it all started to click. Here’s how it worked in practice:

1. I set up the VPS. Encountered SSH. I’d used it to push to GitHub but hadn’t developed a deep understanding. Now I’m way more comfortable with it.
2. Installed Coolify. Realized I had no clue how Docker works. That made me feel icky, so I did a deep dive. Now I know how to use it to make my development process way more efficient and, in the process, had to get a deeper understanding of how TCP ports work.
3. Uploaded a test site, but it didn’t work the first time. Had to look up how DNS works, set up subdomains, and figure out how web server software works. Had to get more comfortable with Cloudflare because the settings were causing a redirect loop. Now I have a way deeper understanding of how the internet works.
4. Tried to build my portfolio app, but it kept crashing the server. Figured out how to scale up the server resources.

I’m sure there were more, but the point is that whenever I encounter a problem now, I’m grateful that I can consider it a teacher and not an obstacle.
