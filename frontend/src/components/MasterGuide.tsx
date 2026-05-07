import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Search, ChevronRight, Check, ExternalLink, Play, BookOpen, Layers, Terminal } from "lucide-react";/* ─────────────────────────────────────────────
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

function Tag({ label, color = "#94a3b8" }: { label: string; color?: string }) {
  return (
    <span 
      className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5 rounded-full border border-white/10"
      style={{ color, backgroundColor: `${color}15`, borderColor: `${color}30` }}
    >
      {label}
    </span>
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
    { id: "dsa",    label: "DSA Problems",    count: "70",  color: "#3b82f6", icon: Terminal },
    { id: "system", label: "System Design",   count: "10",  color: "#f59e0b", icon: Layers },
    { id: "backend",label: "Backend Q&A",     count: "30+", color: "#8b5cf6", icon: BookOpen },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      {/* ── HERO ── */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border border-white/10 p-10 text-center shadow-2xl">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="text-[10px] uppercase tracking-[0.3em] text-blue-400 font-bold mb-3 border border-blue-400/20 px-3 py-1 rounded-full bg-blue-400/10">
            FAANG Interview Master Guide
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            Complete Interview Prep
          </h1>
          <p className="text-slate-400 text-sm font-mono tracking-tight mb-8">
            70 DSA · 10 System Design · 30+ Backend Q&A
          </p>

          {/* progress bar */}
          <div className="flex items-center gap-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-5 py-2.5 mb-8 shadow-inner">
            <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-400 to-purple-400 rounded-full transition-all duration-700 ease-out" 
                style={{ width: `${(totalSolved / totalDSA) * 100}%` }} 
              />
            </div>
            <span className="font-mono text-xs text-slate-300 font-bold">
              {totalSolved} / {totalDSA} <span className="text-slate-500 font-normal">SOLVED</span>
            </span>
          </div>

          {/* tabs */}
          <div className="flex gap-3 justify-center flex-wrap bg-white/5 p-1.5 rounded-2xl border border-white/10 backdrop-blur-lg">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button 
                  key={t.id} 
                  onClick={() => setActiveTab(t.id)} 
                  className={`
                    relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-300
                    ${activeTab === t.id 
                      ? "text-white shadow-lg" 
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                    }
                  `}
                >
                  {activeTab === t.id && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute inset-0 rounded-xl"
                      style={{ backgroundColor: t.color }}
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <div className="relative z-10 flex items-center gap-2">
                    <Icon size={16} />
                    {t.label}
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeTab === t.id ? 'bg-black/20' : 'bg-white/10'}`}>
                      {t.count}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════
          TAB: DSA
      ══════════════════════════════ */}
      {activeTab === "dsa" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6"
        >
          {/* filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white/5 border border-white/10 p-2 rounded-2xl backdrop-blur-sm">
            <div className="flex gap-2">
              {["All", "Easy", "Medium", "Hard"].map((d) => (
                <button 
                  key={d} 
                  onClick={() => setDiffFilter(d)} 
                  className={`
                    px-4 py-2 rounded-xl text-xs font-bold font-mono transition-all duration-200
                    ${diffFilter === d 
                      ? d === 'Easy' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : d === 'Medium' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : d === 'Hard' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                      : 'bg-transparent text-slate-400 border border-transparent hover:bg-white/5'
                    }
                  `}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={14} />
              <input 
                placeholder="Search pattern or problem..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl border border-white/10 bg-black/20 text-slate-200 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all font-mono w-64"
              />
            </div>
          </div>

          <div className="grid gap-4">
            {dsaCategories.map((cat) => {
              const probs = cat.problems.filter((p) => (diffFilter === "All" || p.diff === diffFilter) && p.title.toLowerCase().includes(search.toLowerCase()));
              if (!probs.length) return null;
              
              const isOpen = openItem === cat.id;
              const catSolved = cat.problems.filter((p) => solved[p.n]).length;
              const isAllSolved = catSolved === cat.problems.length;
              
              return (
                <div 
                  key={cat.id} 
                  className={`rounded-2xl border overflow-hidden transition-all duration-300 ${isOpen ? 'shadow-xl' : 'hover:border-white/20'}`}
                  style={{ 
                    borderColor: isOpen ? `${cat.color}40` : "rgba(255,255,255,0.06)",
                    background: isOpen ? `linear-gradient(to bottom, ${cat.color}08, transparent)` : "rgba(255,255,255,0.02)"
                  }}
                >
                  <div 
                    onClick={() => setOpenItem(isOpen ? null : cat.id)} 
                    className="flex items-center gap-4 p-4 cursor-pointer group"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110 shadow-inner"
                      style={{ background: `${cat.color}15`, border: `1px solid ${cat.color}30`, color: cat.color }}
                    >
                      {cat.icon}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">{cat.title}</h3>
                        <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-md bg-white/5 text-slate-400">
                          {cat.subtitle}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{cat.desc}</p>
                    </div>
                    
                    <div className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${isAllSolved ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-white/5 border-white/10 text-slate-400'}`}>
                      {catSolved} / {cat.problems.length}
                    </div>
                    
                    <ChevronRight 
                      className={`text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-90" : ""}`} 
                      style={{ color: isOpen ? cat.color : undefined }}
                    />
                  </div>
                  
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/20"
                      >
                        <div className="p-2 space-y-1">
                          {probs.map((p) => {
                            const isDone = solved[p.n];
                            return (
                              <div 
                                key={p.n} 
                                className={`flex items-center gap-4 p-3 rounded-xl transition-colors group ${isDone ? 'bg-emerald-500/5' : 'hover:bg-white/5'}`}
                              >
                                <button 
                                  onClick={(e) => toggleSolved(p.n, e)} 
                                  className={`
                                    w-6 h-6 rounded flex items-center justify-center transition-all flex-shrink-0
                                    ${isDone 
                                      ? 'bg-emerald-500 text-emerald-950 shadow-[0_0_10px_rgba(16,185,129,0.3)]' 
                                      : 'border border-white/20 text-transparent hover:border-emerald-500/50 hover:bg-emerald-500/10'}
                                  `}
                                >
                                  <Check size={14} strokeWidth={4} />
                                </button>
                                
                                <span className="font-mono text-xs text-slate-600 font-bold w-6">{String(p.n).padStart(2,"0")}</span>
                                
                                <span className={`flex-1 text-sm font-medium transition-all ${isDone ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                                  {p.title}
                                </span>
                                
                                <span className={`
                                  text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-md flex-shrink-0
                                  ${p.diff === 'Easy' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                    : p.diff === 'Medium' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                    : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'}
                                `}>
                                  {p.diff}
                                </span>
                                
                                <a 
                                  href={p.lc} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  onClick={(e) => e.stopPropagation()} 
                                  className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-2 py-1 rounded-md transition-colors border border-white/10 flex-shrink-0"
                                >
                                  LC <ExternalLink size={10} />
                                </a>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════
          TAB: SYSTEM DESIGN
      ══════════════════════════════ */}
      {activeTab === "system" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-4 max-w-full"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
            <p className="text-sm text-slate-400 font-mono">
              <span className="text-amber-400 font-bold">PRO TIP:</span> Click any card to expand architecture breakdown, key components & concepts.
            </p>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {systemDesignTopics.map((t) => {
              const isOpen = openItem === t.id;
              return (
                <div 
                  key={t.id} 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden flex flex-col ${isOpen ? 'shadow-xl md:col-span-2' : 'hover:border-white/20'}`}
                  style={{ 
                    borderColor: isOpen ? `${t.color}50` : "rgba(255,255,255,0.06)",
                    background: isOpen ? `linear-gradient(to bottom right, rgba(255,255,255,0.02), ${t.color}08)` : "rgba(255,255,255,0.02)"
                  }}
                >
                  <div 
                    onClick={() => setOpenItem(isOpen ? null : t.id)} 
                    className="flex items-center gap-4 p-5 cursor-pointer group flex-1"
                  >
                    <div 
                      className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3"
                      style={{ background: `${t.color}15`, border: `1px solid ${t.color}30` }}
                    >
                      {t.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="font-bold text-slate-200 text-lg truncate group-hover:text-white transition-colors">{t.title}</h3>
                        <Tag label={t.tag} color={t.color} />
                        <Tag label={t.difficulty} color={diffColor[t.difficulty]} />
                      </div>
                      <p className="text-xs text-slate-500 truncate">{t.desc}</p>
                    </div>
                    
                    <ChevronRight 
                      className={`text-slate-500 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-90" : ""}`} 
                      style={{ color: isOpen ? t.color : undefined }}
                    />
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/40"
                      >
                        <div className="p-6 grid gap-6 md:grid-cols-2">
                          <div className="space-y-4 md:col-span-2 text-sm text-slate-300 leading-relaxed border-l-2 pl-4" style={{ borderColor: t.color }}>
                            {t.desc}
                          </div>
                          
                          {/* Key Components */}
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2" style={{ color: t.color }}>
                              <Layers size={14} /> Key Components
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {t.keyComponents.map((c) => (
                                <div key={c} className="text-xs font-medium text-slate-300 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg shadow-inner">
                                  {c}
                                </div>
                              ))}
                            </div>
                          </div>
                          
                          {/* Concepts */}
                          <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                            <div className="text-[10px] font-black uppercase tracking-[0.2em] mb-3 text-slate-400 flex items-center gap-2">
                              <BookOpen size={14} /> Must-Know Concepts
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {t.concepts.map((c) => (
                                <span key={c} className="text-[11px] font-mono text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {/* Resources */}
                          <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
                            {t.resources.map((r) => (
                              <a 
                                key={r.label} 
                                href={r.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="flex items-center gap-2 text-xs font-bold transition-all hover:scale-105"
                                style={{ 
                                  color: t.color, 
                                  background: `${t.color}15`, 
                                  border: `1px solid ${t.color}30`, 
                                  padding: "8px 16px", 
                                  borderRadius: "10px" 
                                }}
                              >
                                <Play size={12} fill="currentColor" /> {r.label}
                              </a>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ══════════════════════════════
          TAB: BACKEND Q&A
      ══════════════════════════════ */}
      {activeTab === "backend" && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="space-y-6 max-w-4xl mx-auto"
        >
          <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-500/20 rounded-2xl p-5 text-center shadow-lg">
            <p className="text-sm text-slate-300 font-medium">
              <span className="text-purple-400 font-bold mr-2">BACKEND INTERVIEW VAULT</span> 
              Click any question to reveal a concise, interview-ready answer.
            </p>
          </div>
          
          <div className="grid gap-6">
            {backendSections.map((sec) => {
              const isSecOpen = openItem === sec.id;
              return (
                <div 
                  key={sec.id} 
                  className={`rounded-2xl border transition-all duration-300 overflow-hidden shadow-lg ${isSecOpen ? '' : 'hover:border-white/20'}`}
                  style={{ 
                    borderColor: isSecOpen ? `${sec.color}40` : "rgba(255,255,255,0.08)",
                    background: isSecOpen ? `linear-gradient(to bottom, ${sec.color}08, rgba(0,0,0,0.2))` : "rgba(255,255,255,0.02)"
                  }}
                >
                  {/* section header */}
                  <div 
                    onClick={() => setOpenItem(isSecOpen ? null : sec.id)} 
                    className="flex items-center gap-4 p-5 cursor-pointer group bg-white/5"
                  >
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-inner transition-transform group-hover:scale-110"
                      style={{ background: `${sec.color}15`, border: `1px solid ${sec.color}30` }}
                    >
                      {sec.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-slate-200 text-lg group-hover:text-white transition-colors">{sec.title}</h3>
                      <p className="text-xs font-mono text-slate-500 mt-1">{sec.questions.length} Questions</p>
                    </div>
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isSecOpen ? 'bg-white/10' : 'bg-transparent'}`}
                    >
                      <ChevronRight 
                        className={`transition-transform duration-300 ${isSecOpen ? "rotate-90" : ""}`} 
                        style={{ color: sec.color }}
                      />
                    </div>
                  </div>

                  <AnimatePresence>
                    {isSecOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-white/5 bg-black/20"
                      >
                        <div className="divide-y divide-white/5">
                          {sec.questions.map((item, qi) => {
                            const qKey = `${sec.id}-${qi}`;
                            const ansOpen = openAnswer === qKey;
                            return (
                              <div key={qi} className="group/q">
                                {/* question row */}
                                <div 
                                  onClick={() => setOpenAnswer(ansOpen ? null : qKey)} 
                                  className={`flex items-start gap-4 p-4 cursor-pointer transition-colors ${ansOpen ? 'bg-white/5' : 'hover:bg-white/5'}`}
                                >
                                  <div 
                                    className={`w-6 h-6 rounded flex items-center justify-center flex-shrink-0 transition-colors mt-0.5 text-lg font-light leading-none`}
                                    style={{ 
                                      border: `1px solid ${ansOpen ? sec.color : "rgba(255,255,255,0.15)"}`, 
                                      background: ansOpen ? `${sec.color}20` : "transparent",
                                      color: ansOpen ? sec.color : "#94a3b8"
                                    }}
                                  >
                                    {ansOpen ? "−" : "+"}
                                  </div>
                                  <div className="flex-1 pt-0.5">
                                    <div className={`text-[15px] font-medium leading-relaxed transition-colors ${ansOpen ? 'text-white' : 'text-slate-300 group-hover/q:text-slate-200'}`}>
                                      {item.q}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mt-2.5">
                                      {item.tags.map((tg) => <Tag key={tg} label={tg} color={sec.color} />)}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* answer */}
                                <AnimatePresence>
                                  {ansOpen && (
                                    <motion.div 
                                      initial={{ height: 0, opacity: 0 }}
                                      animate={{ height: 'auto', opacity: 1 }}
                                      exit={{ height: 0, opacity: 0 }}
                                      className="overflow-hidden"
                                    >
                                      <div className="pb-5 pr-5 pl-[3.25rem]">
                                        <div 
                                          className="p-5 rounded-xl shadow-inner text-[14px] leading-relaxed relative"
                                          style={{ 
                                            background: `${sec.color}08`, 
                                            border: `1px solid ${sec.color}20`,
                                            color: "#cbd5e1"
                                          }}
                                        >
                                          <div className="absolute top-0 left-0 w-1 h-full rounded-l-xl opacity-50" style={{ background: sec.color }}></div>
                                          {item.answer}
                                        </div>
                                      </div>
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── FOOTER ── */}
      <div className="text-center pt-8 pb-4 mt-8 border-t border-white/5">
        <p className="font-mono text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          70 DSA problems · 10 system design topics · 30+ backend Q&A · DevForge OS
        </p>
      </div>
    </div>
  );
}
