from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import connect_to_mongo, close_mongo_connection, create_indexes
from .routers import surveys, responses

app = FastAPI(
    title="Survey App API",
    description="API for creating, sharing, and analyzing surveys",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    """Connect to MongoDB on startup."""
    await connect_to_mongo()
    await create_indexes()


@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown."""
    await close_mongo_connection()


# Include routers
app.include_router(surveys.router)
app.include_router(responses.router)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Survey App API", "docs": "/docs"}


@app.get("/health")
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}
