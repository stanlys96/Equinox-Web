import { ArrowLeft } from "lucide-react"

interface GoBackButtonProps {
	onBackClick: () => void;
}

export const GoBackButton = ({ onBackClick }: GoBackButtonProps) => {
	return <button
		onClick={onBackClick}
		className="group absolute cursor-pointer left-6 top-6 flex items-center justify-center rounded-xl border border-slate-200 bg-slate-900 p-2.5 transition-all duration-200 hover:bg-slate-800 hover:shadow-[0_10px_20px_rgba(0,0,0,0.15)] active:scale-95"
		aria-label="Go Back"
	>
		<ArrowLeft
			size={20}
			className="text-slate-50 transition-transform duration-200 group-hover:-translate-x-1"
		/>
		<div className="absolute inset-[1px] rounded-[10px] border border-white/5 pointer-events-none" />
	</button>
}