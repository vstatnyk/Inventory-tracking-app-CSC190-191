import React, { useState, useEffect } from 'react';
import { registerUser } from "../utils/api";

const YourComponent = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'employee',
  });

  const handleAddAccount = async () => {
    setIsFormOpen(true);
  };

  const handleFormSubmit = async (event) => {
    var role = 1;
    if (formData.role == "admin") {
        role = 2;
    }
    await registerUser(
      formData.email,
      formData.password,
      role,
      localStorage.getItem('token')
    );
    setIsFormOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const closeForm = () => {
    setIsFormOpen(false);
  };

  return (
    <div>
      <button onClick={handleAddAccount}>Add Account</button>

      {isFormOpen && (
        <div className="popup">
          <div className="popup-content">
            <form onSubmit={handleFormSubmit}>
                <br></br>
              <label>
                Email:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </label>
              <br></br>
              <label>
                Password:&nbsp;&nbsp;
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </label>
              <br></br>
              <label>
                Role:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              </label>
              <select className="accountRole"
                name="role"
                value={formData.role}
                onChange={handleInputChange}
              >
				  <option value="employee">Employee</option>
				  <option value="admin">Admin</option>
				</select>
              <br></br><br></br>

              <button type="submit">Submit</button>
              <button onClick={closeForm}>Close</button>
            </form>

          </div>
        </div>
      )}
    </div>
  );
};

export default YourComponent;