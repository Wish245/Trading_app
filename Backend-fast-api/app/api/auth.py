from fastapi import APIRouter, Depends, HTTPException, status, Response
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer
from app.db.session import get_db
from app.schemas.auth import TokenResponse
from app.core.security import create_access_token
from app.crud.auth import authenticate_user
from app.crud.users import create_user, get_user_by_username
from app.schemas.users import UserCreate,UserOut
from app.schemas.auth import TokenRequest

router = APIRouter()

@router.post("/login", response_model=TokenResponse)
def login(request:TokenRequest, db: Session = Depends(get_db)):
    user = authenticate_user(db, request.username, request.password)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail= "Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user.username})
    return TokenResponse(access_token=access_token, token_type="bearer")


@router.post("/signup", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def signup(user_data: UserCreate, db: Session = Depends(get_db)):
    existing_user = get_user_by_username(db, user_data.username)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already taken.0"
        )
    
    user = create_user(db, user_data)

    return user

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

@router.post("/logout", status_code=status.HTTP_200_OK)
def logout(response: Response):
    """
    Symbolic logout. Frontend should delete token.
    """
    # You can log the logout or perform analytics here
    return {"message": "You have been logged out successfully."}