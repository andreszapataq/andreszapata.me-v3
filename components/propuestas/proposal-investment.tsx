import { PropuestaInvestment } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalInvestmentProps {
  items: PropuestaInvestment[];
  total?: string;
  paymentTerms?: string;
  note?: string;
}

export default function ProposalInvestment({
  items,
  total,
  paymentTerms,
  note,
}: ProposalInvestmentProps) {
  const displayAmount = total ?? items[0]?.amount;

  return (
    <ProposalSection title="Inversión">
      <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 md:p-8 print:bg-white print:border-gray-300">
        {items.length > 1 ? (
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <div key={i} className="flex justify-between items-baseline">
                <span className="text-paragraph">{item.concept}</span>
                <span className="font-semibold text-foreground">
                  {item.amount}
                </span>
              </div>
            ))}
            {total && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between items-baseline">
                  <span className="font-semibold text-foreground">Total</span>
                  <span className="text-[40px] font-bold text-foreground leading-none">
                    {total}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="text-paragraph mb-2">{items[0]?.concept}</p>
            <p className="text-[40px] md:text-[48px] font-bold text-foreground leading-none">
              {displayAmount}
            </p>
          </div>
        )}

        {paymentTerms && (
          <p className="text-paragraph">
            {paymentTerms}
          </p>
        )}
        {note && (
          <p className="text-sm text-now-title mt-2">{note}</p>
        )}
      </div>
    </ProposalSection>
  );
}
