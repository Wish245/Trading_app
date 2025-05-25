from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.schemas.auth import TokenResponse
from app.crud.profile import get_user_profile, edit_email,edit_phone,edit_username
from app.schemas.profile import GetProfile,UpdateEmail,UpdatePhone,UpdateUsername
from app.models.users import User
from app.models.contact import Contact
from app.api.deps import get_current_user
from app.crud import profile as profile_crud

router = APIRouter()

@router.get("/me", response_model=GetProfile)
def get_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = profile_crud.get_user_profile(db, current_user.user_id)
    if not profile:
        raise HTTPException(status_code=404, detail="User not found")
    return profile

@router.put("/username", response_model=UpdateUsername)
def update_username(
    payload: UpdateUsername,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        updated_user = profile_crud.edit_username(db, current_user.user_id, payload.username)
        return {"username": updated_user.username}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception:
        raise HTTPException(status_code=500, detail="Failed to update username")
    
@router.put("/email", response_model=UpdateEmail)
def update_email(
    payload: UpdateEmail,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        updateed_user = profile_crud.edit_email(db, current_user.user_id, payload.email)
        return{"email": payload.email}
    except Exception:
        raise HTTPException(status_code=500, detail="failed to update email")
    

@router.put("/phone", response_model=UpdatePhone)
def update_phone(
    payload: UpdatePhone,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        updated_user = profile_crud.edit_email(db, current_user.user_id, payload.phone )
        return{"phone": payload.phone}
    except Exception:
        raise HTTPException(status_code=500, detail="failed to update phonr")
    