import React, { useEffect, useState } from "react";
import axios from "axios";

function EmployeeDropdown() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8000/employees")
      .then((res) => {
        setEmployees(res.data);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (e) => {
    const empId = e.target.value;

    if (empId) {
      axios.get(`http://localhost:8000/employees/${empId}`)
        .then((res) => {
          setSelectedEmployee(res.data);
        })
        .catch((err) => console.error("Error fetching employee details:", err));
    } else {
      setSelectedEmployee(null);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome to Employee Dashboard</h2>

      <div>
        <label>Search Employee by Name: </label>
        <input
          type="text"
          placeholder="Enter name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <label>Select Employee: </label>
        <select onChange={handleSelect}>
          <option value="">-- Select an Employee --</option>
          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {selectedEmployee && (
        <div style={{ marginTop: "20px" }}>
          <h3>Employee Details</h3>
          <p><strong>Name:</strong> {selectedEmployee.name}</p>
          <p><strong>Date of Joining:</strong> {selectedEmployee.date_of_joining}</p>
          <p><strong>Role:</strong> {selectedEmployee.role}</p>
          <p><strong>Project Assigned:</strong> {selectedEmployee.project_assigned}</p>
          <p><strong>Project History:</strong> {selectedEmployee.project_history}</p>
        </div>
      )}
    </div>
  );
}

export default EmployeeDropdown;
