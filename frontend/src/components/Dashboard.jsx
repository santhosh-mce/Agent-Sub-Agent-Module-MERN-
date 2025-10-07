import Agents from "./Agents";
import UploadCSV from "./UploadCSV";
import MyTasks from "./MyTasks";
import SubAgents from "./SubAgents";
import { useState } from "react";

export default function Dashboard() {
  const [reload, setReload] = useState(false);
  const role = localStorage.getItem("role");
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    localStorage.removeItem("role");
    localStorage.removeItem("user"); // remove role if stored
    window.location.href = "/login"; // redirect to login page
  };

  return (
    <div className="max-w-full mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <UploadCSV onUploadSuccess={() => setReload(!reload)} />

      {role === "admin" && <Agents reload={reload} />}
      <SubAgents reload={reload} />
      <MyTasks reload={reload} />
    </div>
  );
}
