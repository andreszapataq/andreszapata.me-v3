import Link from "next/link";
import { Globe } from "lucide-react";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200">
        <nav className="px-6 md:px-23 flex items-center justify-between w-full h-[60px]">
            <div className="flex flex-1 items-center justify-start">
                <Link href="/" aria-label="Home">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 69.43 48"
                        className="h-6 w-auto"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                            <path d="M0,41.26L22.83,9.81H.6V1.34h34.78v6.81l-22.7,31.38h24.03v8.48H0v-6.74Z"/>
                            <path d="M48.4,0h8.01l13.02,22.43h-9.68l-7.34-13.09-7.34,13.09h-9.68L48.4,0Z"/>
                    </svg>
                </Link>
            </div>

            <div className="flex flex-1 items-center justify-end text-sm">
                <Link href="/" className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    English
                </Link>
            </div>
        </nav>
    </header>
  );
}