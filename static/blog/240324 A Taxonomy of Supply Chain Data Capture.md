Most of my tech career has been in and around the supply chain; from procurement to operations, from traceability to manufacturing. I've seen many different ways of getting data into systems, some simple, some complex, some ingenious and some horrifying. But I believe all these ways fall into four categories, and that these categories are understandable to both business and technical stakeholders.
## The Four Kinds of Data Capture

We'll start from the top, here are the four kinds of supply chain data capture:

![Alt text](https://assets.digitalocean.com/articles/alligator/boo.svg "a title")

From worst to best, these are:

- Manual/Indirect
- Manual/Direct
- Automatic/Indirect
- Automatic/Direct
  
Let's dive into these definitions.
## Data System

Most supply chain organisations will have a data system they consider "theirs". Usually this is something like an ERP/TMS/WMS, but it could also be in-house business software. Whatever form it takes, it's where your data lives, and where value can be added to it - your own forecasts, analysis etc take place here.

For the purpose of this article, I will call this your Data System.
## Data, Near & Far

Your Data System stores data in a specific *format*; you might think of this as the 'shape' or 'format' of a data; more technical readers will know this as a 'schema'. 

Data flows into your system from suppliers, customers, and your own staff. When this data has a format similar to what's in your data system, we call it *Near Data*; when the format differs greatly, we call this *Far Data*. This is a spectrum; we can talk of data being *nearer* and *further* to your own data system. The further data is, the more work is needed to make it usable in your Data System - and by extension useful to your organization.

"Near & Far" is independent of physical distance. A node in the supply chain may purchase materials from a facility right next door, but find the accompanying data to be Far Data. Conversely, it may be sourced from the opposite end of the earth, but happen to use the same data standards, and it would be Near Data.
## Indirect, Direct, Manual & Automatic

And now come to the core taxonomy.

First we ask - is the data coming into our system Far Data? If it is, we call this *Indirect*. If not, and little transformation is needed, then we call it *Direct*. As Near & Far is a spectrum, so too is Direct & Indirect

Secondly, we ask - is there a human being needed in this process? Does this come into a system due to someone manually typing or clicking? If yes, we call it manual. If not, we classify it as automatic.

## Examples & Characteristics of the Four Kinds

### Manual/Indirect

The supply chain classic. Get an email with an attachment (Far Data), print it out, and type it in manually into the system. Slow, error prone, and expensive.

Transforming these processes to Manual/Direct or Automatic/Indirect is step one in supply chain digitization.
### Manual/Direct

Data is entered manually, but it comes directly into your data system, not through a middle man. A great example of this is a customer ordering through an e-commerce site integrated 
### Automatic/Indirect

Something less often seen, but a powerful technique. Far Data is automatically captured processed, then loaded into your main data systems (the more technical among you will recognize this as an [ETL](https://learn.microsoft.com/en-us/azure/architecture/data-guide/relational-data/etl) process).

This can be a pragmatic choice when fully digitizing the 'edges' of your system is impractical, say when suppliers or customers insist on sending you data in their own formats.

A note here on data quality. We could introduce another axis here, representing how structured the data is, from "completely digital and in a standardized format" to "off-centre photocopy of a doctor's handwriting". Increasingly machines can use AI techniques for the latter, but this is more brittle, more complicated and dramatically slower than having a machine reading a format it knows.
### Automatic, Direct

The gold standard of data capture. Data comes directly into your system, with no human interaction necessarily.

This can be achieved at an inter-organisational level if both parties 1) agree on an automated, electronic method of communication (likely an API) and 2)  agree to the same data standard - if the same EDI is used, then no transformation to near data formats is needed. The EDI is your Near Datra format.

Another way is to record data from your own IoT deployments, and load that information directly into your data system; if you can control the data flow from Electronic Sensor to ERP, you can keep data transformations to a minimum.
## Closing Remarks

This article was intended to be accessible for Supply Chain professionals who understand that they need data for visibility, traceability or simply analytical purposes, but may not know where to start. As always, my email is open for comments and constructive criticism.

