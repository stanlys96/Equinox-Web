'use client';

import React, { useEffect, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import useSWR from 'swr';
import { fetcherPoke } from '@/utils/api';
import { mapAndSortPokeData, mapAndSortStoreData } from '@/utils/helper';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export const DropdownComponent = () => {
	const { data: pokeData } = useSWR(
		["poke", "?limit=1000"],
		fetcherPoke
	);
	const userData = useAppSelector((state) => state.user);
	const pathname = usePathname();
	const selectedId = pathname?.split("/")?.at(-1);
	const pokeResult = mapAndSortPokeData(pokeData?.results);
	const [isOpen, setIsOpen] = useState(false);
	const isPokemon = pathname.includes("poke");
	const storeResult = mapAndSortStoreData(userData?.storeData);
	const finalData = isPokemon ? pokeResult : storeResult;
	const selected = finalData?.find((data: any) => data?.id?.toString() === selectedId);

	return (
		<div className="flex flex-col items-center justify-center bg-white mt-5 w-full">
			<div className="relative w-full px-2">
				<label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
					Select {isPokemon ? "Pokemon" : "Product"} Item
				</label>
				<button
					onClick={() => setIsOpen(!isOpen)}
					className={`w-full flex items-center cursor-pointer justify-between px-4 py-3 bg-white border ${isOpen ? 'border-emerald-500 ring-4 ring-emerald-500/10' : 'border-slate-200'
						} rounded-2xl shadow-sm transition-all text-slate-700`}
				>
					<span className="font-medium text-sm">{selected?.name}</span>
					<ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
				</button>
				{isOpen && (
					<div className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden">
						<div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
							{finalData?.map((data: any) => (
								<Link
									href={`/${isPokemon ? "poke" : "store"}/detail/${data.id}`}
									key={data.id}
									onClick={() => {
										setIsOpen(false);
									}}
									className={`w-full cursor-pointer flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-colors ${selected?.id === data?.id
										? 'bg-emerald-50 text-emerald-700 font-semibold'
										: 'text-slate-600 hover:bg-slate-50'
										}`}
								>
									{data.name}
								</Link>
							))}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}