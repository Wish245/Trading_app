from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stall as stall_crud
from app.schemas.stall import CreateStall, StallOut
from app.api.deps import get_current_user
from app.models.users import User

router = APIRouter()

@router.post("/create", response_model=StallOut, status_code=status.HTTP_201_CREATED)
def stall_create(stall_data: CreateStall, db: Session = Depends(get_db), current_user: User = Depends(get_current_user) ):
    try:
        stall = stall_crud.create_stall(db, current_user.user_id, stall_data.stall_name )
        return stall
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Creating the stall failed")