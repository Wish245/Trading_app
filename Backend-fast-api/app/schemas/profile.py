from pydantic import BaseModel, EmailStr, constr

class GetProfile(BaseModel):
    username: str
    national_id: str
    email: EmailStr
    phone: str

    

class UpdateUsername(BaseModel):
    username: str

class UpdateEmail(BaseModel):
    email: EmailStr

class UpdatePhone(BaseModel):
    phone: str

