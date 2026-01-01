import Link from "next/link";

interface TextLinkProps {
  href: string;
  children: React.ReactNode;
}

export default function TextLink({ href, children }: TextLinkProps) {
  const isExternal = href.startsWith("http") || href.startsWith("//");

  const className =
    "font-semibold underline underline-offset-3 decoration-1 hover:opacity-70 transition-opacity";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

