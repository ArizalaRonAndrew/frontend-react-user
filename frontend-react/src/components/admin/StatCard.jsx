import React from 'react';

const StatCard = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-between transition hover:shadow-md h-full">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <h3 className="text-3xl font-extrabold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${color.replace("text-", "bg-")} bg-opacity-10`}>
        <Icon className={`w-8 h-8 ${color}`} />
      </div>
    </div>
  );
};

export default StatCard;