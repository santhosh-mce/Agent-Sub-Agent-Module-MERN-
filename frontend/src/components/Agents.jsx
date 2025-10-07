import React, { useState, useEffect } from "react";
import API from "../api";

export default function Agents({ reload }) {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91", // default country code
    mobile: "",
    password: "",
    active: true,
    taskCapacity: 10,
  });
  const [editId, setEditId] = useState(null);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchAgents();
  }, [reload]);

  const fetchAgents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/agents");
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load agents");
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  // Handle mobile input (allow numbers only, min 10 digits)
  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits
    setForm({ ...form, mobile: value });
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile length
    if (form.mobile.length < 10) {
      setMsg("Mobile number must be at least 10 digits");
      return;
    }

    try {
      const payload = {
        ...form,
        mobile: `${form.countryCode}${form.mobile}`, // prepend country code
      };

      if (editId) {
        await API.put(`/agents/${editId}`, payload);
        setMsg("Agent updated successfully");
      } else {
        await API.post("/agents", payload);
        setMsg("Agent added successfully");
      }

      setForm({
        name: "",
        email: "",
        countryCode: "+91",
        mobile: "",
        password: "",
        active: true,
        taskCapacity: 10,
      });
      setEditId(null);
      fetchAgents();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  const handleEdit = (agent) => {
    // extract country code from mobile number if exists
    let countryCode = "+91";
    let mobile = agent.mobile || "";
    const match = mobile.match(/^(\+\d{1,4})/);
    if (match) {
      countryCode = match[1];
      mobile = mobile.replace(countryCode, "");
    }

    setForm({
      name: agent.name,
      email: agent.email,
      countryCode,
      mobile,
      password: "",
      active: agent.active,
      taskCapacity: agent.taskCapacity,
    });
    setEditId(agent._id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      await API.delete(`/agents/${id}`);
      setMsg("Agent deleted successfully");
      fetchAgents();
    } catch (err) {
      setMsg(err.response?.data?.msg || "Error");
      console.error(err);
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 m-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Agents</h2>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
          {msg && (
            <div className="mb-4 text-sm font-medium text-green-600">{msg}</div>
          )}

          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
          >
            <input
              name="name"
              placeholder="Name"
              value={form.name}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            {/* Country Code + Mobile */}
            <div className="flex gap-2 items-center col-span-2">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="px-1 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="+1">+1 (US)</option>
                <option value="+91">+91 (IN)</option>
                <option value="+44">+44 (UK)</option>
                <option value="+971">+971 (UAE)</option>
              </select>
              <input
                name="mobile"
                value={form.mobile}
                onChange={handleMobileChange}
                type="tel"
                placeholder="Phone Number"
                className="flex-1 px-4 py-2 border  rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <input
              name="password"
              type="password"
              placeholder={editId ? "Leave blank to keep current" : "Password"}
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 border col-span-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required={!editId}
            />

            <input
              type="number"
              name="taskCapacity"
              value={form.taskCapacity}
              onChange={handleChange}
              placeholder="Task Capacity"
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-5 w-5"
              />
              <label>Active</label>
            </div>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition col-span-full"
            >
              {editId ? "Update Agent" : "Add Agent"}
            </button>
          </form>
        </div>

        <div className="overflow-x-auto col-span-3">
          {loading ? (
            <p className="text-gray-500 text-center">Loading agents...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile</th>
                  <th>Active</th>
                  <th>Task Capacity</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {agents.length ? (
                  agents.map((a) => {
                    // Extract country code and last 10 digits
                    let countryCode = "";
                    let mobileNumber = a.mobile || "";
                    const match = mobileNumber.match(/^(\+\d{1,4})(\d{10,})$/);
                    if (match) {
                      countryCode = match[1];
                      mobileNumber = match[2].slice(-10); // last 10 digits
                    } else {
                      // fallback if no country code
                      mobileNumber = mobileNumber.slice(-10);
                    }

                    return (
                      <tr key={a._id} className="hover:bg-gray-50 transition">
                        <td>{a.name}</td>
                        <td>{a.email}</td>
                        <td>
                          <div className="flex gap-0.5">
                            <span className="font-semibold">{countryCode}</span>
                            {mobileNumber}
                          </div>
                        </td>
                        <td>{a.active ? "Yes" : "No"}</td>
                        <td>{a.taskCapacity}</td>
                        <td className="flex gap-2">
                          <button
                            onClick={() => handleEdit(a)}
                            className="bg-yellow-500 text-white px-3 py-1 rounded-md hover:bg-yellow-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(a._id)}
                            className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center text-gray-500">
                      No agents added yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
