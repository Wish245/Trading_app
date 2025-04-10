from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from database import  AsyncSessionLocal, User, create_tables, get_db
from security import hash_password, verify_password
from models import SignupRequest, LoginRequest
from auth import create_token, get_current_user
from datetime import datetime

app = FastAPI()

origins = ["http://localhost:3000"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup():
    # Connect to the database
    # await database.connect()
    # Create tables if they don't exist
    await create_tables()

@app.on_event("shutdown")
async def shutdown():
    # await database.disconnect()
    pass

@app.post("/signup")
async def signup(user: SignupRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.username == user.username)
    result = await db.execute(query)
    existing_user = result.scalars().first()
    if existing_user:
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

    return JSONResponse(content={"status": "success", "message": "User  registered successfully"}, status_code=201)

@app.post("/login")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    query = select(User).where(User.username == data.username)
    result = await db.execute(query)
    user = result.scalars().first()
    if user and verify_password(data.password, user.password):
        token = create_token(user.id)
        return JSONResponse(content={
            "status": "success",
            "userId": user.id,
            "token": token,
            "message": f"Welcome, {data.username}!"
        }, status_code=200)
    else:
        raise HTTPException(status_code=401, detail="Invalid credentials")

@app.get("/protected")
async def protected(user_id: int = Depends(get_current_user)):
    return {"status": "success", "message": "Protected route access granted", "userId": user_id}

@app.post("/logout")
async def logout():
    # In a real-world app, you'd handle token blacklisting here.
    return JSONResponse(
        content={"status": "success", "message": "Logged out successfully"},
        status_code=200
    )
