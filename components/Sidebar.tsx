"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DropdownComponent } from "./DropdownComponent";

const links = [
  { href: "/", secondaryHref: "/poke", label: "Pokemon" },
  { href: "/store", secondaryHref: "/store", label: "Store" },
];

export const Sidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex md:w-64 md:flex-col border-r bg-white overflow-hidden">
      <nav className="flex flex-col gap-1 px-2 mt-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-md px-3 py-2 text-sm font-medium text-gray-700 ${
              pathname === link.href || pathname.includes(link.secondaryHref) ? "bg-gray-100" : ""
            } hover:bg-gray-100`}
          >
            {link.label}
          </Link>
        ))}
      </nav>
      {pathname.includes("detail") && <DropdownComponent />}
    </aside>
  );
};
