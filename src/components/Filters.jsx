 
import React from 'react';

export default function Filters({ categoryFilter, setCategoryFilter, startDate, setStartDate, endDate, setEndDate }) {
  return (
    <div className="bg-white p-4 rounded-xl border flex flex-wrap gap-4 items-center justify-between shadow-sm">
      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Category Filter</label>
        <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="p-2 border rounded-lg outline-none text-sm w-44">
          <option value="All">All Categories</option>
          <option value="Food">Food</option>
          <option value="Transport">Transport</option>
          <option value="Utilities">Utilities</option>
          <option value="Entertainment">Entertainment</option>
          <option value="Shopping">Shopping</option>
          <option value="Others">Others</option>
        </select>
      </div>
      <div className="flex gap-2 items-center">
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">From</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="p-2 border rounded-lg text-sm outline-none" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">To</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="p-2 border rounded-lg text-sm outline-none" />
        </div>
      </div>
    </div>
  );
}