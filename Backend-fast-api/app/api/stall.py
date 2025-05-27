from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud.stall import create_stall
from app.schemas.stall import CreateStall, StallOut
from app.api.deps import get_current_user

router = APIRouter()

@router.post("/create", response_model=StallOut)
def create_stall(
    db: Session = Depends(get_db),
    
)