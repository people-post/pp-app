# Our dapp design (IPFS + our chain)

This document describes **our** architecture in the same spirit as our Bluesky / AT Protocol comparison note: plain-language layout, tradeoffs, and how it differs from Bluesky’s split between home base, distribution, and feeds.

The practical goal overlaps with open social stacks—**portable identity, content you can reason about, and room for many products**—but we anchor the design on two choices Bluesky does not make as the primary spine:

- **IPFS** for **content-addressed storage** of payloads (posts, media, and later richer record types).
- **Our own blockchain** for **naming / resolution** and for **history and timestamping** of user data (commits, digests, or defined snapshots—not every byte on-chain).

That pairing lets us treat **posting as one protocol** while the same ledger and storage patterns can later carry **trading, exchanges, and commerce** without bolting entirely separate trust models on top.

## The network layout, in plain terms

Think of the system as three parts (analogous roles to Bluesky’s diagram, different implementation):

1. **Content (where bytes live)**
   - User-facing data is stored and addressed on **IPFS** (or IPFS-compatible layers). **By design, the first-class home for a user’s own material is hardware they control**—their **device and personal node**—so **custody is local-by-default**, not rent-only storage on a distant operator’s disks alone. Content is referenced by **CIDs**; replication and retrieval follow content addressing rather than “this file lives on server X only.”

2. **Names and history (where the chain earns its keep)**
   - **Our blockchain** resolves **names to current handles of record** (name-server role) and records **commitments to user history**—hashes, roots, or batched digests—so ordering and “no later than” bounds come from **consensus time**, not only from an app’s local clock field.

3. **Apps and views (what people use)**
   - Timelines, ranking, moderation, and product UX stay in application layers—same competitive story as AT’s feed providers, but our **authoritative naming and history anchors** are chain-backed by design.

### Simple diagram

```text
User (creates content) ---> IPFS (content-addressed blobs) <--- apps read by CID
        |
        v
Our chain (names resolve to identities/records; history digests + block time)
        |
        v
Apps / feeds / future: trading, exchanges, shopping (same trust spine)
```

## Compared to AT Protocol (Bluesky)

**Where the comparison fits**

- **Layered architecture.** Like AT’s PDS / relays / views split, we separate **storage (IPFS)**, **global rules for names and history (chain)**, and **experience (apps)**. You can evolve retrieval or UI without redefining the ledger’s role in naming and anchoring.
- **Identifiers and resolution.** AT ties **handles and DIDs** to a **home PDS**. We tie **names** to chain-level resolution and **content** to **CIDs** on IPFS—same family of problem (**resolve a name, then fetch authoritative or agreed data**), with **content addressing** for blobs and **ledger** for identity/history commitments.
- **Extensibility.** AT is intentionally **social-record-centric** (repos, record types, sync). Our stack is **intentionally thinner at the “social schema” layer** relative to AT’s spec depth, and **thicker at the “shared ledger + content store” layer**, so **new record families** (orders, swaps, listings) can share **one naming and timestamping story**.

**Where the analogy stretches**

- **IPFS is not a personal “home server” in the PDS sense.** Raw content addressing still raises **who keeps bytes reachable** at internet scale; we push **the user’s own data** toward **their app and personal node** so everyday use does not depend on them understanding pinning—while **network-wide discovery and relay-scale** operations remain an infrastructure topic, same as any large open system.
- **Chain costs and finality.** Every design that writes to a blockchain trades **strong global ordering** for **fees, latency, and governance** of the chain itself. That is a different ops profile than HTTP + PDS + relays alone.
- **Interoperability.** Bluesky interoperates within the AT ecosystem; we are **not** claiming plug-and-play with AT or ActivityPub without bridges. Partnership strategy should assume **explicit integration work** where cross-network UX matters.

## Timestamping and history: what our chain adds

In that Bluesky comparison, **post times in AT are largely app- and user-controlled metadata**, not network-notarized wall-clock truth. Our design targets that gap **by construction** for the commitments we put on-chain:

- **History commitments.** We can record **cryptographic digests** of a user’s data history (or Merkle roots over batches) on **our** chain. Verifiers check that a claimed history matches the committed root.

- **Consensus-backed time bounds.** Block timestamps give an **upper bound**: a digest was known to the network **no later than** the including block’s time—**coarser than a stopwatch**, but **stronger than a single client’s clock** for disputes, compliance narratives, and “did this state exist by date X?” questions.

- **Scope honestly.** This strengthens **tamper-evidence and ordering relative to our ledger**; it does not certify every relay copy or offline screenshot. **Privacy-sensitive** flows remain a **separate product and cryptography story** from public posting.

## Beyond posting: native room for trading, exchanges, shopping

AT Protocol’s strength is **standardized social records**; stretching it to **general financial or commerce state machines** is not its core job. Our spine—**IPFS for payloads, chain for names and commitments**—maps naturally to **more record types**:

- **Trading and exchanges** can use the **same chain** for **state transitions, allowances, or settlement anchors** (exact mechanics are product-specific), with **IPFS** (or similar) for **disclosures, terms, or large artifacts** referenced by CID.

- **Shopping / listings** later can follow the same pattern: **off-chain or IPFS-stored catalog and media**, **on-chain** references, inventory or escrow rules where the product requires them—without a second parallel “name and time” system.

The point is **protocol extension** without abandoning the **two-layer mental model**: **content by CID**, **names and authoritative history anchors on our chain**.

## IPFS is ours to understand—and to evolve

We treat IPFS as **infrastructure we actually run**, not a mystery box behind a vendor wall. The team works from **first principles**: how bits are addressed, routed, pinned, and garbage-collected in the wild. That depth matters when reality bites—latency, relay behavior, mobile constraints, or a product bet that does not quite match stock defaults.

When the protocol or deployment needs to **bend**—a custom retrieval path, tighter privacy boundaries, or a breaking fix ahead of upstream—we are **positioned to change our stack** instead of arguing with a dependency we do not control. Readers weighing **technical risk** should hear this as **reduced “black box” anxiety**: the storage layer is **known territory**, not an opaque externality.

## Personal data nodes: your pocket, your exit

Decentralized storage can sound like “run a server in the garage.” We ship **lightweight individual nodes**—including forms that run **on a user’s own smartphone**—so everyday people get a **personal slice of the network** without becoming operators.

That personal node can **hold and sync the data that belongs to them**, participate in the broader graph on fair terms, and—critically—support **export and migration when they want out**. No special pleading to a platform: **their archive can move** with them. The emotional contract is simple: **less lock-in, more agency**, while still fitting into a shared protocol instead of a silo.

## Where the design faces friction

### Chain scale, fees, and governance

Batching commitments and keeping **only digests** on-chain mitigates cost, but **throughput, fee markets, and chain governance** still shape UX and centralization risk—similar in kind to “who can afford global relay-scale infra” in AT, different in mechanism.

### Builder complexity

Implementers must reason about **CIDs, retrieval, chain clients, and finality**—a different skill mix than **PDS + HTTP + repo sync** alone. Tooling and hosted services reduce that burden but become part of the **ecosystem’s concentration** story.

### Cross-network expectations

Users who want **one login across AT, ActivityPub, and our stack** should expect **bridges and explicit mapping**, not automatic protocol unity.

## Summary for a quick read

**Our dapp’s design** centers **IPFS for content storage** and **our blockchain for naming and user-data history timestamping** (digest commitments + consensus time bounds). We **own the IPFS story end to end**—able to adapt the stack when product or network reality demands it—and we ship **personal data nodes** (including **phone-friendly** deployments) so users get **lower friction** and a **clear path to take their data elsewhere**. Compared to **AT Protocol**, we trade **AT’s rich, social-specific repo spec** for a **content-addressed store + shared ledger** spine that is **easier to extend** toward **trading, exchanges, and later shopping**—with the usual tradeoffs around **chain operations and cross-protocol integration**. A separate companion note covers **Bluesky’s strengths and frictions** in more detail.
