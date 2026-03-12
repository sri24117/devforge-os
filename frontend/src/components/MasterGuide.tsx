import React, { useState } from "react";

/* ─────────────────────────────────────────────
   DSA CATEGORIES (problems 1–70)
───────────────────────────────────────────── */
const dsaCategories = [
  {
    id: 1, title: "Sliding Window", subtitle: "Arrays & Strings",
    color: "#00D4FF", bg: "rgba(0,212,255,0.07)", icon: "⊟",
    desc: "Maintains a dynamic or fixed-size window to avoid re-computing overlapping elements.",
    problems: [
      { n: 1, title: "Longest Substring Without Repeating Characters", diff: "Medium", lc: "https://leetcode.com/problems/longest-substring-without-repeating-characters/" },
      { n: 2, title: "Maximum Sum Subarray of Size K", diff: "Easy", lc: "https://leetcode.com/problems/maximum-average-subarray-i/" },
      { n: 3, title: "Minimum Size Subarray Sum", diff: "Medium", lc: "https://leetcode.com/problems/minimum-size-subarray-sum/" },
      { n: 4, title: "Longest Substring with K Distinct Characters", diff: "Medium", lc: "https://leetcode.com/problems/longest-substring-with-at-most-k-distinct-characters/" },
      { n: 5, title: "Minimum Window Substring", diff: "Hard", lc: "https://leetcode.com/problems/minimum-window-substring/" },
    ],
  },
  {
    id: 2, title: "Two Pointers", subtitle: "Arrays & Strings",
    color: "#A78BFA", bg: "rgba(167,139,250,0.07)", icon: "⇔",
    desc: "Uses two indices scanning from different ends or speeds, eliminating nested loops.",
    problems: [
      { n: 6, title: "3Sum", diff: "Medium", lc: "https://leetcode.com/problems/3sum/" },
      { n: 7, title: "Two Sum II (Sorted Array)", diff: "Medium", lc: "https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/" },
      { n: 8, title: "Squares of a Sorted Array", diff: "Easy", lc: "https://leetcode.com/problems/squares-of-a-sorted-array/" },
      { n: 9, title: "Container With Most Water", diff: "Medium", lc: "https://leetcode.com/problems/container-with-most-water/" },
      { n: 10, title: "Sort Colors (Dutch National Flag)", diff: "Medium", lc: "https://leetcode.com/problems/sort-colors/" },
    ],
  },
  {
    id: 3, title: "Fast & Slow Pointers", subtitle: "Linked Lists",
    color: "#34D399", bg: "rgba(52,211,153,0.07)", icon: "⟳",
    desc: "Moves pointers at different speeds to detect cycles or find midpoints in one pass.",
    problems: [
      { n: 11, title: "Linked List Cycle", diff: "Easy", lc: "https://leetcode.com/problems/linked-list-cycle/" },
      { n: 12, title: "Middle of the Linked List", diff: "Easy", lc: "https://leetcode.com/problems/middle-of-the-linked-list/" },
      { n: 13, title: "Happy Number", diff: "Easy", lc: "https://leetcode.com/problems/happy-number/" },
    ],
  },
  {
    id: 4, title: "In-Place Linked List Reversal", subtitle: "Linked Lists",
    color: "#FB923C", bg: "rgba(251,146,60,0.07)", icon: "↩",
    desc: "Modifies node pointers directly without allocating extra memory.",
    problems: [
      { n: 14, title: "Reverse a Linked List", diff: "Easy", lc: "https://leetcode.com/problems/reverse-linked-list/" },
      { n: 15, title: "Reverse a Sub-list", diff: "Medium", lc: "https://leetcode.com/problems/reverse-linked-list-ii/" },
      { n: 16, title: "Reverse Nodes in k-Group", diff: "Hard", lc: "https://leetcode.com/problems/reverse-nodes-in-k-group/" },
    ],
  },
  {
    id: 5, title: "Merge Intervals & Cyclic Sort", subtitle: "Arrays",
    color: "#F472B6", bg: "rgba(244,114,182,0.07)", icon: "⊕",
    desc: "Handles overlapping ranges or sorts numbers within a 1-to-N range in O(n).",
    problems: [
      { n: 17, title: "Merge Intervals", diff: "Medium", lc: "https://leetcode.com/problems/merge-intervals/" },
      { n: 18, title: "Insert Interval", diff: "Medium", lc: "https://leetcode.com/problems/insert-interval/" },
      { n: 19, title: "Meeting Rooms II", diff: "Medium", lc: "https://leetcode.com/problems/meeting-rooms-ii/" },
      { n: 20, title: "Missing Number", diff: "Easy", lc: "https://leetcode.com/problems/missing-number/" },
      { n: 21, title: "Find All Duplicates in an Array", diff: "Medium", lc: "https://leetcode.com/problems/find-all-duplicates-in-an-array/" },
    ],
  },
  {
    id: 6, title: "Trees: BFS & DFS", subtitle: "Binary Trees",
    color: "#FBBF24", bg: "rgba(251,191,36,0.07)", icon: "⬡",
    desc: "Explores hierarchical data level-by-level (BFS) or branch-by-branch (DFS).",
    problems: [
      { n: 22, title: "Binary Tree Level Order Traversal", diff: "Medium", lc: "https://leetcode.com/problems/binary-tree-level-order-traversal/" },
      { n: 23, title: "Binary Tree Zigzag Level Order Traversal", diff: "Medium", lc: "https://leetcode.com/problems/binary-tree-zigzag-level-order-traversal/" },
      { n: 24, title: "Binary Tree Right Side View", diff: "Medium", lc: "https://leetcode.com/problems/binary-tree-right-side-view/" },
      { n: 25, title: "Path Sum", diff: "Easy", lc: "https://leetcode.com/problems/path-sum/" },
      { n: 26, title: "Diameter of Binary Tree", diff: "Easy", lc: "https://leetcode.com/problems/diameter-of-binary-tree/" },
      { n: 27, title: "Binary Tree Maximum Path Sum", diff: "Hard", lc: "https://leetcode.com/problems/binary-tree-maximum-path-sum/" },
      { n: 28, title: "Lowest Common Ancestor in a BST", diff: "Medium", lc: "https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/" },
    ],
  },
  {
    id: 7, title: "Graphs & Matrix Traversal", subtitle: "Graphs",
    color: "#60A5FA", bg: "rgba(96,165,250,0.07)", icon: "◈",
    desc: "Maps connections and relationships, simulating islands or networks using DFS/BFS.",
    problems: [
      { n: 29, title: "Number of Islands", diff: "Medium", lc: "https://leetcode.com/problems/number-of-islands/" },
      { n: 30, title: "Flood Fill", diff: "Easy", lc: "https://leetcode.com/problems/flood-fill/" },
      { n: 31, title: "Rotting Oranges", diff: "Medium", lc: "https://leetcode.com/problems/rotting-oranges/" },
      { n: 32, title: "01 Matrix", diff: "Medium", lc: "https://leetcode.com/problems/01-matrix/" },
      { n: 33, title: "Clone Graph", diff: "Medium", lc: "https://leetcode.com/problems/clone-graph/" },
    ],
  },
  {
    id: 8, title: "Binary Search", subtitle: "Sorted Sequences",
    color: "#4ADE80", bg: "rgba(74,222,128,0.07)", icon: "÷",
    desc: "Halves sorted search spaces to achieve O(log n) time complexity.",
    problems: [
      { n: 34, title: "Binary Search", diff: "Easy", lc: "https://leetcode.com/problems/binary-search/" },
      { n: 35, title: "Search in Rotated Sorted Array", diff: "Medium", lc: "https://leetcode.com/problems/search-in-rotated-sorted-array/" },
      { n: 36, title: "Find Minimum in Rotated Sorted Array", diff: "Medium", lc: "https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/" },
    ],
  },
  {
    id: 9, title: "Heaps & K-Way Merge", subtitle: "Priority Queues",
    color: "#E879F9", bg: "rgba(232,121,249,0.07)", icon: "△",
    desc: "Maintains a running collection of largest/smallest elements dynamically.",
    problems: [
      { n: 37, title: "Kth Largest Element in an Array", diff: "Medium", lc: "https://leetcode.com/problems/kth-largest-element-in-an-array/" },
      { n: 38, title: "Top K Frequent Elements", diff: "Medium", lc: "https://leetcode.com/problems/top-k-frequent-elements/" },
      { n: 39, title: "K Closest Points to Origin", diff: "Medium", lc: "https://leetcode.com/problems/k-closest-points-to-origin/" },
      { n: 40, title: "Find Median from Data Stream", diff: "Hard", lc: "https://leetcode.com/problems/find-median-from-data-stream/" },
      { n: 41, title: "Sliding Window Median", diff: "Hard", lc: "https://leetcode.com/problems/sliding-window-median/" },
      { n: 42, title: "Merge K Sorted Lists", diff: "Hard", lc: "https://leetcode.com/problems/merge-k-sorted-lists/" },
      { n: 43, title: "Kth Smallest Element in a Sorted Matrix", diff: "Medium", lc: "https://leetcode.com/problems/kth-smallest-element-in-a-sorted-matrix/" },
    ],
  },
  {
    id: 10, title: "Backtracking", subtitle: "Exhaustive Search",
    color: "#F87171", bg: "rgba(248,113,113,0.07)", icon: "⤺",
    desc: "Explores all candidate solutions, undoing bad choices when hitting dead ends.",
    problems: [
      { n: 44, title: "Subsets", diff: "Medium", lc: "https://leetcode.com/problems/subsets/" },
      { n: 45, title: "Permutations", diff: "Medium", lc: "https://leetcode.com/problems/permutations/" },
      { n: 46, title: "Combination Sum", diff: "Medium", lc: "https://leetcode.com/problems/combination-sum/" },
      { n: 47, title: "Word Search", diff: "Medium", lc: "https://leetcode.com/problems/word-search/" },
      { n: 48, title: "N-Queens", diff: "Hard", lc: "https://leetcode.com/problems/n-queens/" },
    ],
  },
  {
    id: 11, title: "Dynamic Programming", subtitle: "Optimization",
    color: "#FCD34D", bg: "rgba(252,211,77,0.07)", icon: "⊞",
    desc: "Solves optimization problems by caching overlapping subproblems.",
    problems: [
      { n: 49, title: "Climbing Stairs", diff: "Easy", lc: "https://leetcode.com/problems/climbing-stairs/" },
      { n: 50, title: "House Robber", diff: "Medium", lc: "https://leetcode.com/problems/house-robber/" },
      { n: 51, title: "Longest Increasing Subsequence", diff: "Medium", lc: "https://leetcode.com/problems/longest-increasing-subsequence/" },
      { n: 52, title: "Partition Equal Subset Sum (0/1 Knapsack)", diff: "Medium", lc: "https://leetcode.com/problems/partition-equal-subset-sum/" },
      { n: 53, title: "Coin Change", diff: "Medium", lc: "https://leetcode.com/problems/coin-change/" },
      { n: 54, title: "Longest Common Subsequence", diff: "Medium", lc: "https://leetcode.com/problems/longest-common-subsequence/" },
      { n: 55, title: "Edit Distance", diff: "Hard", lc: "https://leetcode.com/problems/edit-distance/" },
    ],
  },
  {
    id: 12, title: "Monotonic Stack & Advanced Graphs", subtitle: "Stack · Topo Sort · Union-Find",
    color: "#6EE7B7", bg: "rgba(110,231,183,0.07)", icon: "⊳",
    desc: "Handles next/previous relationships, dependency ordering, and connected components.",
    problems: [
      { n: 56, title: "Daily Temperatures", diff: "Medium", lc: "https://leetcode.com/problems/daily-temperatures/" },
      { n: 57, title: "Next Greater Element I", diff: "Easy", lc: "https://leetcode.com/problems/next-greater-element-i/" },
      { n: 58, title: "Course Schedule (Topological Sort)", diff: "Medium", lc: "https://leetcode.com/problems/course-schedule/" },
      { n: 59, title: "Alien Dictionary (Topological Sort)", diff: "Hard", lc: "https://leetcode.com/problems/alien-dictionary/" },
      { n: 60, title: "Number of Provinces (Union-Find)", diff: "Medium", lc: "https://leetcode.com/problems/number-of-provinces/" },
    ],
  },
  {
    id: 13, title: "Tries", subtitle: "Prefix Trees",
    color: "#38BDF8", bg: "rgba(56,189,248,0.08)", icon: "⊤",
    desc: "Tree-like data structure for efficient prefix matching and autocomplete problems.",
    problems: [
      { n: 61, title: "Implement Trie (Prefix Tree)", diff: "Medium", lc: "https://leetcode.com/problems/implement-trie-prefix-tree/" },
      { n: 62, title: "Design Add and Search Words Data Structure", diff: "Medium", lc: "https://leetcode.com/problems/design-add-and-search-words-data-structure/" },
      { n: 63, title: "Word Search II (Trie + Backtracking)", diff: "Hard", lc: "https://leetcode.com/problems/word-search-ii/" },
    ],
  },
  {
    id: 14, title: "Stack & Greedy", subtitle: "Classic Patterns",
    color: "#FB7185", bg: "rgba(251,113,133,0.08)", icon: "⊗",
    desc: "Foundational stack problems and greedy strategies that appear constantly in interviews.",
    problems: [
      { n: 64, title: "Valid Parentheses", diff: "Easy", lc: "https://leetcode.com/problems/valid-parentheses/" },
      { n: 65, title: "Largest Rectangle in Histogram", diff: "Hard", lc: "https://leetcode.com/problems/largest-rectangle-in-histogram/" },
      { n: 66, title: "Jump Game", diff: "Medium", lc: "https://leetcode.com/problems/jump-game/" },
      { n: 67, title: "Gas Station", diff: "Medium", lc: "https://leetcode.com/problems/gas-station/" },
    ],
  },
  {
    id: 15, title: "Advanced Graph & Design", subtitle: "BFS · Segment Tree · Cache",
    color: "#A3E635", bg: "rgba(163,230,53,0.08)", icon: "⬡",
    desc: "Multi-source BFS, range queries, and classic system-design data structure problems.",
    problems: [
      { n: 68, title: "Word Ladder (BFS Shortest Path)", diff: "Hard", lc: "https://leetcode.com/problems/word-ladder/" },
      { n: 69, title: "Range Sum Query – Mutable (Segment Tree / BIT)", diff: "Medium", lc: "https://leetcode.com/problems/range-sum-query-mutable/" },
      { n: 70, title: "LRU Cache", diff: "Medium", lc: "https://leetcode.com/problems/lru-cache/" },
    ],
  },
];

/* ─────────────────────────────────────────────
   SYSTEM DESIGN TOPICS
───────────────────────────────────────────── */
const systemDesignTopics = [
  {
    id: "sd1", title: "URL Shortener", tag: "Classic",
    color: "#F59E0B", icon: "🔗",
    difficulty: "Medium",
    keyComponents: ["Hash Function (MD5/Base62)", "Database (KV Store)", "Cache (Redis)", "Load Balancer", "Analytics"],
    concepts: ["Base62 encoding", "Consistent hashing", "Read-heavy caching", "Expiry & cleanup"],
    desc: "Design a service like bit.ly that shortens URLs and redirects. Tests hashing, caching, and scalability basics.",
    resources: [
      { label: "Grokking SD", url: "https://www.educative.io/courses/grokking-the-system-design-interview/m2ygV4E81AR" },
    ],
  },
  {
    id: "sd2", title: "Design Twitter / News Feed", tag: "Fan-out",
    color: "#EC4899", icon: "🐦",
    difficulty: "Hard",
    keyComponents: ["Feed generation service", "Graph DB (followers)", "Message Queue (Kafka)", "CDN", "Notification service"],
    concepts: ["Fan-out on write vs read", "Timeline aggregation", "Celebrity problem", "Pagination"],
    desc: "Design a social news feed. The core challenge is efficiently generating and delivering personalized feeds at scale.",
    resources: [
      { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer#design-twitter" },
    ],
  },
  {
    id: "sd3", title: "Distributed Key-Value Store", tag: "Infra",
    color: "#8B5CF6", icon: "🗄️",
    difficulty: "Hard",
    keyComponents: ["Consistent Hashing ring", "Replication (N replicas)", "Gossip protocol", "Vector clocks", "Merkle trees"],
    concepts: ["CAP theorem", "Eventual consistency", "Quorum reads/writes", "Conflict resolution"],
    desc: "Design a distributed store like DynamoDB or Cassandra. Tests deep understanding of distributed systems fundamentals.",
    resources: [
      { label: "Amazon DynamoDB Paper", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf" },
    ],
  },
  {
    id: "sd4", title: "Rate Limiter", tag: "Infra",
    color: "#06B6D4", icon: "🚦",
    difficulty: "Medium",
    keyComponents: ["Token Bucket / Sliding Window", "Redis (atomic INCR)", "API Gateway", "Response headers"],
    concepts: ["Token bucket vs leaky bucket", "Fixed vs sliding window counter", "Distributed rate limiting", "Race conditions"],
    desc: "Design a rate limiter for an API service. Must handle distributed environments and be efficient at high throughput.",
    resources: [
      { label: "Cloudflare Blog", url: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/" },
    ],
  },
  {
    id: "sd5", title: "Design YouTube / Netflix", tag: "Streaming",
    color: "#EF4444", icon: "▶️",
    difficulty: "Hard",
    keyComponents: ["Video encoding pipeline", "CDN (edge nodes)", "Blob storage (S3)", "Metadata DB", "Adaptive bitrate"],
    concepts: ["HLS / DASH streaming", "Video chunking", "CDN cache strategy", "Encoding workers"],
    desc: "Design a video streaming platform. Covers large file storage, encoding pipelines, and global content delivery.",
    resources: [
      { label: "Netflix Tech Blog", url: "https://netflixtechblog.com/tagged/architecture" },
    ],
  },
  {
    id: "sd6", title: "Search Autocomplete System", tag: "Classic",
    color: "#10B981", icon: "🔍",
    difficulty: "Medium",
    keyComponents: ["Trie data structure", "Top-K heap per node", "Offline aggregation (MapReduce)", "Cache layer"],
    concepts: ["Trie prefix matching", "Frequency ranking", "Real-time vs batch update", "Personalization"],
    desc: "Design a type-ahead suggestion system like Google search. Combines Trie knowledge with distributed data aggregation.",
    resources: [
      { label: "Grokking SD", url: "https://www.educative.io/courses/grokking-the-system-design-interview/mE2XkgGRnmp" },
    ],
  },
  {
    id: "sd7", title: "Ride-Sharing (Uber/Lyft)", tag: "Geospatial",
    color: "#F97316", icon: "🚗",
    difficulty: "Hard",
    keyComponents: ["Geo-indexing (Quadtree/S2)", "WebSocket (real-time tracking)", "Matching service", "Surge pricing engine"],
    concepts: ["Geohashing", "Proximity search", "Real-time location updates", "Supply/demand modeling"],
    desc: "Design a ride-hailing service. Tests geospatial indexing, real-time communication, and matching algorithms.",
    resources: [
      { label: "Uber Eng Blog", url: "https://www.uber.com/en-IN/blog/engineering/" },
    ],
  },
  {
    id: "sd8", title: "Distributed Message Queue", tag: "Infra",
    color: "#A78BFA", icon: "📨",
    difficulty: "Hard",
    keyComponents: ["Producers / Consumers", "Topic partitions", "Offset tracking", "Replication (ISR)", "Dead-letter queue"],
    concepts: ["At-least-once vs exactly-once delivery", "Consumer groups", "Log-based storage", "Backpressure"],
    desc: "Design a system like Kafka or RabbitMQ. Fundamental knowledge for any event-driven or microservices architecture.",
    resources: [
      { label: "Kafka Docs", url: "https://kafka.apache.org/documentation/" },
    ],
  },
  {
    id: "sd9", title: "Web Crawler", tag: "Classic",
    color: "#34D399", icon: "🕷️",
    difficulty: "Medium",
    keyComponents: ["URL frontier (priority queue)", "DNS resolver", "Parser & extractor", "Bloom filter (dedup)", "Politeness scheduler"],
    concepts: ["BFS vs DFS crawl", "Duplicate URL detection", "robots.txt compliance", "Distributed coordination"],
    desc: "Design a large-scale web crawler. Tests distributed BFS, deduplication at scale, and politeness constraints.",
    resources: [
      { label: "System Design Primer", url: "https://github.com/donnemartin/system-design-primer#design-a-web-crawler" },
    ],
  },
  {
    id: "sd10", title: "Notification Service", tag: "Event-Driven",
    color: "#38BDF8", icon: "🔔",
    difficulty: "Medium",
    keyComponents: ["Message broker (Kafka)", "Push gateway (FCM/APNs)", "Template engine", "Retry queue", "User preference store"],
    concepts: ["Fanout patterns", "Priority queues", "Retry with backoff", "Idempotency"],
    desc: "Design a notification system that handles email, SMS, and push notifications reliably at scale.",
    resources: [
      { label: "Grokking SD", url: "https://www.educative.io/courses/grokking-the-system-design-interview" },
    ],
  },
];

/* ─────────────────────────────────────────────
   BACKEND QUESTIONS
───────────────────────────────────────────── */
const backendSections = [
  {
    id: "be1", title: "REST & API Design", color: "#60A5FA", icon: "⚡",
    questions: [
      { q: "What are the key principles of RESTful API design?", tags: ["HTTP", "REST"], answer: "Statelessness, uniform interface, client-server separation, layered system, cacheable responses, and code on demand (optional). Resources are identified by URIs and manipulated through standard HTTP verbs (GET, POST, PUT, PATCH, DELETE)." },
      { q: "What is the difference between PUT and PATCH?", tags: ["HTTP"], answer: "PUT replaces the entire resource (idempotent, full update). PATCH applies a partial modification — only the fields provided are changed. PATCH is more bandwidth-efficient for partial updates." },
      { q: "How do you handle API versioning?", tags: ["API Design"], answer: "Three common strategies: URI versioning (/v1/users), Request header (Accept: application/vnd.api+json;version=2), or Query param (?version=1). URI versioning is most visible and widely adopted." },
      { q: "Explain idempotency and why it matters.", tags: ["HTTP", "Reliability"], answer: "An operation is idempotent if performing it multiple times produces the same result. GET, PUT, DELETE are idempotent. POST is not. Critical for safe retries in distributed systems where requests can be duplicated." },
      { q: "What is HATEOAS and is it practical?", tags: ["REST"], answer: "Hypermedia as the Engine of Application State — responses include links to related actions. Theoretically self-documenting. In practice, rarely fully implemented; most APIs use versioned docs (Swagger/OpenAPI) instead." },
    ],
  },
  {
    id: "be2", title: "Databases & SQL", color: "#A3E635", icon: "🗃️",
    questions: [
      { q: "What is the difference between SQL and NoSQL databases?", tags: ["DB"], answer: "SQL: structured schema, ACID transactions, relational joins (Postgres, MySQL). NoSQL: flexible schema, horizontal scaling, varied models — document (MongoDB), key-value (Redis), column (Cassandra), graph (Neo4j). Choice depends on consistency, scale, and query patterns." },
      { q: "Explain database indexing. When would you not use an index?", tags: ["SQL", "Performance"], answer: "An index is a data structure (B-tree / Hash) that speeds reads at the cost of slower writes and storage. Avoid on small tables, columns with very low cardinality, or tables that are write-heavy with rare reads." },
      { q: "What are database transactions and ACID properties?", tags: ["DB", "Transactions"], answer: "Atomicity (all-or-nothing), Consistency (data remains valid), Isolation (concurrent transactions don't interfere), Durability (committed data persists). Enforced via write-ahead logs, locks, and MVCC." },
      { q: "What is N+1 query problem and how do you fix it?", tags: ["ORM", "Performance"], answer: "Fetching a list (1 query) then fetching related data per item (N queries). Fix with eager loading (JOIN or SQL IN clause), or batching. In ORMs: use .include(), prefetch_related(), or DataLoader (GraphQL)." },
      { q: "Explain database sharding vs replication.", tags: ["Scaling", "DB"], answer: "Replication: copy data across nodes for redundancy & read scaling (one primary, N replicas). Sharding: partition data horizontally across nodes by a shard key, each node owns a subset. Sharding scales writes; replication scales reads." },
      { q: "What is a database connection pool and why is it needed?", tags: ["Performance"], answer: "A pool of pre-established DB connections reused across requests. Creating a new connection is expensive (~50-100ms). Pooling (PgBouncer, HikariCP) keeps N connections alive, lending them per request and returning them immediately after." },
    ],
  },
  {
    id: "be3", title: "Caching", color: "#F59E0B", icon: "⚡",
    questions: [
      { q: "Explain cache eviction policies: LRU, LFU, FIFO.", tags: ["Cache"], answer: "LRU (Least Recently Used): evict the item unused the longest — good general purpose. LFU (Least Frequently Used): evict the item accessed fewest times — better for skewed access patterns. FIFO: evict the oldest inserted — simple but often suboptimal." },
      { q: "What is cache invalidation and what are the strategies?", tags: ["Cache"], answer: "Ensuring stale data is removed/updated. Strategies: TTL (expire after N seconds), Write-through (update cache on write), Write-behind (async write to DB), Cache-aside (app manages cache), Event-driven invalidation (pub/sub)." },
      { q: "What is a cache stampede / thundering herd? How do you prevent it?", tags: ["Cache", "Reliability"], answer: "When a cache key expires and many concurrent requests hit the DB simultaneously. Prevention: probabilistic early expiration, mutex locking (only one request rebuilds, others wait), background refresh before expiry." },
      { q: "When would you use Redis over Memcached?", tags: ["Redis"], answer: "Redis when you need: persistence, complex data types (sorted sets, hashes, lists), pub/sub messaging, atomic transactions (MULTI/EXEC), or Lua scripting. Memcached is simpler and slightly faster for pure key-value string caching." },
    ],
  },
  {
    id: "be4", title: "Microservices & Distributed Systems", color: "#EC4899", icon: "🔀",
    questions: [
      { q: "What is the CAP theorem?", tags: ["Distributed"], answer: "A distributed system can guarantee at most two of: Consistency (every read returns latest write), Availability (every request gets a response), Partition Tolerance (system works despite network failures). Since partitions are unavoidable, systems choose CP (HBase) or AP (Cassandra)." },
      { q: "How do you handle distributed transactions?", tags: ["Distributed", "Transactions"], answer: "Two-Phase Commit (2PC): coordinator asks all nodes to prepare, then commits — strong consistency but blocking. Saga Pattern: sequence of local transactions with compensating rollbacks — preferred in microservices for resilience." },
      { q: "What is the difference between synchronous and asynchronous communication in microservices?", tags: ["Microservices"], answer: "Sync (REST/gRPC): caller blocks, tight coupling, easier to reason about. Async (Kafka/RabbitMQ): caller doesn't wait, decoupled, better fault tolerance, but adds complexity (eventual consistency, duplicate handling, dead-letter queues)." },
      { q: "What is a circuit breaker pattern?", tags: ["Resilience"], answer: "A proxy that monitors calls to a service. After N failures, it 'opens' and fast-fails all requests (no more waiting), allowing the downstream service to recover. After a timeout, it enters 'half-open' and tests a few requests. Prevents cascading failures." },
      { q: "Explain eventual consistency vs strong consistency.", tags: ["Distributed"], answer: "Strong: all nodes see the same data simultaneously (linearizability). Eventual: nodes will converge to the same state given enough time and no new writes — reads may be stale temporarily. Eventual is more scalable; strong is required for financial/inventory systems." },
      { q: "What is a service mesh? Name an example.", tags: ["Microservices", "Infra"], answer: "A dedicated infrastructure layer handling service-to-service communication — provides load balancing, TLS, retries, circuit breaking, and observability without application code changes. Examples: Istio, Linkerd, Consul Connect. Uses sidecar proxies (Envoy)." },
    ],
  },
  {
    id: "be5", title: "Authentication & Security", color: "#F87171", icon: "🔐",
    questions: [
      { q: "What is the difference between authentication and authorization?", tags: ["Security"], answer: "Authentication: verifying who you are (login, JWT validation). Authorization: verifying what you're allowed to do (RBAC, permission checks). Auth middleware runs first; authorization checks resource ownership." },
      { q: "How does JWT work? What are its weaknesses?", tags: ["Auth", "JWT"], answer: "A signed token (header.payload.signature) that encodes claims. Server validates signature — no DB lookup needed. Weaknesses: can't be revoked before expiry (use short TTL + refresh tokens), sensitive data in payload is base64-decoded by anyone, algorithm confusion attacks (alg: none)." },
      { q: "What is OAuth 2.0 and how does it differ from OpenID Connect?", tags: ["Auth"], answer: "OAuth 2.0: authorization framework — delegates access (e.g., 'Login with Google' gives your app a token to read Gmail). OpenID Connect (OIDC): identity layer on top of OAuth 2.0 — adds an ID token so the app also knows who the user is." },
      { q: "How do you prevent SQL injection?", tags: ["Security", "SQL"], answer: "Always use parameterized queries / prepared statements — never concatenate user input into SQL strings. Use an ORM. Apply least-privilege DB users. Validate and sanitize all inputs. Use a WAF as an additional layer." },
      { q: "What is CORS and how does it work?", tags: ["HTTP", "Security"], answer: "Cross-Origin Resource Sharing — a browser security mechanism that blocks requests from a different origin unless the server explicitly allows it via Access-Control-Allow-Origin headers. Preflight OPTIONS requests check permissions before actual calls." },
    ],
  },
  {
    id: "be6", title: "Performance & Observability", color: "#6EE7B7", icon: "📊",
    questions: [
      { q: "What are the three pillars of observability?", tags: ["Ops"], answer: "Metrics (quantitative time-series — Prometheus/Grafana), Logs (structured event records — ELK Stack), Traces (end-to-end request path across services — Jaeger/Zipkin). Together they allow diagnosing issues in distributed systems." },
      { q: "What is database query optimization? Name key techniques.", tags: ["Performance", "SQL"], answer: "Use EXPLAIN/ANALYZE to find slow queries. Add indexes on filter/sort/join columns. Avoid SELECT *, use covering indexes, reduce N+1 with joins, paginate with cursor instead of OFFSET, partition large tables, use read replicas for analytics." },
      { q: "How do you scale a backend service horizontally?", tags: ["Scaling"], answer: "Stateless services (no local session state — use Redis/DB for sessions), deploy multiple instances behind a load balancer, use sticky sessions only if unavoidable, externalize config, ensure health check endpoints, use auto-scaling groups (ECS / K8s HPA)." },
      { q: "What is a load balancer? Layer 4 vs Layer 7?", tags: ["Infra"], answer: "Routes incoming traffic across backend instances. L4 (TCP/IP): routes by IP/port, faster, no content awareness. L7 (HTTP): routes by URL, headers, cookies — supports path-based routing, SSL termination, A/B testing. AWS ALB is L7; NLB is L4." },
    ],
  },
];

/* ─────────────────────────────────────────────
   SHARED HELPERS
───────────────────────────────────────────── */
const diffColor: Record<string, string> = { Easy: "#4ADE80", Medium: "#FBBF24", Hard: "#F87171" };
const diffBg: Record<string, string> =    { Easy: "rgba(74,222,128,0.12)", Medium: "rgba(251,191,36,0.12)", Hard: "rgba(248,113,113,0.12)" };

function Tag({ label, color = "#6B7280" }: { label: string; color?: string }) {
  return (
    <span style={{
      fontSize: 9, fontFamily: "'Courier New', monospace", letterSpacing: 1,
      background: `${color}18`, color, border: `1px solid ${color}30`,
      padding: "2px 7px", borderRadius: 8, textTransform: "uppercase",
    }}>{label}</span>
  );
}

/* ─────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────── */
export default function MasterGuide() {
  const [activeTab, setActiveTab] = useState("dsa");
  const [openItem, setOpenItem] = useState<number | string | null>(null);
  const [diffFilter, setDiffFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [solved, setSolved] = useState<Record<number, boolean>>({});
  const [openAnswer, setOpenAnswer] = useState<string | null>(null);

  const totalDSA = 70;
  const totalSolved = Object.values(solved).filter(Boolean).length;

  const toggleSolved = (n: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setSolved((s) => ({ ...s, [n]: !s[n] }));
  };

  const tabs = [
    { id: "dsa",    label: "DSA Problems",    count: "70",  color: "#60A5FA" },
    { id: "system", label: "System Design",   count: "10",  color: "#F59E0B" },
    { id: "backend",label: "Backend Q&A",     count: "30+", color: "#A78BFA" },
  ];

  return (
    <div className="space-y-8">
      {/* ── HERO ── */}
      <div style={{
        background: "linear-gradient(135deg, #0a0a18 0%, #0f1120 60%, #09090f 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        padding: "44px 24px 32px", textAlign: "center", position: "relative", overflow: "hidden",
        borderRadius: '24px'
      }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: "radial-gradient(circle at 15% 50%, rgba(96,165,250,0.05) 0%, transparent 55%), radial-gradient(circle at 85% 20%, rgba(167,139,250,0.06) 0%, transparent 50%)" }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 6, color: "#60A5FA", marginBottom: 10 }}>
            FAANG INTERVIEW MASTER GUIDE
          </div>
          <h1 style={{
            fontSize: "clamp(26px, 4.5vw, 50px)", fontWeight: 700, margin: "0 0 6px", letterSpacing: "-1px",
            background: "linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            Complete Interview Prep
          </h1>
          <p style={{ color: "#6B7280", fontSize: 14, margin: "0 0 20px", fontFamily: "'Courier New', monospace" }}>
            70 DSA · 10 System Design · 30+ Backend Q&A
          </p>

          {/* progress bar */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 10, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 40, padding: "7px 18px", marginBottom: 24 }}>
            <div style={{ width: 110, height: 5, background: "rgba(255,255,255,0.07)", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${(totalSolved / totalDSA) * 100}%`, background: "linear-gradient(90deg, #60A5FA, #A78BFA)", borderRadius: 3, transition: "width 0.4s" }} />
            </div>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: 11, color: "#9CA3AF" }}>{totalSolved}/{totalDSA} DSA solved</span>
          </div>

          {/* tabs */}
          <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
            {tabs.map((t) => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
                padding: "8px 20px", borderRadius: 22, border: "1px solid",
                borderColor: activeTab === t.id ? t.color : "rgba(255,255,255,0.1)",
                background: activeTab === t.id ? `${t.color}15` : "transparent",
                color: activeTab === t.id ? t.color : "#6B7280",
                cursor: "pointer", fontSize: 12, fontFamily: "'Courier New', monospace",
                transition: "all 0.2s", display: "flex", alignItems: "center", gap: 6,
              }}>
                {t.label}
                <span style={{ background: activeTab === t.id ? `${t.color}25` : "rgba(255,255,255,0.05)", padding: "1px 6px", borderRadius: 8, fontSize: 10 }}>{t.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          TAB: DSA
      ══════════════════════════════ */}
      {activeTab === "dsa" && (
        <div className="max-w-full">
          {/* filters */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
            {["All","Easy","Medium","Hard"].map((d) => (
              <button key={d} onClick={() => setDiffFilter(d)} style={{
                padding: "5px 14px", borderRadius: 18, border: "1px solid",
                borderColor: diffFilter === d ? (diffColor[d] || "#60A5FA") : "rgba(255,255,255,0.1)",
                background: diffFilter === d ? (diffBg[d] || "rgba(96,165,250,0.12)") : "transparent",
                color: diffFilter === d ? (diffColor[d] || "#60A5FA") : "#6B7280",
                cursor: "pointer", fontSize: 11, fontFamily: "'Courier New', monospace", transition: "all 0.2s",
              }}>{d}</button>
            ))}
            <input placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)}
              style={{ padding: "5px 14px", borderRadius: 18, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#e2e8f0", fontSize: 11, outline: "none", fontFamily: "'Courier New', monospace", width: 160 }} />
          </div>

          <div style={{ display: "grid", gap: 10 }}>
            {dsaCategories.map((cat) => {
              const probs = cat.problems.filter((p) => (diffFilter === "All" || p.diff === diffFilter) && p.title.toLowerCase().includes(search.toLowerCase()));
              if (!probs.length) return null;
              const isOpen = openItem === cat.id;
              const catSolved = cat.problems.filter((p) => solved[p.n]).length;
              return (
                <div key={cat.id} style={{ border: `1px solid ${isOpen ? cat.color + "40" : "rgba(255,255,255,0.06)"}`, borderRadius: 12, background: isOpen ? cat.bg : "rgba(255,255,255,0.02)", transition: "all 0.25s", overflow: "hidden" }}>
                  <div onClick={() => setOpenItem(isOpen ? null : cat.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", cursor: "pointer" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 9, background: cat.bg, border: `1px solid ${cat.color}30`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, color: cat.color, flexShrink: 0 }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 14, color: "#f1f5f9" }}>{cat.title} <span style={{ fontSize: 11, color: "#6B7280", fontWeight: 400, fontFamily: "'Courier New', monospace" }}>· {cat.subtitle}</span></div>
                      <div style={{ fontSize: 11, color: "#6B7280", marginTop: 1, fontStyle: "italic" }}>{cat.desc}</div>
                    </div>
                    <span style={{ fontSize: 11, fontFamily: "'Courier New', monospace", color: catSolved === cat.problems.length ? "#4ADE80" : "#6B7280", flexShrink: 0 }}>{catSolved}/{cat.problems.length}</span>
                    <span style={{ color: cat.color, fontSize: 16, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
                  </div>
                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {probs.map((p, i) => (
                        <div key={p.n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 18px 9px 68px", borderBottom: i < probs.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none", background: solved[p.n] ? "rgba(74,222,128,0.03)" : "transparent" }}>
                          <div onClick={(e) => toggleSolved(p.n, e)} style={{ width: 16, height: 16, borderRadius: 4, flexShrink: 0, border: `2px solid ${solved[p.n] ? "#4ADE80" : "rgba(255,255,255,0.15)"}`, background: solved[p.n] ? "#4ADE80" : "transparent", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: "#09090f", fontWeight: 800 }}>{solved[p.n] ? "✓" : ""}</div>
                          <span style={{ fontFamily: "'Courier New', monospace", fontSize: 10, color: "#374151", width: 22 }}>{String(p.n).padStart(2,"0")}</span>
                          <span style={{ flex: 1, fontSize: 13, color: solved[p.n] ? "#6B7280" : "#cbd5e1", textDecoration: solved[p.n] ? "line-through" : "none" }}>{p.title}</span>
                          <span style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: diffColor[p.diff], background: diffBg[p.diff], padding: "2px 7px", borderRadius: 8, flexShrink: 0 }}>{p.diff}</span>
                          <a href={p.lc} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ fontSize: 10, fontFamily: "'Courier New', monospace", color: cat.color, textDecoration: "none", background: `${cat.color}12`, border: `1px solid ${cat.color}30`, padding: "2px 9px", borderRadius: 7, flexShrink: 0 }}>LC →</a>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          TAB: SYSTEM DESIGN
      ══════════════════════════════ */}
      {activeTab === "system" && (
        <div className="max-w-full">
          <div style={{ marginBottom: 20, fontFamily: "'Courier New', monospace", fontSize: 11, color: "#6B7280" }}>
            Click any card to expand architecture breakdown, key components & concepts.
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {systemDesignTopics.map((t) => {
              const isOpen = openItem === t.id;
              return (
                <div key={t.id} style={{ border: `1px solid ${isOpen ? t.color + "50" : "rgba(255,255,255,0.07)"}`, borderRadius: 14, background: isOpen ? `${t.color}08` : "rgba(255,255,255,0.02)", transition: "all 0.25s", overflow: "hidden" }}>
                  <div onClick={() => setOpenItem(isOpen ? null : t.id)} style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 20px", cursor: "pointer" }}>
                    <div style={{ fontSize: 24, flexShrink: 0 }}>{t.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9" }}>{t.title}</span>
                        <Tag label={t.tag} color={t.color} />
                        <Tag label={t.difficulty} color={diffColor[t.difficulty]} />
                      </div>
                      <div style={{ fontSize: 12, color: "#6B7280", marginTop: 3, fontStyle: "italic" }}>{t.desc}</div>
                    </div>
                    <span style={{ color: t.color, fontSize: 16, transition: "transform 0.2s", transform: isOpen ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
                  </div>

                  {isOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", padding: "20px 22px", display: "grid", gap: 18 }}>
                      {/* Key Components */}
                      <div>
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, color: t.color, marginBottom: 10, textTransform: "uppercase" }}>Key Components</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {t.keyComponents.map((c) => (
                            <div key={c} style={{ fontSize: 12, color: "#cbd5e1", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", padding: "5px 12px", borderRadius: 8 }}>
                              {c}
                            </div>
                          ))}
                        </div>
                      </div>
                      {/* Concepts */}
                      <div>
                        <div style={{ fontFamily: "'Courier New', monospace", fontSize: 10, letterSpacing: 3, color: "#9CA3AF", marginBottom: 10, textTransform: "uppercase" }}>Must-Know Concepts</div>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                          {t.concepts.map((c) => (
                            <span key={c} style={{ fontSize: 11, color: "#9CA3AF", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", padding: "4px 10px", borderRadius: 6, fontFamily: "'Courier New', monospace" }}>
                              {c}
                            </span>
                          ))}
                        </div>
                      </div>
                      {/* Resources */}
                      <div style={{ display: "flex", gap: 8 }}>
                        {t.resources.map((r) => (
                          <a key={r.label} href={r.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: t.color, textDecoration: "none", background: `${t.color}12`, border: `1px solid ${t.color}30`, padding: "4px 12px", borderRadius: 8, fontFamily: "'Courier New', monospace" }}>
                            {r.label} ↗
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══════════════════════════════
          TAB: BACKEND Q&A
      ══════════════════════════════ */}
      {activeTab === "backend" && (
        <div className="max-w-full">
          <div style={{ marginBottom: 20, fontFamily: "'Courier New', monospace", fontSize: 11, color: "#6B7280" }}>
            Click any question to reveal a concise interview-ready answer.
          </div>
          <div style={{ display: "grid", gap: 14 }}>
            {backendSections.map((sec) => {
              const isSecOpen = openItem === sec.id;
              return (
                <div key={sec.id} style={{ border: `1px solid ${isSecOpen ? sec.color + "40" : "rgba(255,255,255,0.06)"}`, borderRadius: 14, background: isSecOpen ? `${sec.color}07` : "rgba(255,255,255,0.02)", transition: "all 0.25s", overflow: "hidden" }}>
                  {/* section header */}
                  <div onClick={() => setOpenItem(isSecOpen ? null : sec.id)} style={{ display: "flex", alignItems: "center", gap: 12, padding: "15px 20px", cursor: "pointer" }}>
                    <span style={{ fontSize: 20 }}>{sec.icon}</span>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#f1f5f9", flex: 1 }}>{sec.title}</span>
                    <span style={{ fontSize: 11, color: "#6B7280", fontFamily: "'Courier New', monospace" }}>{sec.questions.length} questions</span>
                    <span style={{ color: sec.color, fontSize: 16, transition: "transform 0.2s", transform: isSecOpen ? "rotate(90deg)" : "none", display: "inline-block" }}>›</span>
                  </div>

                  {isSecOpen && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                      {sec.questions.map((item, qi) => {
                        const qKey = `${sec.id}-${qi}`;
                        const ansOpen = openAnswer === qKey;
                        return (
                          <div key={qi} style={{ borderBottom: qi < sec.questions.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                            {/* question row */}
                            <div onClick={() => setOpenAnswer(ansOpen ? null : qKey)} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 20px 12px 52px", cursor: "pointer", background: ansOpen ? "rgba(255,255,255,0.03)" : "transparent" }}>
                              <div style={{ width: 20, height: 20, borderRadius: 5, border: `1.5px solid ${ansOpen ? sec.color : "rgba(255,255,255,0.12)"}`, background: ansOpen ? `${sec.color}20` : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, color: sec.color, fontSize: 10 }}>{ansOpen ? "−" : "+"}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, color: "#cbd5e1", lineHeight: 1.5 }}>{item.q}</div>
                                <div style={{ display: "flex", gap: 5, marginTop: 5, flexWrap: "wrap" }}>
                                  {item.tags.map((tg) => <Tag key={tg} label={tg} color={sec.color} />)}
                                </div>
                              </div>
                            </div>
                            {/* answer */}
                            {ansOpen && (
                              <div style={{ padding: "0 20px 14px 84px" }}>
                                <div style={{ background: `${sec.color}08`, border: `1px solid ${sec.color}25`, borderRadius: 10, padding: "12px 16px", fontSize: 12.5, color: "#94a3b8", lineHeight: 1.7 }}>
                                  {item.answer}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── FOOTER ── */}
      <div style={{ textAlign: "center", padding: "20px 16px 36px", fontFamily: "'Courier New', monospace", fontSize: 10, color: "#374151", borderTop: "1px solid rgba(255,255,255,0.04)", marginTop: 8 }}>
        70 DSA problems · 10 system design topics · 30+ backend Q&A · all in one place
      </div>
    </div>
  );
}
