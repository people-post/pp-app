# Bluesky (AT Protocol)

Bluesky is a social network built on a shared set of rules called the **AT Protocol**. The practical goal is simple: make it easier for people to use a social app without being fully locked into one company’s server choices.

Instead of “one platform = one place where accounts and content live,” AT Protocol separates:

- **Where you post and store your identity/content** (the home provider)
- **Where public content gets distributed** (the distribution layer)
- **Where your feed experience is assembled** (the feed/view layer)

That separation helps the ecosystem grow, because companies can compete on the product experience while the underlying protocol keeps the network interoperable.

## The network layout, in plain terms

Think of the system as three parts:

1. **Home base (where you post)**
   - Your account data and your public posts live with your chosen home provider.
   - This means hosting and “writing” can be independent across different providers.

2. **Broad distribution (where public content spreads)**
   - When you publish publicly, updates can be shared out to a wider network.
   - This is supported by services that help distribute public events.

3. **Your feed experience (what you actually see)**
   - Feeds (timelines, ranking, filters, moderation choices) can be produced by feed or view providers.
   - This is where app teams can innovate on personalization and product experience.

### Simple diagram

```text
User (posts) ---> Home Base (account + writing) ---> Distribution ---> Feed/Views (what users see)
                    (PDS)                               (relays)              (timelines/ranking)
```

## AT Protocol and the HTTP-based web (a useful analogy)

AT can feel **internet-shaped** in the same way the familiar web is: **layers**, **open rules**, and **many implementations**—instead of one company owning the whole stack.

**Where the comparison fits**

- **Layered architecture.** The web stacks naming (DNS), transport (TCP/TLS), application verbs (HTTP), and representations (HTML, JSON, and so on). AT stacks **home repository (PDS)**, **public distribution (relays / firehose)**, and **feeds and apps (views)**. In both designs, you can often change one layer without redoing everything else.
- **Protocol, not a single product.** HTTP is not “Chrome’s protocol”; AT is not meant to be one app’s private API. Both aim for **multiple independent implementations** that still interoperate.
- **Identifiers and resolution.** A URL ties a host and path to a resource; AT ties **handles and DIDs** to a **home server** where your signed repository lives. Same family of problem: **resolve a name, then reach the place that serves the authoritative (or agreed) data**.
- **Open on paper, concentrated in practice.** Traffic and defaults still cluster around **large providers and familiar apps**—the same tension already noted for AT **and** for email, DNS, and ordinary hosting.

**Where the analogy stretches**

- **HTTP is thin and general; AT is thicker and social-specific.** HTTP defines how to request a resource; AT specifies **record types, repositories, signing, and deletion semantics** for **social** identity and public data. AT is closer to **HTTP plus a dedicated schema and sync model** than to a generic file transfer layer.
- **Interaction style.** Much of the classic web is **stateless request/response** and **pull**. AT emphasizes **continuous replication, event streams, and repository semantics**—closer to feeds and sync than to “load one page and stop.”
- **Trust and portability.** A typical HTTPS site trusts **TLS, DNS, and whoever runs the server.** AT adds **cryptographic repos and portable identity** because moving **your social graph** between operators is a harder problem than fetching HTML.

**In one line:** AT aims to do for **social identity and public records** something like what the open web did for **documents and services**: **shared protocols, layered roles, many products**—with the same recurring gap between **diagram decentralization** and **how people actually experience the network**.

## Public posts and deletion: an accountability advantage

When someone removes a public post, the protocol updates their home repository and well-behaved apps **stop showing it in the official graph**. It does **not** reach into every copy that may already sit on relays, indexers, archives, or someone’s screenshot folder—and infrastructure that watches public updates can see that **a removal happened**.

For **regulators, trust-and-safety teams, journalists, and people seeking evidence in disputes**, that behavior is often a **strength**: public speech behaves more like the real world, where **what was said in front of witnesses is hard to “un-exist.”** It raises the cost of **memory-holing** once material has flowed through distribution, which supports **accountability and auditability** in the open layer of the network. (Users who need **strong privacy** should treat **direct messaging and non-public channels** as a separate product story—see below.)

## Where the design faces friction

The split between home base, distribution, and feeds is a real architectural strength: it creates room for competition on product while keeping data rules consistent. Like any ambitious infrastructure choice, it also comes with tradeoffs worth understanding when you think about risk, cost, and the competitive landscape.

### Decentralization on paper versus in day-to-day use

The protocol is built so that more than one company can host accounts, run distribution, or build feeds. In practice, users and traffic still tend to cluster around a small number of large providers and well-known apps. That does not erase the protocol’s portability benefits, but it means **the lived experience can look more concentrated than a diagram of “many equal nodes” might suggest**—similar to how email is open in principle, yet a handful of providers handle most inboxes.

### Scale and cost of “everyone can see public posts”

Public content is designed to flow through shared distribution and indexing. Keeping up with that stream at a global scale implies **very large, always-growing storage and bandwidth** for anyone who wants to play a central role in discovery—not just “run a modest server for a community.” That raises the bar for new infrastructure entrants and ties global product quality partly to **who can afford to operate at that scale**.

### Identity and trust

User identity is engineered to be portable, but some of the convenient options rely on **shared directories or familiar web identity (domains)**. That is easier for users and builders than every person running their own cryptographic setup from day one, but it also means **certain registry or DNS-related failures or governance disputes could affect how smoothly accounts resolve**—a normal tradeoff between usability and minimizing third-party dependence.

### Not the same network as Mastodon-style “fediverse” apps

Bluesky’s rules are **not plug-and-play compatible** with the older ActivityPub ecosystem (for example, Mastodon) without separate bridge products and ongoing maintenance. That is a product and ecosystem choice, not a flaw in isolation, but it matters for **partnership strategy and “one protocol to rule them all” expectations**.

### Privacy expectations versus what the protocol emphasizes

Public posting is truly public by design. Features such as direct messages may **not match the end-to-end privacy assumptions** some users associate with “decentralized” branding. For diligence, it helps to treat **messaging and public timelines as separate stories** with different risk profiles.

### Post times—what the protocol does not guarantee

This point matters for **compliance, disputes, and brand safety** when people assume posts carry **certified timestamps** like a notarized clock. AT Protocol does not work that way in the naive sense:

- **Timestamps** on records are largely **set by the posting app** (display metadata), not independently “notarized” by the network as wall-clock truth. Identifiers that *look* like timestamps are still treated in the specs as **user-controlled**—fine for sorting and storage, **not** a forensic proof of when something was created.

Treat **“time posted”** as **product-level trust**, not as cryptographic proof—especially if marketing leans on decentralization language.

### Complexity for the wider builder base

The protocol is precise and powerful, which also makes it **more demanding to implement correctly** than simpler “send a message to another server” models. More moving parts can mean **slower third-party innovation** or a higher chance of subtle implementation gaps until the tooling ecosystem matures—relevant when assessing how fast a standards-based moat actually compounds.

## Where we can improve by using our own chain

AT Protocol leaves “when did this really happen?” to home servers and clients. **Our blockchain** can add an independent anchor layer on top of that story, without pretending to replace AT’s roles.

- **Commit the history, not the whole post graph on-chain.** We can compute a cryptographic hash over a user’s post history (or over defined snapshots as content is published) and record that digest in a transaction on **our** chain. Anyone can later verify that a given history matches the commitment.

- **Use block time as a coarse, consensus-backed bound.** Blocks on our chain carry timestamps agreed by the network. The block that includes a given hash fixes an **upper bound**: that digest was known to the system **no later than** that block’s time. The interval between blocks is not a stopwatch, but it defines an **approximate time window** in which the anchor was written—stronger than a single app’s clock field for disputes, compliance narratives, or “did this exist by date X?” questions.

- **Scope honestly.** This improves **tamper-evidence and ordering relative to our ledger**; it does not magically certify the author’s device clock or every relay copy. It is a practical way to strengthen provenance where AT alone stays deliberately light on network-certified wall time.

## Summary for a quick read

AT Protocol is strong on **clear separation of roles, data portability, and room for competing products on top**, and—on the public layer—on **accountability-friendly deletion semantics** (removals update the official graph without pretending the past never happened for every observer). The main questions for investors are whether **global distribution stays affordable and competitive**, whether **identity and directory governance** remain trusted as the network grows, how **privacy positioning** aligns with user expectations, whether **ecosystem isolation from other open social stacks** is an acceptable strategic bet or a partnership headwind, and whether stakeholders understand that **post times are not network-certified truth**.
