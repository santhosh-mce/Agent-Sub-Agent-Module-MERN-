import React from "react";

export default function AgentsTable({
  agents,
  loadingTable,
  searchInput,
  setSearchInput,
  search,
  setSearch,
  sortKey,
  setSortKey,
  sortDirection,
  setSortDirection,
}) {
  // Filter agents by search
  const filteredAgents = agents.filter((a) => {
    const query = search.toLowerCase();
    return (
      a.name?.toLowerCase().includes(query) ||
      a.email?.toLowerCase().includes(query) ||
      a.phone?.toLowerCase().includes(query)
    );
  });

  // Sort filtered agents
  const sortedAgents = [...filteredAgents].sort((a, b) => {
    if (!sortKey) return 0;
    let aValue = a[sortKey] || "";
    let bValue = b[sortKey] || "";
    if (sortKey === "phone") {
      aValue = a.phone.replace(/\D/g, "");
      bValue = b.phone.replace(/\D/g, "");
    }
    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  return (
    <div className="bg-gray-50 p-3 rounded-lg shadow-inner overflow-x-auto relative">
      {loadingTable && (
        <div className="absolute inset-0 bg-white bg-opacity-50 flex items-center justify-center z-10 rounded-lg">
          <svg
            className="animate-spin h-10 w-10 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
            <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"></path>
          </svg>
        </div>
      )}

      <div className="flex flex-col md:flex-row items-center justify-between mb-4 gap-2">
        <h4 className="text-xl font-semibold text-gray-700">Agent List</h4>
        <div className="flex gap-2 items-center w-full md:w-auto">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <button
            onClick={() => setSearch(searchInput)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
          >
            Search
          </button>

          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Sort By</option>
            <option value="name">Name</option>
            <option value="phone">Phone</option>
            <option value="email">Email</option>
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

      <div className="max-h-96 overflow-y-auto">
        <table className="min-w-full divide-y divide-gray-200 border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Email</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Phone</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {sortedAgents.length === 0 && !loadingTable ? (
              <tr>
                <td colSpan={3} className="px-4 py-2 text-center text-gray-500">
                  No matching records
                </td>
              </tr>
            ) : (
              sortedAgents.map((a) => {
                let countryCode = "";
                let localNumber = a.phone;

                if (a.phone.startsWith("+")) {
                  countryCode = a.phone.slice(0, a.phone.length - 10);
                  localNumber = a.phone.slice(-10);
                }

                return (
                  <tr key={a._id} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2 text-gray-700">{a.name}</td>
                    <td className="px-4 py-2 text-gray-700">{a.email}</td>
                    <td className="px-4 py-2 text-gray-700">
                      <span className="font-semibold text-gray-600">{countryCode}</span>{" "}
                      <span className="ml-1">{localNumber}</span>
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
