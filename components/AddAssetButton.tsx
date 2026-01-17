"use client";

import React from 'react';
import { Plus } from 'lucide-react';

export const AddAssetButton = ({ onClick }: { onClick?: () => void }) => {
	return (
		<button
			onClick={onClick}
			className="group relative cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl shadow-sm hover:shadow-md hover:border-emerald-200 hover:text-emerald-700 transition-all duration-200 active:scale-95"
		>
			<div className="absolute inset-0 bg-emerald-50 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-200" />
			<div className="relative p-1 bg-emerald-100 rounded-lg group-hover:bg-emerald-500 group-hover:text-white transition-colors duration-200">
				<Plus className="w-4 h-4 transition-transform duration-300 group-hover:rotate-90" />
			</div>

			<span className="relative">Add New Asset</span>
		</button>
	);
};