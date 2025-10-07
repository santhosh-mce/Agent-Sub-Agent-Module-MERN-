import React from "react";

export default function AgentsForm({ form, setForm, submit, msg, loadingForm }) {
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handlePhoneChange = (e) => setForm({ ...form, phone: e.target.value.replace(/\D/g, "") });

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner relative">
      <h4 className="text-xl font-semibold mb-4 text-gray-700">Add New Agent</h4>
      <form onSubmit={submit} className="flex flex-col gap-4">
        {/* Name */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Name</label>
          <input
            name="name"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Email</label>
          <input
            name="email"
            type="email"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email Address"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Phone</label>
          <div className="flex gap-2 items-center">
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
              name="phone"
              value={form.phone}
              onChange={handlePhoneChange}
              type="tel"
              placeholder="Phone Number"
              className="flex-1 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="mb-1 text-sm font-medium text-gray-600">Password</label>
          <input
            name="password"
            type="password"
            className="px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-blue-600 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-700 transition flex items-center justify-center"
          disabled={loadingForm}
        >
          {loadingForm ? (
            <>
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25"></circle>
                <path fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" className="opacity-75"></path>
              </svg>
              Adding...
            </>
          ) : (
            "Add Agent"
          )}
        </button>
      </form>

      {msg && (
        <div className={`mt-4 text-sm font-medium ${msg.startsWith("Error") ? "text-red-600" : "text-green-600"}`}>
          {msg}
        </div>
      )}
    </div>
  );
}
