import logging
import time
from fastapi import FastAPI, HTTPException, status, Depends, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import AsyncSessionLocal, User, create_tables, get_db
from security import hash_password, verify_password
from models import SignupRequest, LoginRequest
from auth import create_token, get_current_user
from datetime import datetime

from logger import setup_logger  # ✅ NEW: Import logger setup from separate file

setup_logger()  # ✅ NEW: Initialize logger (with rotation etc.)
logger = logging.getLogger(__name__)  # ✅ Use module-level logger

app = FastAPI()

# ✅ NEW: Middleware for logging each HTTP request (method, path, status, duration)
class LoggingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            method = scope["method"]
            path = scope["path"]
            start = time.time()

            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    status_code = message["status"]
                    elapsed = time.time() - start
                    logger.info(f"[HTTP] {method} {path} - {status_code} - {elapsed:.2f}s")
                await send(message)

            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)

# ✅ Register the logging middleware
app.add_middleware(LoggingMiddleware)

# CORS setup
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
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
    logger.info("[STARTUP] App booting up...")
    await create_tables()
    logger.info("[STARTUP] Database tables ensured.")

@app.on_event("shutdown")
async def shutdown():
    logger.info("[SHUTDOWN] App is shutting down...")

@app.post("/signup")
async def signup(user: SignupRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"[SIGNUP_ATTEMPT] Username: {user.username}, Email: {user.email}")
    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
        logger.warning(f"[SIGNUP_FAIL] Username '{user.username}' already exists.")
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
    logger.info(f"[SIGNUP_SUCCESS] User '{user.username}' registered.")
    return JSONResponse(content={"status": "success", "message": "User registered successfully"}, status_code=201)

@app.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    logger.info(f"[LOGIN_ATTEMPT] Username: {data.username}")
    query = select(User).where(User.username == data.username)
    result = await db.execute(query)
    user = result.scalars().first()
    if user and verify_password(data.password, user.password):
        token = create_token(user.id)
        logger.info(f"[LOGIN_SUCCESS] Username: {data.username}, User ID: {user.id}")
        return JSONResponse(content={
            "status": "success",
            "userId": user.id,
            "token": token,
            "message": f"Welcome, {data.username}!"
        }, status_code=200)
    else:
        logger.warning(f"[LOGIN_FAIL] Username: {data.username}. Invalid credentials.")
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/protected")
async def protected(user_id: int = Depends(get_current_user)):
    logger.info(f"[PROTECTED] Accessed by user ID: {user_id}")
    return {"status": "success", "message": "Protected route access granted", "userId": user_id}

@app.post("/logout")
async def logout():
    logger.info("[LOGOUT] Logout triggered.")
    return JSONResponse(
        content={"status": "success", "message": "Logged out successfully"},
        status_code=200
    )
