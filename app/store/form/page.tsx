'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Package, Image as ImageIcon, ChevronDown } from 'lucide-react';
import axios from "axios";
import { STORE_BASE_URL } from '@/utils/api';
import { toast } from 'sonner';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addStoreData, updateSingleStoreData } from '@/store/slice/userSlice';
import { GoBackButton } from '@/components';
import { useRouter, useSearchParams } from 'next/navigation';

interface AssetFormData {
	id: number;
	title: string;
	price: string;
	description: string;
	category: string;
	image: string;
}

const ProductForm = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchParams = useSearchParams();
	const params = new URLSearchParams(searchParams);
	const userData = useAppSelector((state) => state.user);
	const currentId = params?.get("id");
	const isEdit = Boolean(currentId);
	const currentProduct = userData?.storeData?.find((data) => data?.id?.toString() === currentId);
	const { register, handleSubmit, reset, formState: { errors } } = useForm<AssetFormData>({
		defaultValues: {
			title: currentProduct?.title || "",
			category: currentProduct?.category || "men's clothing",
			price: currentProduct?.price?.toString()?.replace(",", "."),
			image: currentProduct?.image || "",
			description: currentProduct?.description || "",
		}
	});

	const onSubmit = async (data: AssetFormData) => {
		toast.loading(`${isEdit ? "Editing" : "Adding"} product...`, { id: "add" });
		if (!isEdit) {
			const response = await axios.post(STORE_BASE_URL, {
				title: data?.title,
				category: data?.category,
				price: data?.price,
				image: data?.image,
				description: data?.description,
			});
			const responseData = response.data;
			dispatch(addStoreData({
				id: userData?.storeData?.length + 1,
				title: responseData?.title,
				category: responseData?.category,
				price: responseData?.price,
				image: responseData?.image,
				description: responseData?.description,
				rating: {
					rate: 0,
					count: 0
				}
			}));
		} else {
			try {
				await axios.put(`${STORE_BASE_URL}/${currentId}`, {
					id: currentId,
					title: data?.title,
					category: data?.category,
					price: data?.price,
					image: data?.image,
					description: data?.description,
				});
			} catch(e) {

			}
			dispatch(updateSingleStoreData({
				id: Number(currentId || 0),
				title: data?.title,
				category: data?.category,
				price: data?.price,
				image: data?.image,
				description: data?.description,
			}));
		}
		toast.success(`Product ${isEdit ? "Edited" : "Added"}!`, { id: "add" });
		router.push("/store")
	};

	return (
		<div className="w-full h-full relative">
			<GoBackButton onBackClick={() => router.back()} />
			<div className="max-w-2xl my-5 mx-auto p-8 bg-white border border-slate-200 rounded-3xl shadow-xl shadow-slate-200/50">
				<div className="mb-8">
					<h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
						<div className="p-2 bg-emerald-50 rounded-lg">
							<Package className="w-6 h-6 text-emerald-600" />
						</div>
						{isEdit ? "Edit" : "Add"} Product
					</h2>
					<p className="text-slate-500 mt-2 text-sm">
						Enter the details to populate the products database.
					</p>
				</div>

				<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
					<div className="space-y-1.5">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Product Title</label>
						<input
							{...register("title", { required: "Title is required" })}
							placeholder="e.g. Lamborghini"
							className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 transition-all placeholder:text-slate-400"
						/>
						{errors?.title && <p className="text-red-500 text-xs mt-1 font-medium">{errors?.title?.message}</p>}
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-1.5">
							<label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Price per Unit (USD)</label>
							<div className="relative flex items-center">
								<span className="absolute left-4 text-slate-400 font-medium">$</span>
								<input
									type="number"
									step="0.01"
									{...register("price", {
										required: "Price is required",
										valueAsNumber: true,
										min: { value: 0, message: "Price cannot be negative" }
									})}
									onKeyDown={(e) => {
										if (["e", "E", "+", "-"].includes(e.key)) {
											e.preventDefault();
										}
									}}
									className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 transition-all"
								/>
							</div>
							{errors?.price && <p className="text-red-500 text-xs mt-1 font-medium">{errors?.price?.message}</p>}
						</div>
						<div className="space-y-1.5">
							<label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Category</label>
							<div className="relative">
								<select
									{...register("category", { required: "Category is required" })}
									className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 appearance-none transition-all cursor-pointer"
								>
									<option value="men's clothing">Men's clothing</option>
									<option value="women's clothing">Women's clothing</option>
									<option value="jewelery">Jewelery</option>
									<option value="electronics">Electronics</option>
								</select>
								<ChevronDown className="absolute right-3 top-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
							</div>
							{errors?.category && <p className="text-red-500 text-xs mt-1 font-medium">{errors?.category?.message}</p>}
						</div>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Reference Image Link</label>
						<div className="relative">
							<span className="absolute left-4 top-3.5"><ImageIcon className="w-4 h-4 text-slate-400" /></span>
							<input
								{...register("image")}
								placeholder="https://cdn.energy.com/asset.jpg"
								className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 transition-all"
							/>
						</div>
					</div>
					<div className="space-y-1.5">
						<label className="text-xs font-bold uppercase tracking-wider text-slate-500 ml-1">Description</label>
						<div>
							<textarea
								{...register("description", { required: "Description is required" })}
								rows={3}
								className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500 outline-none text-slate-900 transition-all resize-none"
								placeholder="Describe the product..."
							/>
							{errors?.description && <p className="text-red-500 text-xs mt-1 font-medium">{errors?.description?.message}</p>}
						</div>
					</div>
					<button
						type="submit"
						className="w-full cursor-pointer py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg transition-all active:scale-[0.99] mt-4"
					>
						Confirm and Save Asset
					</button>
				</form>
			</div>
		</div>
	);
};

export default ProductForm;