---
description: Static Analysis as a useful tool, not a moral imperative
image: null
---

If there's one thing that characterises the zeitgeist of 2022 programming discussions, it's the celebration of static analysis.

Our tools are more and more focused on telling us what we can't do. This code isn't well-typed, it's unsafe, the style is *wrong*. The argument is that increasingly sophisticated static code analysis can eliminate your bugs one by one. You - the programmer - are soft and biological and irrational, but if you can plead your case to the spirits of the machine, maybe it will all be OK.

And to be honest, I agree with this... 95% of the time.

But sometimes the static analysis is wrong. And it's fine to to slip in a `void*`or a `//@ts-ignore` or an `unsafe`. Because some fraction of the time you'll run into an issue where you have to spend hours either convincing the machine of your edge case, or complicating your code to make it happy. Escape the safety hatch, write a comment explaining why, test it, and move on.

Because of course, we still have to write a tests. Faithfulness to static analysis doesn't mean we can ignore what happens when the code actually runs. But I'm not an absolutist, I'm not saying you need full 100% coverage of your code. Just maybe, say... 95%.
