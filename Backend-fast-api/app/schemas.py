from pydantic import BaseModel, EmailStr

class SignupRequest(BaseModel):
    username: str
    email: EmailStr
    phone: str
    national_id: str
    password: str

class LoginRequest(BaseModel):
    username: str
    password: str
