import React, { useState, useEffect } from "react";
import API from "../api";

export default function SubAgents({ reload }) {
  const [subs, setSubs] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "",
    email: "",
    countryCode: "+91",
    mobile: "",
    password: "",
    active: true,
    taskCapacity: 10,
    parentAgent: "",
  });
  const [msg, setMsg] = useState("");
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchSubs();
    fetchAgents();
  }, [reload]);

  const fetchSubs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/subagents");
      setSubs(res.data);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load Sub-Agents");
    } finally {
      setLoading(false);
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await API.get("/agents");
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      setMsg("Failed to load Agents");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleMobileChange = (e) => {
    let value = e.target.value.replace(/\D/g, ""); // only digits
    if (value.length > 10) value = value.slice(0, 10); // limit to 10 digits
    setForm({ ...form, mobile: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.parentAgent) {
      setMsg("Please select a Parent Agent");
      return;
    }
    if (!form.mobile || form.mobile.length !== 10) {
      setMsg("Mobile number must be 10 digits");
      return;
    }

    try {
      const payload = {
        ...form,
        phone: `${form.countryCode}${form.mobile}`, // combine country code + mobile
      };

      if (editId) {
        await API.put(`/subagents/${editId}`, payload);
        setMsg("Sub-Agent updated successfully");
      } else {
        await API.post("/subagents", payload);
        setMsg("Sub-Agent added successfully");
      }

      setForm({
        name: "",
        email: "",
        countryCode: "+91",
        mobile: "",
        password: "",
        active: true,
        taskCapacity: 10,
        parentAgent: "",
      });
      setEditId(null);
      fetchSubs();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  const handleEdit = (sub) => {
    let country = "+91";
    let mobile = sub.phone || "";
    if (mobile.startsWith("+")) {
      const match = mobile.match(/^(\+\d+)(\d{10})$/);
      if (match) {
        country = match[1];
        mobile = match[2];
      }
    }

    setForm({
      name: sub.name,
      email: sub.email,
      countryCode: country,
      mobile: mobile,
      password: "",
      active: sub.active,
      taskCapacity: sub.taskCapacity,
      parentAgent: sub.parentAgent?._id || "",
    });
    setEditId(sub._id);
    setMsg("");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await API.delete(`/subagents/${id}`);
      setMsg("Sub-Agent deleted successfully");
      fetchSubs();
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.msg || "Error");
    }
  };

  return (
    <div className="max-w-full mx-auto p-6 m-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Sub-Agents</h2>

      <div className="grid grid-cols-5 gap-4">
        <div className="col-span-2">
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
            <div className="flex gap-2 items-center col-span-2">
              <select
                name="countryCode"
                value={form.countryCode}
                onChange={handleChange}
                className="px-2 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                placeholder="Phone Number (10 digits)"
                className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <input
              name="password"
              type="password"
              placeholder={editId ? "Leave blank to keep current" : "Password"}
              value={form.password}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <select
              name="parentAgent"
              value={form.parentAgent}
              onChange={handleChange}
              className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Parent Agent</option>
              {agents.map((agent) => (
                <option key={agent._id} value={agent._id}>
                  {agent.name} ({agent.email})
                </option>
              ))}
            </select>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="active"
                checked={form.active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <span className="text-gray-700">Active</span>
            </label>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition col-span-full"
            >
              {editId ? "Update Sub-Agent" : "Add Sub-Agent"}
            </button>
          </form>
          {msg && <div className="mb-4 text-green-600 font-medium">{msg}</div>}
        </div>

        {/* Table */}
        <div className="overflow-x-auto col-span-3">
          {loading ? (
            <p className="text-gray-500 text-center">Loading Sub-Agents...</p>
          ) : (
            <table className="min-w-full divide-y divide-gray-200 border">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Mobile</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Active</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Task Capacity</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Parent Agent</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {subs.map((sub) => {
                  let country = sub.phone?.slice(0, sub.phone.length - 10) || "";
                  let mobile = sub.phone?.slice(-10) || "";
                  return (
                    <tr key={sub._id} className="hover:bg-gray-50">
                      <td className="px-4 py-2">{sub.name}</td>
                      <td className="px-4 py-2">{sub.email}</td>
                      <td className="px-4 py-2">
                        <div className="flex gap-0.5">
                          <span className="font-semibold">{country}</span>
                        {mobile}
                        </div>
                        </td>
                      <td className="px-4 py-2">{sub.active ? "Yes" : "No"}</td>
                      <td className="px-4 py-2">{sub.taskCapacity}</td>
                      <td className="px-4 py-2">{sub.parentAgent?.name || "-"}</td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(sub)}
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(sub._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
