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
      <div className="bg-linear-to-br from-teal-600 to-teal-700 text-white rounded-2xl p-6 md:p-8 print:bg-teal-700 print:text-black print:border print:border-gray-300">
        {items.length > 1 ? (
          <div className="space-y-3 mb-6">
            {items.map((item, i) => (
              <div
                key={i}
                className="flex justify-between items-baseline py-3 border-b border-white/15 last:border-0"
              >
                <span className="opacity-90">{item.concept}</span>
                <span className="font-semibold">{item.amount}</span>
              </div>
            ))}
            {total && (
              <div className="bg-white/15 rounded-xl p-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-[36px] md:text-[40px] font-bold leading-none">
                    {total}
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="mb-4">
            <p className="opacity-90 mb-2">{items[0]?.concept}</p>
            <p className="text-[40px] md:text-[48px] font-bold leading-none">
              {displayAmount}
            </p>
          </div>
        )}

        {paymentTerms && (
          <div className="mt-4">
            <p className="text-sm font-semibold opacity-80 mb-1">
              Forma de pago
            </p>
            <p className="opacity-90">{paymentTerms}</p>
          </div>
        )}
        {note && (
          <p className="text-sm mt-3 opacity-70">{note}</p>
        )}
      </div>
    </ProposalSection>
  );
}
