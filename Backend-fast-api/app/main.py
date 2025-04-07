from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # CORS middleware
from pydantic import BaseModel

app = FastAPI()

origins = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Who can talk to us
    allow_credentials=True,           # Cookies/credentials allowed?
    allow_methods=["*"],              # Allow GET, POST, PUT, DELETE, etc.
    allow_headers=["*"],              # Allow all headers (e.g. Content-Type)
)

mock_db = {
    "admin": "password123", "user": "pass"
}


class LoginRequest(BaseModel):
    username: str
    password: str


@app.post("/login")
async def login(data: LoginRequest):
    if data.username in mock_db and mock_db[data.username] == data.password:
        return JSONResponse(content={
            "status": "success",
            "userId": data.username,
            "message": f"Welcome, {data.username}!"
        }, status_code=200)
    else:
        return JSONResponse(content={
            "status": "error",
            "message": "Invalid credentials"
        }, status_code=401)
    
    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(app,host="0.0.0.0", port = 8000)