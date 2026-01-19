from fastapi import FastAPI
from backend.api.lifespan import lifespan
from backend.api.setup import setup_routes, setup_middlewares
from utils.logging import logger_setup, logger_setup_file, logger_close



app = FastAPI(lifespan=lifespan)
setup_routes(app)
setup_middlewares(app)


