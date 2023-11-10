---
title: A Sheep Ate My Internet
type: article
description: The reality of rural internet for software development
image: https://lewiscampbell.tech/img/AngusCropped.jpg
---

It was May, 2021. I was living on a farm in rural New Zealand (total ag-tech immersion). It was beautiful, even the internet was decent... until this scoundrel chewed through the cable connecting me to the satellite dish.

![Large white ram looking up](/img/AngusCropped.jpg)
*[Angus the sheep](https://www.instagram.com/angus.the.sheep/), defending himself against accusations.*

I was now offline.

## Agricultural Web Users

A lot of people have connectivity issues in rural areas - and thanks to this ravenous ram I became one of them. Sure they'll have internet at the farmhouse, and it may even be decent. But many areas have no effective mobile coverage at all - once you're outside the range of the WiFi router it's game over. (I was half an hours drive from 2G mobile internet when this happened).

So if you're in ag your customers may be offline, online, or in that insidious packet-dropping border region in-between. This is not something mainstream web dev really considers - and fair enough. Most software is written by people in air-conditioned offices for other people in air-conditioned offices. If you have ubiquitous fast internet and 4G mobile as a backup, these edge cases don't merit much attention.

But agriculture is different. For one thing, your typical "modern" SPA with multiple megabytes of ECMAScript is going to take an eternity to load (if it even does). Hitting API end points returning mountains of JSON with `very_descriptive_field_names` makes matters worse. And as for third party tracking scripts - there's going to be nothing to track as your users give up in frustration.

## Designing around Limited Bandwidths

So, what's the solution?

With slow connections, recognise you're in a **constrained environment**. You can't use all your favourite front-end toys, or send data for the hell of it. [Bundlephobia](https://bundlephobia.com/) is your new best friend, as is the network throttle in dev tools. Your app needs to be lean and mean - which means so does your `package.json` (if it even makes sense to have one).

That covers bad connections - but what about no connections?  For read-only apps, service workers will solve a lot of your problems. But if your customers are inputting data - welcome to the world of conflicts. If your app instances are writing data independently from each other, then you're writing a distributed system.

In this case, the most important thing is to **accept that conflicts will happen**, and you have to deal with them. A lot of software claims to "solve" this problem for you. The solution is usually last-write wins - which customers tend to interpret as "randomly losing my data". So make sure your software is aware of conflicts, and can either resolve them automatically (i.e, CRDTs) or surface them to the user.
