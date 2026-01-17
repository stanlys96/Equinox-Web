"use client";
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
	query: string;
	setQuery: (data: string) => void;
	placeholder?: string;
}

export const SearchBar = ({query, setQuery, placeholder = ""}: SearchBarProps) => {
  return (
    <div className="flex items-center justify-center p-6 transition-colors duration-300">
      <div className="relative w-full max-w-md group">        
        <div className="relative flex items-center bg-white border border-slate-200 rounded-full px-4 py-2 shadow-sm transition-all">
          <Search className="w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full bg-transparent border-none focus:ring-0 text-slate-900 placeholder-slate-400 px-3 py-1 outline-none text-sm"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="hover:bg-slate-100 p-1 rounded-full transition-colors"
            >
              <X className="w-4 h-4 text-slate-400" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1 ml-2 border border-slate-200 bg-slate-50 px-1.5 py-0.5 rounded text-[10px] text-slate-400 font-mono shadow-sm">
            <span className="text-xs">⌘</span>K
          </div>
        </div>
      </div>
    </div>
  );
};