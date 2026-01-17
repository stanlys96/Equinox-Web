"use client";
import Link from "next/link";

export const Navbar = () => {
  return (
    <div className="sticky top-0 z-50 h-16 border-b bg-white">
      <div className="flex h-full items-center justify-between px-4">
        <Link href="/" className="text-lg font-bold">
          Equinox
        </Link>
        <div className="flex items-center gap-4">
          <div className="h-8 w-8 rounded-full bg-gray-300" />
        </div>
      </div>
    </div>
  );
};
