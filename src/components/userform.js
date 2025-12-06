import React, { useState, useEffect } from "react";

function UserForm() {
  const [form, setForm] = useState({ name: "", email: "", age: "" });
  const [users, setUsers] = useState([]);

  // Fetch users from backend
  const fetchUsers = async () => {
    const res = await fetch("https://3-d-backend-3pgu.vercel.app/api/users");
    const data = await res.json();
    setUsers(data);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch("https://3-d-backend-3pgu.vercel.app/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ name: "", email: "", age: "" });
    fetchUsers(); // refresh list
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          placeholder="Age"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      <h3>User List</h3>
      <ul>
        {users.map((u) => (
          <li key={u._id}>
            {u.name} - {u.email} - {u.age}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserForm;
