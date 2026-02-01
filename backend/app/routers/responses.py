from datetime import datetime
from typing import List
import uuid
from fastapi import APIRouter, HTTPException, status
from bson import ObjectId
from collections import Counter

from ..database import get_database
from ..schemas import (
    ResponseCreate,
    Response,
    SurveyAnalytics,
    AnalyticsQuestion,
)

router = APIRouter(prefix="/api/surveys", tags=["responses"])


def response_helper(response: dict) -> dict:
    """Convert MongoDB document to response format."""
    return {
        "id": str(response["_id"]),
        "survey_id": response["survey_id"],
        "answers": response["answers"],
        "submitted_at": response["submitted_at"],
    }


@router.post("/{survey_id}/responses", response_model=Response, status_code=status.HTTP_201_CREATED)
async def submit_response(survey_id: str, response: ResponseCreate):
    """Submit a response to a survey."""
    db = get_database()
    
    # Verify survey exists
    try:
        survey = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    # Validate required questions are answered
    question_map = {q["id"]: q for q in survey.get("questions", [])}
    answered_ids = {a.question_id for a in response.answers}
    
    for q in survey.get("questions", []):
        if q.get("required") and q["id"] not in answered_ids:
            raise HTTPException(
                status_code=400,
                detail=f"Required question not answered: {q['text']}"
            )
    
    response_doc = {
        "survey_id": survey_id,
        "answers": [{"question_id": a.question_id, "value": a.value} for a in response.answers],
        "submitted_at": datetime.utcnow(),
    }
    
    result = await db.responses.insert_one(response_doc)
    response_doc["_id"] = result.inserted_id
    
    # Update response count
    await db.surveys.update_one(
        {"_id": ObjectId(survey_id)},
        {"$inc": {"response_count": 1}}
    )
    
    return response_helper(response_doc)


@router.get("/{survey_id}/responses", response_model=List[Response])
async def get_responses(survey_id: str):
    """Get all responses for a survey."""
    db = get_database()
    
    # Verify survey exists
    try:
        survey = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    responses = []
    cursor = db.responses.find({"survey_id": survey_id}).sort("submitted_at", -1)
    async for response in cursor:
        responses.append(response_helper(response))
    
    return responses


@router.get("/{survey_id}/analytics", response_model=SurveyAnalytics)
async def get_analytics(survey_id: str):
    """Get analytics for a survey."""
    db = get_database()
    
    # Get survey
    try:
        survey = await db.surveys.find_one({"_id": ObjectId(survey_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid survey ID format")
    
    if not survey:
        raise HTTPException(status_code=404, detail="Survey not found")
    
    # Get all responses
    responses = []
    cursor = db.responses.find({"survey_id": survey_id})
    async for response in cursor:
        responses.append(response)
    
    # Build question map
    question_map = {q["id"]: q for q in survey.get("questions", [])}
    
    # Aggregate answers by question
    question_analytics = []
    for question in survey.get("questions", []):
        q_id = question["id"]
        q_type = question["type"]
        
        # Collect all answers for this question
        answers = []
        for resp in responses:
            for ans in resp.get("answers", []):
                if ans["question_id"] == q_id:
                    answers.append(ans["value"])
        
        # Generate analytics based on question type
        if q_type in ["multiple_choice", "dropdown"]:
            # Count occurrences
            counter = Counter(answers)
            data = [{"option": k, "count": v} for k, v in counter.items()]
        elif q_type == "checkbox":
            # Flatten and count (answers are lists)
            flat_answers = []
            for a in answers:
                if isinstance(a, list):
                    flat_answers.extend(a)
                else:
                    flat_answers.append(a)
            counter = Counter(flat_answers)
            data = [{"option": k, "count": v} for k, v in counter.items()]
        elif q_type == "rating":
            # Calculate distribution and average
            counter = Counter(answers)
            avg = sum(answers) / len(answers) if answers else 0
            data = {
                "distribution": [{"rating": k, "count": v} for k, v in sorted(counter.items())],
                "average": round(avg, 2),
            }
        else:  # text
            # Return list of text responses
            data = {"responses": answers}
        
        question_analytics.append({
            "question_id": q_id,
            "question_text": question["text"],
            "question_type": q_type,
            "total_answers": len(answers),
            "data": data,
        })
    
    return {
        "survey_id": survey_id,
        "title": survey["title"],
        "total_responses": len(responses),
        "questions": question_analytics,
    }
