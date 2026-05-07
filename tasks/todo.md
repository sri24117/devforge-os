# Task: Pivot DevForge to a Journey-Centric FAANG Prep System

## Goal
Transform the "AI Toolbox" into a "Daily Guided Learning System" with a strong core loop, psychological hooks, and clear day-over-day progression.

## Plan
### Phase 1: Persistence Layer & Data Modeling
- [ ] Create `roadmap_days` table (Day 1, Topic, Problem IDs).
- [ ] Create `user_progress` table (User ID, Day, Completed Status, Score).
- [ ] Create `problem_attempts` table (User ID, Problem ID, Success, Time Taken).
- [ ] Sync these models with SQLAlchemy and Pydantic schemas.

### Phase 2: The "Day 1" Dashboard Experience
- [ ] Refactor `DashboardView` from "Stats Grid" to "Daily Command Center."
- [ ] Display "Today's Topic" and "3 Problems to Solve."
- [ ] Add a prominent "Start Day X" execution button.
- [ ] Implement a global "Readiness Score" and "Skill Graph" visualization.

### Phase 3: Core Loop Implementation
- [ ] **Trigger:** User logs in -> Sees "Today's Plan."
- [ ] **Action:** User opens a problem -> IDE loads.
- [ ] **Variable Reward:** AI Mentor provides hints (not answers) -> Success state.
- [ ] **Investment:** User sees progress bar move -> "You are one day closer to FAANG."

### Phase 4: AI Repositioning
- [ ] Context-aware AI: The AI Pilot now only answers questions *relevant* to the active task.
- [ ] Implement "Mentor Mode" (Step-by-step guidance instead of code generation).

### Phase 5: Verification
- [ ] Test the "Day 2" transition (automatic progression based on completion).
- [ ] Verify that new users see a forced onboarding/Day 1 state.

## Lessons learned
- *Empty - to be updated after feedback*
