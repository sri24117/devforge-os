-- DevForge OS - PostgreSQL Init Script
-- Runs once on first container start

-- Seed DSA Problems
INSERT INTO dsa_problems (title, pattern, difficulty, completed) VALUES
  ('Two Sum', 'Hash Map', 'Easy', false),
  ('Valid Parentheses', 'Stack', 'Easy', false),
  ('Merge Intervals', 'Intervals', 'Medium', false),
  ('Binary Search', 'Binary Search', 'Easy', false),
  ('Climbing Stairs', 'Dynamic Programming', 'Easy', false),
  ('LRU Cache', 'Design', 'Medium', false),
  ('Word Search', 'Backtracking', 'Medium', false),
  ('Trapping Rain Water', 'Two Pointers', 'Hard', false),
  ('Serialize and Deserialize Binary Tree', 'Tree', 'Hard', false),
  ('Course Schedule', 'Graph', 'Medium', false)
ON CONFLICT DO NOTHING;

-- Seed Project Tasks
INSERT INTO project_tasks (title, category, completed) VALUES
  ('Set up FastAPI with PostgreSQL', 'Backend', false),
  ('Implement Redis caching layer', 'Backend', false),
  ('Create Flask microservice', 'Backend', false),
  ('Build Docker Compose stack', 'Backend', false),
  ('Write Alembic migrations', 'Backend', false),
  ('Update React API service layer', 'Frontend', false),
  ('Add loading states and error handling', 'Frontend', false),
  ('Deploy to Render.com free tier', 'Backend', false),
  ('Deploy frontend to Vercel', 'Frontend', false),
  ('Set up Upstash Redis (free)', 'Backend', false)
ON CONFLICT DO NOTHING;

-- Seed User
INSERT INTO users (name, streak, last_active) VALUES
  ('Dev', 0, CURRENT_DATE)
ON CONFLICT DO NOTHING;

-- Seed Roadmap Phases
INSERT INTO roadmap_phases (title, status) VALUES
  ('Phase 1: Foundation Setup', 'completed'),
  ('Phase 2: Full-Stack Integration', 'in_progress'),
  ('Phase 3: Docker & Deployment', 'pending'),
  ('Phase 4: Interview Prep Grind', 'pending')
ON CONFLICT DO NOTHING;
