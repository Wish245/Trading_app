import logging
from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import AsyncSessionLocal, User, create_tables, get_db
from security import hash_password, verify_password
from models import SignupRequest, LoginRequest
from auth import create_token, get_current_user
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Log to a file
        logging.StreamHandler()          # Log to the console
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",  # Add this if needed
    "http://localhost:5173"   # Add this if using Vite or another dev server
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    logger.info("Starting up the application...")
    await create_tables()
    logger.info("Database tables created (if not already existing).")

@app.on_event("shutdown")
async def shutdown():
    logger.info("Shutting down the application...")

@app.post("/signup")
async def signup(user: SignupRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"Received signup request: {user}")
    logger.info(f"Signup request received for username: {user.username}")
    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        logger.warning(f"Signup failed: Username '{user.username}' already exists.")
        raise HTTPException(status_code=400, detail="Username already exists")

    hashed_pwd = hash_password(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        phone=user.phone,
        national_id=user.national_id,
        password=hashed_pwd,
        created_at=datetime.utcnow(),
    )
    db.add(new_user)
    await db.commit()
    logger.info(f"User '{user.username}' registered successfully.")
    return JSONResponse(content={"status": "success", "message": "User registered successfully"}, status_code=201)

@app.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"Login request received for username: {data.username}")
    query = select(User).where(User.username == data.username)
    result = await db.execute(query)
    user = result.scalars().first()
    if user and verify_password(data.password, user.password):
        token = create_token(user.id)
        logger.info(f"User '{data.username}' logged in successfully.")
        return JSONResponse(content={
            "status": "success",
            "userId": user.id,
            "token": token,
            "message": f"Welcome, {data.username}!"
        }, status_code=200)
    else:
        logger.warning(f"Login failed for username: {data.username}. Invalid credentials.")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/protected")
async def protected(user_id: int = Depends(get_current_user)):
    logger.info(f"Protected route accessed by user ID: {user_id}")
    return {"status": "success", "message": "Protected route access granted", "userId": user_id}

@app.post("/logout")
async def logout():
    logger.info("Logout request received.")
    return JSONResponse(
        content={"status": "success", "message": "Logged out successfully"},
        status_code=200
    )
