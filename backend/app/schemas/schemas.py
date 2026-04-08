"""
Pydantic Schemas - Request/Response validation for all API routes
"""

from datetime import datetime
from pydantic import BaseModel
from typing import Optional


# ─── DSA ────────────────────────────────────────────────────────

class DSAProblemCreate(BaseModel):
    title: str
    pattern: str
    difficulty: str
    completed: bool = False

class DSAProblemUpdate(BaseModel):
    completed: Optional[bool] = None
    time_taken: Optional[int] = None
    confidence: Optional[int] = None
    reflection: Optional[str] = None

class DSAProblemOut(BaseModel):
    id: int
    title: str
    pattern: str
    difficulty: str
    completed: bool
    time_taken: Optional[int]
    confidence: Optional[int]
    reflection: Optional[str]
    model_config = {"from_attributes": True}


# ─── Applications ────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    company: str
    role: str
    status: str
    applied_date: Optional[datetime] = None

class ApplicationOut(BaseModel):
    id: int
    company: str
    role: str
    status: str
    applied_date: Optional[datetime]
    model_config = {"from_attributes": True}


# ─── Interviews ────────────────────────────────────────────────

class InterviewCreate(BaseModel):
    company: str
    duration: Optional[int] = None
    round: str
    coding_score: Optional[int] = None
    backend_score: Optional[int] = None
    behavioral_score: Optional[int] = None
    feedback: Optional[str] = None

class InterviewOut(InterviewCreate):
    id: int
    timestamp: datetime
    model_config = {"from_attributes": True}


# ─── System Design ────────────────────────────────────────────────

class SystemDesignCreate(BaseModel):
    topic: str
    components: Optional[str] = None
    explanation: Optional[str] = None
    ai_feedback: Optional[str] = None

class SystemDesignOut(SystemDesignCreate):
    id: int
    timestamp: datetime
    model_config = {"from_attributes": True}


# ─── Projects ────────────────────────────────────────────────

class ProjectTaskCreate(BaseModel):
    title: str
    category: str
    completed: bool = False

class ProjectTaskOut(ProjectTaskCreate):
    id: int
    model_config = {"from_attributes": True}


# ─── Dashboard ────────────────────────────────────────────────

class PatternStats(BaseModel):
    pattern: str
    total: int
    completed: int

class DashboardStats(BaseModel):
    streak: int
    dsa: dict
    project: dict
    applications: dict
    interviews: dict
    system_design: dict
    patterns: list[PatternStats]
    github: dict | None = None
    readinessScore: float
    weaknesses: list[str]


class DailyPlan(BaseModel):
    day: int
    topic: str
    description: str
    problems: list[str]
    completed: bool


# ─── Auth ────────────────────────────────────────────────────────

class UserCreate(BaseModel):
    email: str
    password: str
    name: str

class UserOut(BaseModel):
    id: int
    email: str
    name: str
    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str
