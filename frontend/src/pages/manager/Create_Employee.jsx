import { useEffect, useState } from 'react';
import axios from 'axios';
import { getToken, getRole } from '../../utils/authStorage';
// [CHANGE] Import your background image
// !! You may need to change this path depending on your file structure !!

export default function Create_Employee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [dept, setDept] = useState('');
  const [deptId, setDeptId] = useState(null);
  const [employeesRoleId, setEmployeesRoleId] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // [LOGIC UNCHANGED]
  useEffect(() => {
    const token = getToken();
    const role = getRole();
    if (!token || (role || '').toLowerCase() !== 'manager') {
      window.location.href = '/login';
      return;
    }
    preloadManagerContext();
  }, []);

  // [LOGIC UNCHANGED]
  const preloadManagerContext = async () => {
    try {
      const profileRes = await axios.get('http://localhost:3000/auth/profile', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const profile = profileRes.data.user || profileRes.data;
      const deptName =
        profile.dept || profile.department || profile.dept_name || '';
      setDept(deptName);

      const deptsRes = await axios.get('http://localhost:3000/departments', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const matchDept = (deptsRes.data || []).find(
        (d) => (d.name || '').toLowerCase() === (deptName || '').toLowerCase()
      );
      if (matchDept) setDeptId(matchDept.id);

      const rolesRes = await axios.get('http://localhost:3000/roles', {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      const employeeRole = (rolesRes.data || []).find(
        (r) => (r.role_name || '').toLowerCase() === 'employee'
      );
      if (employeeRole) setEmployeesRoleId(employeeRole.id);
    } catch (err) {
      console.error('Error preloading manager context', err);
    }
  };

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 5000);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      showMessage('Passwords do not match', 'error');
      return;
    }

    const userData = {
      name,
      email,
      password,
      dept_id: deptId,
      dept: dept,
      role_id: employeesRoleId,
      role: 'Employee',
    };

    try {
      await axios.post('http://localhost:3000/auth/register', userData);
      showMessage('Employee created successfully!', 'success');
      setName('');
      setEmail('');
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      const backendMessage = error.response?.data?.message || error.message || '';
      const lower = String(backendMessage).toLowerCase();
      if (lower.includes('email') && (lower.includes('exist') || lower.includes('already'))) {
        showMessage('Email already exists. Please use a different email.', 'error');
      } else {
        showMessage(
          'Error creating employee: ' + backendMessage,
          'error'
        );
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full max-w-md mx-auto flex items-center justify-center p-4"
    >
      
      <div className="w-full max-w-md mt-[-80px] mx-auto bg-white/10 backdrop-blur-md p-8 rounded-lg shadow-xl border border-white/20">
        
        
        <h2 className="text-2xl text-white text-center font-bold mb-6">
          Create Employee
        </h2>
        
        
        {message && (
          <div
            className={`mb-4 p-3 rounded-md ${
              messageType === 'success'
                ? 'bg-green-600 text-white' 
                : 'bg-red-600 text-white' 
            }`}
          >
            <p className="text-sm font-medium">{message}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            
            <label className="block text-gray-200">Name</label>
            
            <input
              type="text"
              value={name}
              placeholder="Enter Name"
              onChange={(e) => setName(e.target.value)}
              className="w-full text-white bg-transparent p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Email</label>
            <input
              type="email"
              value={email}
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-white bg-transparent p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Department</label>
            <input
              type="text"
              value={dept}
              disabled
              className="w-full text-gray-300 p-2 border border-gray-500 rounded bg-white/10 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Role</label>
            <input
              type="text"
              value="Employee"
              disabled
              className="w-full text-gray-300 p-2 border border-gray-500 rounded bg-white/10 cursor-not-allowed"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-white bg-transparent p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-200">Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              placeholder="Enter Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full text-white bg-transparent p-2 border border-gray-400 rounded focus:outline-none focus:ring-2 focus:ring-white/50 placeholder-gray-400"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
}