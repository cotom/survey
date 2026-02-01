from datetime import datetime
from typing import List, Optional, Any
from pydantic import BaseModel, Field
from enum import Enum


class QuestionType(str, Enum):
    TEXT = "text"
    MULTIPLE_CHOICE = "multiple_choice"
    CHECKBOX = "checkbox"
    RATING = "rating"
    DROPDOWN = "dropdown"


class QuestionBase(BaseModel):
    text: str
    type: QuestionType
    required: bool = False
    options: Optional[List[str]] = None
    min_rating: Optional[int] = 1
    max_rating: Optional[int] = 5


class QuestionCreate(QuestionBase):
    pass


class Question(QuestionBase):
    id: str


class SurveyBase(BaseModel):
    title: str
    description: Optional[str] = None


class SurveyCreate(SurveyBase):
    questions: List[QuestionCreate]


class SurveyUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    questions: Optional[List[QuestionCreate]] = None


class Survey(SurveyBase):
    id: str
    share_id: str
    questions: List[Question]
    created_at: datetime
    updated_at: datetime
    response_count: int = 0


class SurveyList(BaseModel):
    id: str
    title: str
    description: Optional[str]
    share_id: str
    created_at: datetime
    response_count: int


class AnswerBase(BaseModel):
    question_id: str
    value: Any


class ResponseCreate(BaseModel):
    answers: List[AnswerBase]


class Response(BaseModel):
    id: str
    survey_id: str
    answers: List[AnswerBase]
    submitted_at: datetime


class AnalyticsQuestion(BaseModel):
    question_id: str
    question_text: str
    question_type: QuestionType
    total_answers: int
    data: Any


class SurveyAnalytics(BaseModel):
    survey_id: str
    title: str
    total_responses: int
    questions: List[AnalyticsQuestion]
