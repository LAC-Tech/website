---
description: Must the gulf between supply chain professionals and software technologists remain forever vast?
image: https://lewiscampbell.tech/img/blockchain-36294b811c8b6a00.png
---

The more I read of what supply chain says of blockchain, the less I think they understand it.

## The core of Blockchain

I will set out to explain - as briefly as I can - the core of what blockchain is. There are blocks - which are just data. A block may link to another block. So long as the data in a block does not change from the time it is first made, a link to it will remain valid. If the data of a block is modified, deleted, or otherwise tampered with, the link will be invalid.

![Diagram illustrating blockchain](/img/blockchain-36294b811c8b6a00.png)

Each block may link to one other block, and that block can link to yet another, and so on - hence block *chain*. If any one link is broken in this chain - meaning if any block in the chain is altered - the blockchain split in twain.

Think of a hypothetical web page using this technology. This web page has a link back to the previous page. If that previous page is altered, the link no longer works.

And that is the core of what blockchain is. The blocks can hold any data. The links between them can represent anything. And the blockchain itself can be stored - and copied - anywhere. However writing from the SCM world embellishes this core - as we shall see.

## Blockchain according to HBR

To begin with we'll look at an article from the Harvard Business Review, entitled [Building a Transparent Supply Chain
](https://hbr.org/2020/05/building-a-transparent-supply-chain):

> "When blockchain record keeping is used, assets such as units of inventory, orders, loans, and bills of lading are given unique identifiers, which serve as digital tokens (similar to bitcoins). Additionally, participants in the blockchain are given unique identifiers, or digital signatures, which they use to sign the blocks they add to the blockchain. Every step of the transaction is then recorded on the blockchain as a transfer of the corresponding token from one participant to another."

Referring back to our definition, we see there's nothing inherent in blockchain that provides any of these benefits. Everything they listed - unique identifiers, digital signatures, recording every step of the transaction - is both possible and much faster with conventional databases.

## Blockchain according to Planet Tracker

Let's move on to [How Traceability in
Textiles Improves Financial
and Sustainability Performance](https://planet-tracker.org/wp-content/uploads/2022/06/Lifting-the-Rug.pdf). This is from Planet Track, which describes itself as "a non-profit financial think tank". To their credit, they have a much more restrained description:

> Blockchain databases are similar to traditional traceability databases; however, they create a decentralized, peer-to-peer network that connects all the stakeholders in a textile value chain – from farmers, designing houses, raw material suppliers, manufacturers, transporter, distributors, retail outlets to consumers."*

Planet Tracker at least sounds like it's on Planet Earth, but still attributes things to blockchain which are available elsewhere. There's no reason that a non-blockchain database cannot create a *decentralized, peer-to-peer network*. Nothing inherent in blockchain will help you create a *decentralized, peer-to-peer network*. Of course there are solutions utilising blockchain that can help you do this - but the blockchain aspect is incidental.

## Blockchain according to Deloitte

And now, to the darkest portion of this article, [Using blockchain to drive supply chain transparency
](https://www2.deloitte.com/us/en/pages/operations/articles/blockchain-supply-chain-innovation.html) by Deloitte. Trying to find useful data in this piece was like trying to find purchase while climbing a sheer wall of glass, or trying to sub-divide water with a knife. It just kept slipping by even as I worked at it.

> Imagine a world where you can replace the currently fragmented tracking of your supply chain with an interoperable solution, one that can significantly reduce the risk of unethical sourcing, shipping delays, inadequate storage, or ineffective distribution of your goods. Imagine a world where you can provide visibility into your supply chain to your customers and regulators and furnish irrefutable proof that you are meeting supply chain standards and expectations. And imagine a world, where, by addressing these considerations, you foster deeper trust and efficiency among all the stakeholders within your supply chain.

Here I no longer assume good faith and we enter the realm of fantasy. Imagine a world where cryptographic hashes linking blocks can make the sun shine brighter, chocolate taste sweeter, and make all cats and dogs fast friends. Needless to say Deloitte have embellished the capabilities of this technology for their own nefarious ends.

## Blockchain according to Reddit's /r/supplychain

And now a fact-finding technique so effective wikipedia had to outlaw it - original research. [Here's some responses from the supply chain subreddit when I broached the subject](https://old.reddit.com/r/supplychain/comments/17k9gxl/i_have_no_idea_what_this_industry_actually_hopes/):

These range from the jaded:

> What ppl think SCM's want: AI, Blockchain, IoT

> What SCM actually wants: for the love of fuck, can you please get this invoice paid before they delete our account — ChaoticxSerenity

> I would be more optimistic about blockchain if almost all companies were currently using EDI, a technology that’s 20 years old and still not widely used. —  scmsteve

> Blockchain is an energy-sucking Rube Goldberg machine. —  escapingdarwin

... to the curious:

> Isn't blockchain a safer way to store data? Years ago people were talking about it for food safety. Having logs of everything that has happened to a food product would greatly enhance traceability of bad batches. —  LodarII

...to the true believers

> Payments can easily happen via smart contracts — OMG_WTF_ATH

> The benefit of a blockchain over a simple log is what you mentioned - it doesn't require trusting a central party and is tamper resistant. —  FaithlessnessDull737

...and even the insightful

> All of the purported benefits of blockchain for supply chain can be done with existing technology. Cooperation is the issue, not the tech. — Comfortable-Owl309

> There’s loads of tech even less sophisticated than block chain that could make supply chain and logistics better, but the lack of standardization and the stubbornness of many hold outs prevents even complete electronic transactions. — Horangi1987

> The benefits of blockchain are most apparent when there is no trusted party in a system.... It's generally clearly a bad idea when there's a single trusted party or all partys are trusted. — YodelingVeterinarian

> Blockchains can have some useful applications in smart contract management and proof of storage for legal arbitration in transactional disputes but yes of course the impact is limited. — avirup2008

> Trustless data validation, ZKProof or zero knowledge proof is where I see the value.

> There are numerous instances in complex supply chains where actually sharing the data would be harmful to the competitiveness of a company, but if you have a way to say Yes / No without seeing the actual data across the board, it drives market efficiencies and transparency to the customer. — panthoreon

I learned a lot of from this - both regarding uses I was hitherto ignorant of, and also assumptions I did not know people had. But it's fair to say there's a lot of misunderstanding.

## Why is blockchain so misunderstood?

The chief reason, I would say, is this - the gulf between software technologists and supply chain specialists is vast. The landscape of supply chain software is marked by spreadsheet emailing, ancient legacy ERP systems, and printing things out so that it can be input by hand onto another system. This is repulsive to modern software professionals. Mention SPA to an SCM consultant, and he'll smile with glee. Mention SPA to a software developer, and he'll recoil in disgust.

As someone on the software side, I am not blameless. I recently found out there's such a thing as fifth party logistics. This surprised me. I had no idea that N-Party logistics space even had that many dimensions.

But the end result is that the gap between one who understands blockchain and one who understands the SCM at a broader level is likely multiple people. Can this gap be bridged? Would anyone in SCM, with their head-spinning from glossy articles, like to [talk?](/contact.html) I'll do my best on my side, and I look forward to seeing more people on the SCM doing the same.
