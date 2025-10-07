FROM python:3.11-slim

WORKDIR /app

RUN pip install fastapi

RUN pip install uvicorn[standard]

RUN pip install pydantic

COPY . .
