import logging
import time
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from logger import setup_logger  # ✅ Logger setup module

# ✅ Initialize logger
setup_logger()
logger = logging.getLogger(__name__)

app = FastAPI()

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

# ✅ Register logging middleware
app.add_middleware(LoggingMiddleware)

# ✅ CORS setup
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

@app.on_event("startup")
async def startup():
    logger.info("[STARTUP] Development environment initialized.")

@app.on_event("shutdown")
async def shutdown():
    logger.info("[SHUTDOWN] Development environment shutting down.")
