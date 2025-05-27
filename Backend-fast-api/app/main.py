import logging
import time
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from app.api import profile
from app.api import stall
from app.logger import setup_logger
from app.api import auth# 🧩 Import other routers as you build
# from app.api import stock, orders, payments  # Uncomment when ready

# ✅ Setup logger
setup_logger()
logger = logging.getLogger(__name__)

# ✅ FastAPI app with metadata
app = FastAPI(
    title="Flower Market API",
    description="API backend for managing users, stalls, flowers, and payments in the flower marketplace.",
    version="1.0.0"
)

# ✅ Logging middleware
class LoggingMiddleware:
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        if scope["type"] == "http":
            method = scope["method"]
            path = scope["path"]
            start = time.time()

            async def send_wrapper(message):
                if message["type"] == "http.response.start":
                    status_code = message["status"]
                    elapsed = time.time() - start
                    logger.info(f"[HTTP] {method} {path} - {status_code} - {elapsed:.2f}s")
                await send(message)

            await self.app(scope, receive, send_wrapper)
        else:
            await self.app(scope, receive, send)

# ✅ Add middlewares
app.add_middleware(LoggingMiddleware)

# ✅ CORS (Frontend access)
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173"
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Lifecycle hooks
@app.on_event("startup")
async def startup():
    logger.info("[STARTUP] Flower Market backend initialized.")

@app.on_event("shutdown")
async def shutdown():
    logger.info("[SHUTDOWN] Flower Market backend shutting down.")

# ✅ Global error handler (Optional but powerful)
@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"[ERROR] {request.method} {request.url} - {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"detail": "Something went wrong. Please try again later."},
    )

# ✅ Include routers (prefixes optional based on your routes)
app.include_router(auth.router, tags=["auth"])
app.include_router(profile.router,prefix="/profile", tags=["profile"])
app.include_router(stall.router,prefix="/stall", tags=["profile"])