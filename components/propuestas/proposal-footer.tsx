interface ProposalFooterProps {
  name: string;
  email: string;
  phone?: string;
  website?: string;
}

export default function ProposalFooter({
  name,
  email,
  phone,
  website,
}: ProposalFooterProps) {
  return (
    <footer className="mt-20 py-8 border-t border-gray-200 print:mt-12">
      <div className="text-paragraph space-y-1">
        <p className="font-semibold text-foreground">{name}</p>
        <p>
          <a
            href={`mailto:${email}`}
            className="hover:underline"
          >
            {email}
          </a>
        </p>
        {phone && <p>{phone}</p>}
        {website && (
          <p>
            <a
              href={`https://${website}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {website}
            </a>
          </p>
        )}
      </div>
    </footer>
  );
}
