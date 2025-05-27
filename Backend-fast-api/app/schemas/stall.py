from pydantic import BaseModel, ConfigDict

class CreateStall(BaseModel):
    user_id: int
    stall_name: str

class StallOut(BaseModel):
    user_id: int
    stall_id: int
    stall_name: str

    model_config = ConfigDict(from_attribute=True)