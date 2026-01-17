import StoreProvider from "@/store/StoreProvider";
import "./globals.css";
import { Navbar, Sidebar } from "@/components";
import { Suspense } from "react";
import { Toaster } from 'sonner';
import { StoreInitializer } from "./store-initializer";

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body>
				<StoreProvider>
					<StoreInitializer />
					<Navbar />
					<div className="flex h-[calc(100vh-64px)] overflow-hidden">
						<Sidebar />
						<Suspense fallback={<div />}>
							<main className="flex-1 overflow-y-auto bg-gray-50">
								{children}
							</main>
						</Suspense>
					</div>
				</StoreProvider>
				<Toaster theme="light" position="top-center" />
			</body>
		</html>
	);
}
