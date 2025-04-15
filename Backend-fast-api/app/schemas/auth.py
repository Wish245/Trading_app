from pydantic import BaseModel

# 🔑 What the user sends to log in
class TokenRequest(BaseModel):
    username: str
    password: str

# 🛡️ What your backend sends back after successful login
class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"

# 🧾 Optional: Token payload (decoded from JWT)
class TokenData(BaseModel):
    username: str | None = None  # Optional, used for extracting user info from token
    user_id: int | None = None  # Optional, used for extracting user info from token
    roles: list[str] | None = [] # Optional, used for extracting user roles from token  