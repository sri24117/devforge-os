-- DevForge OS - PostgreSQL Init Script (FIXED)
-- Added CREATE TABLE statements to ensure auto-run works even if backend hasn't initialized yet.

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    hashed_password VARCHAR(255) NOT NULL,
    streak INTEGER DEFAULT 0,
    last_active TIMESTAMP
);

CREATE TABLE IF NOT EXISTS dsa_problems (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    pattern VARCHAR(100) NOT NULL,
    difficulty VARCHAR(20) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    time_taken INTEGER,
    confidence INTEGER,
    reflection TEXT
);

CREATE TABLE IF NOT EXISTS project_tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(50) NOT NULL,
    completed BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS roadmap_phases (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS roadmap_days (
    id SERIAL PRIMARY KEY,
    day_number INTEGER UNIQUE NOT NULL,
    topic VARCHAR(200) NOT NULL,
    description TEXT,
    problem_ids TEXT
);

CREATE TABLE IF NOT EXISTS user_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    day_number INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INTEGER DEFAULT 0,
    unlocked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS problem_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    problem_reference VARCHAR(200) NOT NULL,
    success BOOLEAN DEFAULT FALSE,
    time_taken INTEGER,
    code_submission TEXT,
    ai_mentor_feedback TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Default Dev User (used only for local development seeds) ────
-- Original bug: inserting dsa_problems/project_tasks without user_id
-- Fix: seed a default dev user first, then reference their ID

-- ── Default Dev User (used only for local development seeds) ────
-- Password hash = bcrypt("devforge123") — change before prod!
INSERT INTO users (name, email, hashed_password, streak, last_active)
VALUES (
  'Dev',
  'dev@devforge.local',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TiGTiGiJeK.V3G1TpJ8j4bNk.7kO',
  0,
  CURRENT_DATE
)
ON CONFLICT (email) DO NOTHING;

-- ── Seed DSA Problems (linked to dev user) ──────────────────────
INSERT INTO dsa_problems (user_id, title, pattern, difficulty, completed)
SELECT u.id, v.title, v.pattern, v.difficulty, false
FROM users u
CROSS JOIN (VALUES
  ('Two Sum',                               'Hash Map',           'Easy'),
  ('Valid Parentheses',                     'Stack',              'Easy'),
  ('Merge Intervals',                       'Intervals',          'Medium'),
  ('Binary Search',                         'Binary Search',      'Easy'),
  ('Climbing Stairs',                       'Dynamic Programming','Easy'),
  ('LRU Cache',                             'Design',             'Medium'),
  ('Word Search',                           'Backtracking',       'Medium'),
  ('Trapping Rain Water',                   'Two Pointers',       'Hard'),
  ('Serialize and Deserialize Binary Tree', 'Tree',               'Hard'),
  ('Course Schedule',                       'Graph',              'Medium'),
  ('Sliding Window Maximum',                'Sliding Window',     'Hard'),
  ('Top K Frequent Elements',               'Heap',               'Medium'),
  ('Find Median from Data Stream',          'Heap',               'Hard'),
  ('Number of Islands',                     'Graph',              'Medium'),
  ('Longest Substring Without Repeating',   'Sliding Window',     'Medium')
) AS v(title, pattern, difficulty)
WHERE u.email = 'dev@devforge.local'
ON CONFLICT DO NOTHING;

-- ── Seed Project Tasks (linked to dev user) ─────────────────────
INSERT INTO project_tasks (user_id, title, category, completed)
SELECT u.id, v.title, v.category, false
FROM users u
CROSS JOIN (VALUES
  ('Set up FastAPI with PostgreSQL',       'Backend'),
  ('Implement Redis caching layer',        'Backend'),
  ('Create Flask microservice',            'Backend'),
  ('Build Docker Compose stack',           'DevOps'),
  ('Write Alembic migrations',             'Backend'),
  ('Update React API service layer',       'Frontend'),
  ('Add loading states and error handling','Frontend'),
  ('Deploy to Render.com free tier',       'DevOps'),
  ('Deploy frontend to Vercel',            'DevOps'),
  ('Set up Upstash Redis (free)',          'DevOps')
) AS v(title, category)
WHERE u.email = 'dev@devforge.local'
ON CONFLICT DO NOTHING;

-- ── Seed Roadmap Phases (linked to dev user) ────────────────────
INSERT INTO roadmap_phases (user_id, title, status)
SELECT u.id, v.title, v.status
FROM users u
CROSS JOIN (VALUES
  ('Phase 1: Foundation Setup',         'completed'),
  ('Phase 2: Full-Stack Integration',   'in_progress'),
  ('Phase 3: Docker & Deployment',      'pending'),
  ('Phase 4: Interview Prep Grind',     'pending')
) AS v(title, status)
WHERE u.email = 'dev@devforge.local'
ON CONFLICT DO NOTHING;
