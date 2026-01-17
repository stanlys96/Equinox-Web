"use client";
import React, { useRef } from 'react';
import { FlaskConical, Timer, Wind } from 'lucide-react';
import useSWR from 'swr';
import { fetcherPoke } from '@/utils/api';
import { usePathname, useRouter } from 'next/navigation';
import { GoBackButton, LoadingSkeleton } from '@/components';

const PokemonDetailPage = () => {
	const pageRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();
	const currentId = pathname.split('/').at(-1);
	const { data: pokeDetailData } = useSWR(
		["poke", `/${currentId}`],
		fetcherPoke
	);
	if (!pokeDetailData) return <LoadingSkeleton fullHeight />;
	return (
		<div className="w-full relative p-3" ref={pageRef}>
			<GoBackButton onBackClick={() => router.back()} />
			<div className="max-w-md mx-auto bg-slate-900 text-slate-100 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
				<div className="bg-gradient-to-br from-red-500 to-orange-600 p-6 text-center">
					<h2 className="text-3xl font-bold capitalize tracking-tight">{pokeDetailData?.name}</h2>
					<span className="inline-block mt-2 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-widest">
						{pokeDetailData?.natural_gift_type.name}
					</span>
				</div>
				<div className="p-6 space-y-6">
					<div className="grid grid-cols-2 gap-4">
						<div className="bg-slate-800/50 p-4 rounded-2xl flex items-center space-x-3">
							<Timer className="text-blue-400" size={20} />
							<div>
								<p className="text-slate-400 text-xs uppercase">Growth Time</p>
								<p className="font-bold">{pokeDetailData?.growth_time}h</p>
							</div>
						</div>
						<div className="bg-slate-800/50 p-4 rounded-2xl flex items-center space-x-3">
							<Wind className="text-emerald-400" size={20} />
							<div>
								<p className="text-slate-400 text-xs uppercase">Firmness</p>
								<p className="font-bold capitalize">{pokeDetailData?.firmness.name}</p>
							</div>
						</div>
					</div>
					<div>
						<h3 className="text-sm font-semibold text-slate-400 mb-4 flex items-center">
							<FlaskConical size={16} className="mr-2" /> FLAVOR PROFILES
						</h3>
						<div className="space-y-3">
							{pokeDetailData?.flavors.map((f: any) => (
								<div key={f.flavor.name}>
									<div className="flex justify-between text-xs mb-1 uppercase tracking-wider">
										<span>{f.flavor.name}</span>
										<span className={f.potency > 0 ? "text-orange-400" : "text-slate-600"}>
											{f.potency}%
										</span>
									</div>
									<div className="w-full bg-slate-800 rounded-full h-1.5">
										<div
											className="bg-orange-500 h-1.5 rounded-full transition-all duration-500"
											style={{ width: `${f.potency}%` }}
										></div>
									</div>
								</div>
							))}
						</div>
					</div>
					<div className="pt-4 border-t border-slate-800 flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[10px] uppercase font-bold">Natural Gift Power</span>
							<span className="text-xl font-mono text-white">{pokeDetailData?.natural_gift_power}</span>
						</div>
						<div className="text-right">
							<span className="text-slate-500 text-[10px] uppercase font-bold">Soil Dryness</span>
							<span className="block text-blue-400 font-bold">{pokeDetailData?.soil_dryness}%</span>
						</div>
					</div>
					<div className="pt-4 border-t border-slate-800 flex justify-between items-center">
						<div className="flex flex-col">
							<span className="text-slate-500 text-[10px] uppercase font-bold">Size</span>
							<span className="text-xl font-mono text-white">{pokeDetailData?.size}</span>
						</div>
						<div className="text-right">
							<span className="text-slate-500 text-[10px] uppercase font-bold">Smoothness</span>
							<span className="block text-blue-400 font-bold">{pokeDetailData?.smoothness}%</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PokemonDetailPage;