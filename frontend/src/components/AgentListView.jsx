import { useState, useEffect } from "react";

export default function AgentListView({ lists, loading }) {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const filteredLists = lists.filter((it) => {
    const query = search.toLowerCase();
    return (
      it.firstName?.toLowerCase().includes(query) ||
      it.phone?.toLowerCase().includes(query) ||
      it.notes?.toLowerCase().includes(query) ||
      it.assignedTo?.name?.toLowerCase().includes(query)
    );
  });

  const sortedLists = [...filteredLists].sort((a, b) => {
    if (!sortKey) return 0;
    const aValue = sortKey === "agent" ? a.assignedTo?.name || "" : a[sortKey] || "";
    const bValue = sortKey === "agent" ? b.assignedTo?.name || "" : b[sortKey] || "";

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white rounded-lg shadow-md relative">
      {loading && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-4">
        <h3 className="text-xl font-semibold">Distributed Items</h3>

        <div className="flex gap-2 w-full md:w-1/2">
          <input
            type="text"
            placeholder="Search by name, phone, notes, or agent..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={() => setSearch(searchInput)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>
        </div>

        <div className="flex gap-2 items-center">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="firstName">First Name</option>
            <option value="phone">Phone</option>
            <option value="notes">Notes</option>
            <option value="agent">Agent</option>
          </select>

          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="asc">Asc</option>
            <option value="desc">Des</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                First Name
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Phone
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Notes
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                Agent
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!loading && sortedLists.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-2 text-center text-gray-500">
                  No matching records
                </td>
              </tr>
            ) : (
              sortedLists.map((it) => {
                let countryCode = "";
                let localNumber = it.phone;

                if (it.phone && it.phone.startsWith("+")) {
                  const match = it.phone.match(/^(\+\d{1,2})(\d+)$/);
                  if (match) {
                    countryCode = match[1];
                    localNumber = match[2];
                  }
                }

                return (
                  <tr key={it._id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 text-sm text-gray-700">{it.firstName}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      <span className="font-semibold text-gray-600">{countryCode}</span>{" "}
                      <span className="ml-1">{localNumber}</span>
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">{it.notes}</td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {it.assignedTo ? it.assignedTo.name : "Unassigned"}
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
