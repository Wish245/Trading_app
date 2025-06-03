from fastapi import APIRouter, Depends, HTTPException, status, Response,Query
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stall as stall_crud
from app.schemas.stall import CreateStall, StallOut, StallDel
from app.api.deps import get_current_user
from app.models.users import User
from typing import List,Optional
import app.logger

logger = app.logger.get_logger(__name__)

router = APIRouter()

@router.post("/create", response_model=StallOut, status_code=status.HTTP_201_CREATED)
def stall_create(stall_data: CreateStall, db: Session = Depends(get_db), current_user: User = Depends(get_current_user) ):
    try:
        existing_stall = stall_crud.get_stall_by_stall_name(db, stall_data.stall_name)
        if existing_stall:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid stallname",
            )
        stall = stall_crud.create_stall(db, current_user.user_id, stall_data.stall_name )
        logger.info(f"Received stall creation request: {stall_data}")
        return stall
    except Exception:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, details="Creating the stall failed")
    

@router.get("/all", response_model=List[StallOut])
def all_stalls(db: Session = Depends(get_db)):
    try:
        stall = stall_crud.get_all_stall(db)
        return stall
    except Exception:
        raise HTTPException(status_code=404, details="Stalls not found")

@router.get("/me", response_model=Optional[List[StallOut]])
def my_stalls(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    try:
        stall = stall_crud.get_my_stall(db, current_user.user_id)
        return stall
    except Exception:
        raise HTTPException(status_code=404, details="Stalls not found")
    
@router.delete("/delete", response_model=dict)
def delete_stall(stall_id: int = Query(...), db: Session = Depends(get_db)):
    success = stall_crud.delete_stall(db, stall_id)
    if not success:
        raise HTTPException(status_code=404, detail="Stall not found")
    return {"message": "Stall deleted successfully"}