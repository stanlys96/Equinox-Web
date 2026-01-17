"use client";

import React, { useRef } from 'react';
import { Eye, ChevronLeft, ChevronRight, Pencil } from 'lucide-react';
import Link from 'next/link';
import { RowSelector } from './RowSelector';
import { useAppSelector } from '@/store/hooks';

interface TableData {
	id: number;
	name: string;
}

interface TableComponentProps {
	data: TableData[];
	page: string;
	showPrevButton?: boolean;
	showNextButton?: boolean;
	onClickNextButton?: () => void;
	onClickPrevButton?: () => void;
	currentPage?: number;
	totalPage?: number;
	showFooter?: boolean;
}

export const TableComponent = ({
	data,
	page,
	showPrevButton,
	showNextButton,
	onClickNextButton,
	onClickPrevButton,
	currentPage,
	totalPage,
	showFooter = true
}: TableComponentProps) => {
	const tableRef = useRef<HTMLDivElement>(null);
	const userData = useAppSelector((state) => state.user);
	const handlePrevButton = () => {
		tableRef.current?.scrollIntoView({ behavior: 'smooth' });
		onClickPrevButton && onClickPrevButton();
	};

	const handleNextButton = () => {
		tableRef.current?.scrollIntoView({ behavior: 'smooth' });
		onClickNextButton && onClickNextButton();
	}

	return (
		<div className="w-full max-w-4xl mx-auto p-4" ref={tableRef}>
			<div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
				<table className="w-full text-left border-collapse">
					<thead>
						<tr className="bg-slate-50/50 border-b border-slate-100">
							<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">No</th>
							<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Name</th>
							<th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest text-slate-500 text-center">Action</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-slate-50">
						{data.map((item, index) => (
							<tr key={item?.id} className="group hover:bg-slate-50/50 transition-colors">
								<td className="px-6 py-4 text-center">
									<span className="font-mono text-sm font-medium text-slate-400 text-center">
										{userData?.currentOffset + index + 1}
									</span>
								</td>
								<td className="text-center">
									<Link href={`/${page}/detail/${item?.id?.toString()}`} className="px-6 py-4 cursor-pointer text-center">
										<span className="text-sm font-semibold text-slate-900 text-center group-hover:text-indigo-600 transition-colors">
											{item?.name}
										</span>
									</Link>
								</td>
								<td className="px-6 py-4 mx-auto">
									<div className="flex justify-center gap-3">
										<Link href={`/${page}/detail/${item?.id?.toString()}`} className="p-2 cursor-pointer rounded-lg bg-slate-900 text-white hover:bg-slate-800 transition-all active:scale-90">
											<Eye size={16} />
										</Link>
										{page === "store" && <Link href={`/${page}/form?id=${item?.id}`} className="p-2 cursor-pointer rounded-lg border border-slate-200 text-slate-400 hover:border-yellow-200 hover:text-yellow-600 transition-all active:scale-90">
											<Pencil size={16} />
										</Link>}
									</div>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				{showFooter && <div className="flex items-center justify-between px-6 py-4 bg-slate-50/30 border-t border-slate-100">
					<p className="text-xs text-slate-500 font-medium">Page {currentPage} of {totalPage}</p>
					<RowSelector />
					<div className="flex gap-2">
						{showPrevButton && <button onClick={handlePrevButton} className="p-1.5 cursor-pointer rounded-md border border-slate-200 bg-white hover:bg-slate-50">
							<ChevronLeft size={16} className="text-slate-600" />
						</button>}
						{showNextButton && <button onClick={handleNextButton} className="p-1.5 cursor-pointer rounded-md border border-slate-200 bg-white hover:bg-slate-50">
							<ChevronRight size={16} className="text-slate-600" />
						</button>}
					</div>
				</div>}
			</div>
		</div>
	);
}