from datetime import datetime
from typing import List
import uuid
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId

from ..database import get_database
from ..schemas import (
    SurveyCreate,
    SurveyUpdate,
    Survey,
    SurveyList,
    Question,
)

router = APIRouter(prefix="/api/surveys", tags=["surveys"])


def generate_share_id() -> str:
    """Generate a unique share ID."""
    return str(uuid.uuid4())[:8]


def survey_helper(survey: dict) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "id": str(survey["_id"]),
        "title": survey["title"],
        "description": survey.get("description"),
        "share_id": survey["share_id"],
        "questions": [
            {
                "id": q["id"],
                "text": q["text"],
                "type": q["type"],
                "required": q.get("required", False),
                "options": q.get("options"),
                "min_rating": q.get("min_rating", 1),
                "max_rating": q.get("max_rating", 5),
            }
            for q in survey.get("questions", [])
        ],
        "created_at": survey["created_at"],
        "updated_at": survey["updated_at"],
        "response_count": survey.get("response_count", 0),
    }


def survey_list_helper(survey: dict) -> dict:
    """Convert MongoDB document to list response format."""
    return {
        "id": str(survey["_id"]),
        "title": survey["title"],
        "description": survey.get("description"),
        "share_id": survey["share_id"],
        "created_at": survey["created_at"],
        "response_count": survey.get("response_count", 0),
    }


@router.post("", response_model=Survey, status_code=status.HTTP_201_CREATED)
async def create_survey(survey: SurveyCreate):
    """Create a new survey."""
    db = get_database()
    
    now = datetime.utcnow()
    questions_with_ids = [
        {
            "id": str(uuid.uuid4()),
            "text": q.text,
            "type": q.type.value,
            "required": q.required,
            "options": q.options,
            "min_rating": q.min_rating,
            "max_rating": q.max_rating,
        }
        for q in survey.questions
    ]
    
    survey_doc = {
        "title": survey.title,
        "description": survey.description,
        "share_id": generate_share_id(),
        "questions": questions_with_ids,
        "created_at": now,
        "updated_at": now,
        "response_count": 0,
    }
    
    result = await db.surveys.insert_one(survey_doc)
    survey_doc["_id"] = result.inserted_id
    
    return survey_helper(survey_doc)


@router.get("", response_model=List[SurveyList])
async def list_surveys():
    """List all surveys."""
    db = get_database()
    surveys = []
    cursor = db.surveys.find().sort("created_at", -1)
    async for survey in cursor:
        surveys.append(survey_list_helper(survey))
    return surveys


@router.get("/{survey_id}", response_model=Survey)
async def get_survey(survey_id: str):
    """Get a survey by ID."""
    db = get_database()
    
    try:
        survey = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    return survey_helper(survey)


@router.get("/share/{share_id}", response_model=Survey)
async def get_survey_by_share_id(share_id: str):
    """Get a survey by share ID (public endpoint)."""
    db = get_database()
    
    survey = await db.surveys.find_one({"share_id": share_id})
    
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    return survey_helper(survey)


@router.put("/{survey_id}", response_model=Survey)
async def update_survey(survey_id: str, survey_update: SurveyUpdate):
    """Update a survey."""
    db = get_database()
    
    try:
        existing = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if not existing:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    update_data = {"updated_at": datetime.utcnow()}
    
    if survey_update.title is not None:
        update_data["title"] = survey_update.title
    
    if survey_update.description is not None:
        update_data["description"] = survey_update.description
    
    if survey_update.questions is not None:
        update_data["questions"] = [
            {
                "id": str(uuid.uuid4()),
                "text": q.text,
                "type": q.type.value,
                "required": q.required,
                "options": q.options,
                "min_rating": q.min_rating,
                "max_rating": q.max_rating,
            }
            for q in survey_update.questions
        ]
    
    await db.surveys.update_one({"_id": ObjectId(survey_id)}, {"$set": update_data})
    
    updated = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    return survey_helper(updated)


@router.delete("/{survey_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_survey(survey_id: str):
    """Delete a survey and its responses."""
    db = get_database()
    
    try:
        result = await db.surveys.delete_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    # Also delete all responses for this survey
    await db.responses.delete_many({"survey_id": survey_id})
    
    return None
