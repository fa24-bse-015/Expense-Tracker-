  
import React from 'react';

export default function SummaryDashboard({ expenses }) {
  const totalSpent = expenses.reduce((sum, exp) => sum + exp.amount, 0);

  const breakdown = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
    return acc;
  }, {});

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <div className="p-4 bg-blue-50 rounded-xl flex flex-col justify-center border border-blue-100">
        <p className="text-sm font-medium text-blue-600 uppercase">Total Spent</p>
        <p className="text-3xl font-bold text-blue-900 mt-1">${totalSpent.toFixed(2)}</p>
      </div>
      <div className="md:col-span-2">
        <p className="text-sm font-medium text-gray-500 mb-3 uppercase">Breakdown Per Category</p>
        {Object.keys(breakdown).length === 0 ? (
          <p className="text-sm text-gray-400 italic">No data available.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(breakdown).map(([category, amount]) => (
              <div key={category} className="p-3 bg-gray-50 rounded-lg border">
                <p className="text-xs text-gray-500 font-medium truncate">{category}</p>
                <p className="text-sm font-semibold text-gray-800 mt-0.5">${amount.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}