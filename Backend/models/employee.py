from sqlalchemy import Column, Integer, String, Date
from database import Base

class Employee(Base):
    __tablename__ = "employees"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    date_of_joining = Column(Date, nullable=False)
    role = Column(String, nullable=False)
    project_assigned = Column(String, nullable=True)
    project_history = Column(String, nullable=True)
