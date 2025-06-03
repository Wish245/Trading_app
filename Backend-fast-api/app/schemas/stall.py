from pydantic import BaseModel, ConfigDict

class CreateStall(BaseModel):
    # user_id: int
    stall_name: str

class StallOut(BaseModel):
    user_id: int
    stall_id: int
    stall_name: str

    class Config:
        from_attributes = True

class StallDel(BaseModel):
    stall_id: int