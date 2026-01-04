export default function Footer() {
  return (
    <footer className="mt-25 py-6 border-t border-gray-200">
      <div className="px-6 md:px-23 text-sm text-gray-600">
        © {new Date().getFullYear()} Andres Zapata · {" "}
        <a href="mailto:contacto@andreszapata.me" className="hover:underline">
          Email
        </a>
        {" "} · {" "}
        <a
          href="https://github.com/andreszapataq"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
