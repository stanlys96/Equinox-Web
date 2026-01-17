"use client";
import { GoBackButton, LoadingSkeleton } from "@/components";
import { useAppSelector } from "@/store/hooks";
import { StoreData } from "@/store/slice/userSlice";
import { Star, ShoppingCart, Tag, Laptop } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function ProductCard() {
	const pageRef = useRef<HTMLDivElement>(null);
	const pathname = usePathname();
	const router = useRouter();
	const currentId = pathname.split('/').at(-1);
	const userData = useAppSelector((state) => state.user);
	const [product, setProduct] = useState<StoreData | null>(null);
	console.log(userData);
	useEffect(() => {
		const theProduct = userData?.storeData?.find((data) => data?.id?.toString() === currentId?.toString());
		if (theProduct) {
			setProduct(theProduct);
		}
	}, [userData?.storeData]);
	if (!product) return <LoadingSkeleton />;
	return (
		<div className="relative p-3" ref={pageRef}>
			<GoBackButton onBackClick={() => router.back()} />
			<div className="group max-w-md mx-auto relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-slate-200/50">
				<div className="mb-4 flex items-center justify-between">
					<span className="flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-600">
						<Tag size={12} />
						{product?.category}
					</span>
					<div className="flex items-center gap-1 text-sm font-semibold text-amber-500">
						<Star size={16} fill="currentColor" />
						{product?.rating?.rate} <span className="text-slate-400 font-normal">({product?.rating?.count})</span>
					</div>
				</div>
				<div className="relative mb-6 flex h-64 items-center justify-center rounded-2xl bg-slate-50 p-8 transition-transform group-hover:scale-[1.02]">
					<img
						src={product?.image}
						alt={product?.title}
						className="h-full object-contain mix-blend-multiply"
					/>
					{product?.description.includes("Laptop") && (
						<div className="absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-slate-900/90 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-sm">
							<Laptop size={12} />
							LAPTOP COMPATIBLE
						</div>
					)}
				</div>
				<div className="space-y-3">
					<h3 className="text-xl font-bold leading-tight text-slate-900 line-clamp-2">
						{product?.title}
					</h3>
					<p className="text-sm leading-relaxed text-slate-500 line-clamp-3">
						{product?.description}
					</p>
					<div className="flex items-center justify-between pt-4">
						<div>
							<p className="text-xs font-medium text-slate-400">Price</p>
							<p className="text-2xl font-black text-slate-900">${product?.price}</p>
						</div>
						<button className="flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3 font-bold text-white transition-all hover:bg-slate-800 active:scale-95">
							<ShoppingCart size={18} />
							Add to Cart
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}