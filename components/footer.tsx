import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-25 py-6 border-t border-gray-200">
      <div className="px-6 md:px-23 text-sm text-gray-600">
        © 2025 Andres Zapata · {" "}
        <Link href="mailto:contacto@andreszapata.me" className="hover:underline">
          Email
        </Link>
        {" "} · {" "}
        <Link href="https://github.com/andreszapataq" className="hover:underline">
          GitHub
        </Link>
      </div>
    </footer>
  );
}

