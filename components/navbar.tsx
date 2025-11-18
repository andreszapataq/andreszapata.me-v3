import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-gray-200 dark:border-neutral-800 sticky top-0 z-10">
        <nav className="px-6 md:px-16 flex items-center justify-between w-full h-[60px]">
            <ul className="flex flex-1 items-center gap-6 justify-start">
                <li>
                    <Link href="/">Hello!</Link>
                </li>
                <li>
                    <Link href="/">Benefits</Link>
                </li>
                <li>
                    <Link href="/">About</Link>
                </li>
            </ul>

            <div className="flex items-center justify-center">
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

            <div className="flex flex-1 items-center justify-end">
                <Link href="/">
                    Login
                </Link>
            </div>
        </nav>
    </header>
  );
}