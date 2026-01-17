"use client";

import React, { useState } from 'react';
import { ChevronUp, ListOrdered } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updatePagination, updateOffset } from '@/store/slice/userSlice';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';

export const RowSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams);
  const currentPagination = useAppSelector((state) => state.user.currentPagination);
  
  const options = [10, 30, 50];

  return (
    <div className="relative inline-block text-left cursor-pointer">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-slate-400 flex items-center">
          <ListOrdered size={18} className="mr-2" /> Show:
        </span>
        
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex cursor-pointer items-center justify-between w-24 px-4 py-2 text-sm font-semibold text-white bg-slate-800 border border-slate-700 rounded-xl hover:bg-slate-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
        >
          {params?.get("pagination") || currentPagination}
          <ChevronUp 
            size={16} 
            className={`transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
          />
        </button>
      </div>

      {isOpen && (
        <div className="cursor-pointer">
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 bottom-full z-20 mb-2 w-24 origin-bottom-right bg-slate-800 border border-slate-700 rounded-xl shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none overflow-hidden">
            <div className="py-1">
              {options.map((option) => (
                <button
                  key={option}
                  onClick={() => {
                    dispatch(updatePagination(option));
                    dispatch(updateOffset(0))
                    params.set('page', '1');
                    params.set('pagination', option?.toString());
                    setIsOpen(false);
                    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
                  }}
                  className={`block w-full cursor-pointer px-4 py-2 text-sm text-left transition-colors ${
                    (Number(params?.get("pagination")) || currentPagination) === option 
                      ? 'bg-orange-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {option} Rows
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};