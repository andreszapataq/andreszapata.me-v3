import Link from "next/link";

export default function Navbar() {
  return (
    <header className="border-b border-neutral-200 dark:border-neutral-800 sticky top-0 z-10">
        <nav className="px-6 md:px-16 flex items-center justify-between w-full h-[60px]">
            <ul className="flex flex-1 items-center gap-6 justify-start">
                <li>
                    <Link href="/">Hole</Link>
                </li>
                <li>
                    <Link href="/">Qué Hubo</Link>
                </li>
                <li>
                    <Link href="/">Ciao</Link>
                </li>
            </ul>

            <div className="flex items-center justify-center">
                <Link href="/" aria-label="Home">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 67.96 48"
                        className="h-6 w-auto"
                        fill="currentColor"
                        aria-hidden="true"
                        >
                            <path d="M0,42.46L24.43,8.34H.6V1.34h34.18v5.54L10.41,40.99h25.57v7.01H0v-5.54Z"/>
                            <path d="M48.47,0h6.68l12.82,22.16h-8.08l-8.08-14.29-8.08,14.29h-8.08L48.47,0Z"/>
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