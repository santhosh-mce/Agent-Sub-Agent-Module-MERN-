import { useState, useEffect } from "react";
import API from "../api";

export default function MyTasks({ reload }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
  }, [reload]);

  async function fetchTasks() {
    try {
      const res = await API.get("/upload/lists");
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // Delete individual task
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/upload/lists/${id}`);
      fetchTasks(); // refresh list after deletion
    } catch (err) {
      console.error(err);
    }
  };

  // Optional: Delete all tasks
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete all tasks?")) return;
    try {
      await API.delete("/upload/lists");
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-semibold">My Tasks</h3>
        <button
          onClick={handleDeleteAll}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
        >
          Delete All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 border">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">First Name</th>
              <th className="px-4 py-2">Mobile</th>
              <th className="px-4 py-2">Notes</th>
              <th className="px-4 py-2">SubAgent</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {tasks.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-2 text-center text-gray-500">
                  No tasks yet
                </td>
              </tr>
            ) : (
              tasks.map((t) => {
                let countryCode = "";
                let mobile = "";
                if (t.phone) {
                  countryCode = t.phone.slice(0, t.phone.length - 10);
                  mobile = t.phone.slice(-10);
                }
                return (
                  <tr key={t._id}>
                    <td className="px-4 py-2">{t.firstName}</td>
                    <td className="px-4 py-2">
                      <div className="flex gap-0.5">
                        <span className="font-semibold">{countryCode}</span>
                        {mobile}
                      </div>
                    </td>
                    <td className="px-4 py-2">{t.notes}</td>
                    <td className="px-4 py-2">{t.assignedTo?.name || "-"}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(t._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
