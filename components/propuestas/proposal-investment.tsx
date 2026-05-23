import { PropuestaInvestment, PropuestaInvestmentRecurring } from "@/types/propuesta";
import ProposalSection from "./proposal-section";

interface ProposalInvestmentProps {
  items: PropuestaInvestment[];
  total?: string;
  paymentTerms?: string;
  note?: string;
  recurring?: PropuestaInvestmentRecurring;
}

export default function ProposalInvestment({
  items,
  total,
  paymentTerms,
  note,
  recurring,
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

      {recurring && (
        <div className="bg-teal-50 border border-teal-100 rounded-2xl p-6 md:p-8 mt-4 print:border-gray-300 print:bg-white">
          <div className="flex flex-wrap items-baseline justify-between gap-3 mb-2">
            <p className="text-sm font-semibold uppercase tracking-wider text-teal-700">
              {recurring.label}
            </p>
            <p className="text-[28px] md:text-[32px] font-bold leading-none text-teal-800">
              {recurring.amount}
            </p>
          </div>
          {recurring.description && (
            <p className="text-paragraph text-base leading-relaxed">
              {recurring.description}
            </p>
          )}
        </div>
      )}
    </ProposalSection>
  );
}
