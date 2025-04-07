from fastapi import FastAPI, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware  # CORS middleware

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
    "user@example.com": "password123"
}

@app.post("/login")
async def login(email: str = Form(...), password: str = Form(...)):
    if email in mock_db and mock_db[email] == password:
        return JSONResponse(content={"message": "Login successful"}, status_code=200)
    else:
        return JSONResponse(content={"message": "Invalid credentials"}, status_code=401)
    
    if __name__ == "__main__":
        import uvicorn
        uvicorn.run(app,host="0.0.0.0", port = 8000)