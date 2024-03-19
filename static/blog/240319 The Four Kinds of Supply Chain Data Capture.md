Most of my tech career has been in and around the supply chain; from procurement to operations, from traceability to manufacturing. I've seen many different ways of getting data into systems, some simple, some complex, some ingenious and some horrifying. But I believe all these ways fall into four categories, and that these categories are understandable to both business and technical stakeholders.
## The Four Kinds
We'll start from the top, here are the four kinds of supply chain data capture:

So from this, we have our four kinds:

- Manual, Indirect
- Manual, Direct
- Automatic, Indirect
- Automatic, Direct
  
But we also have two kinds of data:

- Inside Data
- Outside Data
  
Let's dive into these definitions.
## Inside Data & Outside Data
First imagine your own data system. This might be an ERP, TMS, WMS, your own custom database, or even a SaaS product. It's where data exists in a state where it can provide some value to your organisation; something from which forecasts, analysis, notifications etc can be derived.

Any data first captured and recorded in a format your data systems can work with is *Inside Data*. It has a more or less rigid shape, understandable to your systems, and is owned and managed by you.

By contrast, the shape of Outside Data is not the same as what's in your data systems. This is the bread and butter of many supply chain companies. Outside Data comes in as documents, spreadsheets & scanned images. These represent purchase orders, consignments and declarations, and are sent hither and thither as email messages, direct messages & shared files. It usually arrives in a shape that you do not control, and may not be equipped to deal with.

Outside and Inside are not relative to your organisation; they simply refer to data originally captured in the same data formats you use in your own data system. You can create Outside data internally, and Inside data externally, as we shall see.

(My spark of inspiration came from the concepts of "Data on the Outside Inside" & "Data on the Outside" by Pat Helland, first coined in 2005 and later [distilled in 2016](https://queue.acm.org/detail.cfm?id=2884038), though I've taken it in a slightly different direction.)
## Indirect, Direct, Manual & Automatic
No we move onto data capture. First off, let's define "data capture" as simply acquiring inside data.

First we ask - is any Outside Data involved in this process? If there is, we call this indirect. If not, if there are no intermediate steps, then we call it direct.

Secondly, we ask - is there a human being needed in this process? Does this come into a system due to someone manually typing or clicking? If yes, we call it manual. If not, we classify it as automatic.
## Examples & Characteristics of the four kinds

### Manual, Indirect
The supply chain classic. Get an email with an attachment (Outside Data), print it out, and type it in manually into the system. Slow, and error prone, and expensive.

Fixing this is ground zero in supply chain digitization.
### Manual, Direct
Data is entered manually, but it comes directly into your data system, not through a middle man. A great example of this is a customer ordering through an e-commerce site integrated 
### Automatic, Indirect
Something less often seen, but a powerful technique. Outside data is automatically collected into a secondary database, processed, then loaded into your main data systems (the more technical among you will recognize this as an [ETL](https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl) process).

This can be a pragmatic choice when fully digitizing the 'edges' of your system is impractical, say when suppliers or customers insist on sending you data in their own formats.

A note here on data quality. We could introduce another axis here, representing how structured the data is, from "completely digital and specified file in standardized format" to "off center photocopy of a doctors handwriting". Increasingly machines can use AI techniques for the latter, but this is more brittle, more complicated and dramatically slower than having a machine reading a format it knows.
### Automatic, Direct
The gold standard of data capture. Data comes directly into your system, with no human interaction necessarily.

This can be achieved at an inter-organisational level if both parties agree to the same data standard - if the same EDI is used, then no transformation to internal data formats is needed. The EDI is your internal format.

Another increasingly common way to achieve this is to record data from your own IoT deployments, and load that information directly into your data system; electronic sensor to ERP.