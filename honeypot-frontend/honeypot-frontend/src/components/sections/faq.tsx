import { faqs } from "@/data/prd";

export function FaqSection() {
  return (
    <section id="faq" className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="space-y-4 text-center">
        <p className="text-xs uppercase tracking-[0.22em] text-amber-300">FAQ</p>
        <h2 className="text-2xl font-semibold sm:text-3xl">Everything Bees ask before entering the HoneyPot.</h2>
      </div>
      <div className="mt-8 space-y-4 sm:mt-10">
        {faqs.map((faq) => (
          <details
            key={faq.question}
            className="group rounded-3xl border border-white/10 bg-white/5 p-5 text-left sm:p-6"
          >
            <summary className="cursor-pointer text-sm font-medium text-amber-100">
              {faq.question}
            </summary>
            <p className="mt-3 text-sm text-stone-300">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
