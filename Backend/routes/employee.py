from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from models.employee import Employee
from schemas.employee import EmployeeCreate, EmployeeOut
from database import SessionLocal
from utils.auth import get_current_user, require_admin
import pandas as pd
from io import BytesIO

router = APIRouter(
    prefix="/employees",
    tags=["Employees"]
)

# Dependency to get DB session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# POST: Create a new employee (optional: make admin-only if you want)
@router.post("/", response_model=EmployeeOut)
def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db),
    user=Depends(require_admin)  # Only admin can create
):
    new_employee = Employee(**employee.dict())
    db.add(new_employee)
    db.commit()
    db.refresh(new_employee)
    return new_employee

# POST: Upload Excel/CSV file and bulk import employees (admin only)
@router.post("/upload/")
async def upload_file(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    user=Depends(require_admin)  # Only admin can upload
):
    content = await file.read()
    filename = file.filename

    try:
        if filename.endswith(".csv"):
            df = pd.read_csv(BytesIO(content))
        elif filename.endswith(".xlsx") or filename.endswith(".xls"):
            df = pd.read_excel(BytesIO(content))
        else:
            raise HTTPException(status_code=400, detail="File must be .csv, .xlsx, or .xls")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")

    required_columns = {"name", "date_of_joining", "role", "project_assigned", "project_history"}
    if not required_columns.issubset(df.columns):
        raise HTTPException(status_code=400, detail="Missing required columns in file")

    for _, row in df.iterrows():
        employee = Employee(
            name=row["name"],
            date_of_joining=row["date_of_joining"],
            role=row["role"],
            project_assigned=row["project_assigned"],
            project_history=row["project_history"]
        )
        db.add(employee)

    db.commit()
    return {"message": "Employees added successfully"}

# GET: Fetch all employees
@router.get("/", response_model=list[EmployeeOut])
def get_employees(db: Session = Depends(get_db)):
    return db.query(Employee).all()

# GET: Fetch single employee by ID
@router.get("/{employee_id}", response_model=EmployeeOut)
def get_employee(employee_id: int, db: Session = Depends(get_db)):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

# DELETE: Delete employee by ID (Admin only)
@router.delete("/{employee_id}")
def delete_employee(
    employee_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_admin)  # Admin only
):
    employee = db.query(Employee).filter(Employee.id == employee_id).first()
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    db.delete(employee)
    db.commit()
    return {"message": f"Employee with ID {employee_id} deleted successfully"}
