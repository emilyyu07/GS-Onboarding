from collections.abc import Callable
from typing import Any
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from datetime import datetime
import time
from backend.utils.logging import logger

class LoggerMiddleware(BaseHTTPMiddleware):

    async def dispatch(
        self, request: Request, call_next: Callable[[Request], Any]
    ) -> Response:
        """
        Logs all incoming and outgoing request, response pairs. This method logs the request params,
        datetime of request, duration of execution. Logs should be printed using the custom logging module provided.
        Logs should be printed so that they are easily readable and understandable.

        :param request: Request received to this middleware from client (it is supplied by FastAPI)
        :param call_next: Endpoint or next middleware to be called (if any, this is the next middleware in the chain of middlewares, it is supplied by FastAPI)
        :return: Response from endpoint
        """
        # TODO:(Member) Finish implementing this method

        start_time=time.time()
        request_time=datetime.now()
        params=request.query_params

        logger.info(f"Incoming request: {request.method} {request.url.path}")
        logger.info(f"Request time: {request_time}")
        logger.info(f"Request parameters: {dict(params)}")

        response = await call_next(request)
        duration=(time.time()-start_time)*1000

        logger.info(f"Duration of execution: {duration} ms")
        logger.info(f"Response status: {response.status_code}")

        return response
