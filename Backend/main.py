from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI
from routes import employee,auth
from database import engine, Base


Base.metadata.create_all(bind=engine)
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Only your frontend is allowed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(employee.router)
app.include_router(auth.router)