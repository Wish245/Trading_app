from pydantic import BaseModel, EmailStr, constr, ConfigDict
from typing import Optional, Annotated

# class ContactCreate(BaseModel):
#     contact_type: str
#     contact_value: str
#     is_primary: Optional[bool] = False

class UserCreate(BaseModel):
    username: str
    national_id: str
    password: Annotated[str,constr(min_length=8)]
    email: EmailStr
    phone: str

class UserOut(BaseModel):
    user_id: int
    username: str
    national_id: str
    email: EmailStr
    phone: str

    model_config = ConfigDict(from_attributes=True)