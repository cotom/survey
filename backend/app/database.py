import os
from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.errors import ConnectionFailure

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "survey_app")

client: AsyncIOMotorClient = None
db = None


async def connect_to_mongo():
    """Connect to MongoDB."""
    global client, db
    try:
        client = AsyncIOMotorClient(MONGODB_URL)
        db = client[DATABASE_NAME]
        await client.admin.command("ping")
        print(f"Connected to MongoDB at {MONGODB_URL}")
    except ConnectionFailure as e:
        print(f"Could not connect to MongoDB: {e}")
        raise


async def close_mongo_connection():
    """Close MongoDB connection."""
    global client
    if client:
        client.close()
        print("Closed MongoDB connection")


def get_database():
    """Get database instance."""
    return db


async def create_indexes():
    """Create indexes for collections."""
    if db is None:
        return
    
    # Surveys collection indexes
    await db.surveys.create_index("created_at", background=True)
    await db.surveys.create_index("share_id", unique=True, background=True)
    
    # Responses collection indexes
    await db.responses.create_index("survey_id", background=True)
    await db.responses.create_index([("survey_id", 1), ("submitted_at", -1)], background=True)
    
    print("Created database indexes")
