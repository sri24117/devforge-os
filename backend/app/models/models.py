"""
SQLAlchemy ORM Models - PostgreSQL
Mirrors original SQLite schema from server.ts exactly
"""

from datetime import datetime
from sqlalchemy import (
    Integer, String, Boolean, DateTime, Text,
    ForeignKey, Float
)
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(100))
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String(255))
    streak: Mapped[int] = mapped_column(Integer, default=0)
    last_active: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)


class DSAProblem(Base):
    __tablename__ = "dsa_problems"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255))
    pattern: Mapped[str] = mapped_column(String(100))
    difficulty: Mapped[str] = mapped_column(String(20))  # Easy/Medium/Hard
    completed: Mapped[bool] = mapped_column(Boolean, default=False)
    time_taken: Mapped[int | None] = mapped_column(Integer, nullable=True)
    confidence: Mapped[int | None] = mapped_column(Integer, nullable=True)
    reflection: Mapped[str | None] = mapped_column(Text, nullable=True)


class ProjectTask(Base):
    __tablename__ = "project_tasks"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(255))
    category: Mapped[str] = mapped_column(String(50))  # Backend / Frontend
    completed: Mapped[bool] = mapped_column(Boolean, default=False)


class Application(Base):
    __tablename__ = "applications"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company: Mapped[str] = mapped_column(String(100))
    role: Mapped[str] = mapped_column(String(100))
    status: Mapped[str] = mapped_column(String(50))
    applied_date: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    rounds: Mapped[list["InterviewRound"]] = relationship(
        "InterviewRound", back_populates="application", cascade="all, delete"
    )


class Interview(Base):
    __tablename__ = "interviews"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    company: Mapped[str] = mapped_column(String(100))
    duration: Mapped[int | None] = mapped_column(Integer, nullable=True)
    round: Mapped[str] = mapped_column(String(50))
    coding_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    backend_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    behavioral_score: Mapped[int | None] = mapped_column(Integer, nullable=True)
    feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class SystemDesignSession(Base):
    __tablename__ = "system_design_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    topic: Mapped[str] = mapped_column(String(200))
    components: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON
    explanation: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)


class InterviewRound(Base):
    __tablename__ = "interview_rounds"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    application_id: Mapped[int] = mapped_column(ForeignKey("applications.id"))
    round_name: Mapped[str] = mapped_column(String(100))
    type: Mapped[str] = mapped_column(String(50))
    questions_asked: Mapped[str | None] = mapped_column(Text, nullable=True)
    user_answer: Mapped[str | None] = mapped_column(Text, nullable=True)
    improvement_notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    application: Mapped["Application"] = relationship("Application", back_populates="rounds")


class LeetCodeProfile(Base):
    __tablename__ = "leetcode_profiles"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100))
    total_solved: Mapped[int] = mapped_column(Integer, default=0)
    easy_solved: Mapped[int] = mapped_column(Integer, default=0)
    medium_solved: Mapped[int] = mapped_column(Integer, default=0)
    hard_solved: Mapped[int] = mapped_column(Integer, default=0)
    top_patterns: Mapped[str | None] = mapped_column(Text, nullable=True)  # JSON


class RoadmapPhase(Base):
    __tablename__ = "roadmap_phases"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    title: Mapped[str] = mapped_column(String(200))
    status: Mapped[str] = mapped_column(String(50), default="pending")
