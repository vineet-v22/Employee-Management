import React, { useEffect, useState } from "react";
import axios from "../api/axios"; // Use your custom axios instance

export default function EmployeeDropdownList() {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  // Fetch employees on mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await axios.get("/employees");
      setEmployees(res.data);
    } catch (err) {
      console.error("Error fetching employees:", err);
    }
  };

  // Filter employees by search term
  const filteredEmployees = employees.filter((emp) =>
    emp.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Select employee and fetch details (if needed)
  const handleSelect = async (e) => {
    const empId = e.target.value;
    if (empId) {
      try {
        const res = await axios.get(`/employees/${empId}`);
        setSelectedEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    } else {
      setSelectedEmployee(null);
    }
  };

  // Delete employee
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((emp) => emp.id !== id));
      // If deleted employee was selected, clear details
      if (selectedEmployee && selectedEmployee.id === id) {
        setSelectedEmployee(null);
      }
    } catch (err) {
      alert("Unauthorized to delete");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Employee Dashboard</h2>

      {/* Search Input */}
      <div className="mb-4">
        <label className="font-semibold">Search Employee by Name: </label>
        <input
          type="text"
          placeholder="Enter name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border px-2 py-1 rounded ml-2"
        />
      </div>

      {/* Dropdown */}
      <div className="mb-4">
        <label className="font-semibold">Select Employee: </label>
        <select
          onChange={handleSelect}
          className="border px-2 py-1 rounded ml-2"
          value={selectedEmployee ? selectedEmployee.id : ""}
        >
          <option value="">-- Select an Employee --</option>
          {filteredEmployees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.name}
            </option>
          ))}
        </select>
      </div>

      {/* Employee List with Delete */}
      <ul className="space-y-2 mb-4">
        {filteredEmployees.map((emp) => (
          <li
            key={emp.id}
            className={`flex justify-between items-center border p-3 rounded shadow ${
              selectedEmployee && selectedEmployee.id === emp.id
                ? "bg-blue-100"
                : ""
            }`}
          >
            <span>
              {emp.name} - {emp.role}
            </span>
            <button
              onClick={() => handleDelete(emp.id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Employee Details */}
      {selectedEmployee && (
        <div className="mt-6 p-4 border rounded shadow bg-gray-50">
          <h3 className="text-xl font-semibold mb-2">Employee Details</h3>
          <p>
            <strong>Name:</strong> {selectedEmployee.name}
          </p>
          <p>
            <strong>Date of Joining:</strong> {selectedEmployee.date_of_joining}
          </p>
          <p>
            <strong>Role:</strong> {selectedEmployee.role}
          </p>
          <p>
            <strong>Project Assigned:</strong> {selectedEmployee.project_assigned}
          </p>
          <p>
            <strong>Project History:</strong> {selectedEmployee.project_history}
          </p>
        </div>
      )}
    </div>
  );
}
