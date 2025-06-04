from fastapi import APIRouter, Depends, HTTPException, status, Response,Query, UploadFile, File, Form
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.crud import stall as stall_crud
from app.schemas.stall import CreateStall, StallOut, StallDel
from app.api.deps import get_current_user
from app.models.users import User
from typing import List,Optional
import app.logger
import os
from fastapi.responses import JSONResponse

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



@router.post("/upload-background", status_code=status.HTTP_200_OK)
async def upload_stall_background(
    stall_id: int = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """
    Upload (or replace) background image for a given stall.
    Saves the file as: assets/Stall-Bgm/stall_{stall_id}.png
    Then updates DB.stall.stall_bg_img to the relative path.
    """
    # 1) Ensure the directory exists
    upload_dir = os.path.join("assets", "Stall-Bgm")
    os.makedirs(upload_dir, exist_ok=True)

    # 2) Compute destination filename. For simplicity, we overwrite any existing file.
    filename = f"stall_{stall_id}.png"
    dest_path = os.path.join(upload_dir, filename)

    # 3) Write the file to disk
    try:
        contents = await image.read()
        with open(dest_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        logger.error(f"upload_stall_background: failed to save file for stall {stall_id}: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not save background image.",
        )

    # 4) Update the DB record (store relative path as "Stall-Bgm/stall_{stall_id}.png")
    #    Depending on your static‐files mount, you might store: "Stall-Bgm/stall_{stall_id}.png"
    db_filename = f"Stall-Bgm/{filename}"
    updated = stall_crud.set_stall_background(db, stall_id, db_filename)
    if not updated:
        # If no stall was found, delete the file we just wrote
        try:
            os.remove(dest_path)
        except:
            pass
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stall not found")

    return JSONResponse({"message": "Background image uploaded successfully"})


@router.delete("/remove-background", status_code=status.HTTP_200_OK)
def remove_stall_background(
    stall_id: int = Query(...),
    db: Session = Depends(get_db),
):
    """
    Remove (delete) the background image file on disk, and clear stall_bg_img in DB.
    """
    # 1) Fetch the stall to get the current filename (so we know which file to remove)
    stall = db.query(stall_crud.stall_model).filter(stall_crud.stall_model.stall_id == stall_id).first()
    if not stall:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Stall not found")

    current_path = stall.stall_bg_img  # e.g. "Stall-Bgm/stall_{stall_id}.png"
    if current_path:
        full_path = os.path.join("assets", current_path)
        if os.path.exists(full_path):
            try:
                os.remove(full_path)
            except Exception as e:
                logger.error(f"remove_stall_background: could not delete file {full_path}: {e}")
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail="Failed to delete background file from disk",
                )

    # 2) Clear the database field
    cleared = stall_crud.remove_stall_background(db, stall_id)
    if not cleared:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Could not clear DB field")

    return JSONResponse({"message": "Background image removed successfully"})