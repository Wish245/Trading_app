# logger.py (updated with colorlog)
import logging
from logging.handlers import TimedRotatingFileHandler
from colorlog import ColoredFormatter

def setup_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)

    # File formatter (no color)
    file_formatter = logging.Formatter(
        "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
    )

    # Color formatter for console output
    color_formatter = ColoredFormatter(
        "%(log_color)s%(asctime)s - %(levelname)s - %(message)s",
        log_colors={
            "DEBUG": "cyan",
            "INFO": "green",
            "WARNING": "yellow",
            "ERROR": "red",
            "CRITICAL": "bold_red",
        }
    )

    file_handler = TimedRotatingFileHandler(
        "app.log", when="midnight", interval=1, backupCount=7, encoding="utf-8"
    )
    file_handler.setFormatter(file_formatter)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(color_formatter)

    # Clear duplicate handlers if rerun
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(stream_handler)
