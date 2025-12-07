import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "How does the 30-day free trial work?",
    answer: "Start using ATLAS completely free for 30 days with full access to all features. No credit card required. If you love it (you will!), simply choose a plan and continue. No hidden catches."
  },
  {
    question: "Can I switch plans later?",
    answer: "Absolutely! You can upgrade or downgrade your plan at any time. Upgrades are effective immediately, and downgrades take effect at the end of your current billing cycle. We prorate charges fairly."
  },
  {
    question: "What happens if I exceed my employee limit?",
    answer: "We'll notify you when you're approaching your limit. You can either upgrade to the next tier or pay a per-user overage fee. We never block your operations mid-payroll!"
  },
  {
    question: "Is my data secure?",
    answer: "Your data is protected with bank-grade encryption (AES-256), SOC2 Type II compliance, and GDPR-ready infrastructure. We use multi-region backups and never share your data with third parties."
  },
  {
    question: "How does annual billing work?",
    answer: "Annual billing gives you 20% off the monthly price, billed upfront. Plus, you get Price Lock Guarantee — your rate won't increase for 12 months even if we raise prices."
  },
  {
    question: "Do you offer discounts for startups or NGOs?",
    answer: "Yes! We offer special pricing for verified startups (under 2 years old), non-profits, and educational institutions. Contact our sales team with documentation for eligibility."
  },
  {
    question: "Can I cancel anytime?",
    answer: "Yes, cancel anytime with no penalties. For monthly plans, you'll have access until the end of your billing period. For annual plans, we offer prorated refunds within the first 30 days."
  },
  {
    question: "What support is included?",
    answer: "All plans include email support. Professional and Enterprise tiers get priority support with faster response times, dedicated Slack channels, and access to a Customer Success Manager."
  }
];

export const PricingFAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
          <HelpCircle className="w-4 h-4" />
          Have Questions?
        </div>
        <h3 className="text-3xl font-heading font-bold text-foreground mb-3">
          Frequently Asked Questions
        </h3>
        <p className="text-muted-foreground">
          Everything you need to know about ATLAS pricing and billing.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`bg-card rounded-2xl border transition-all duration-300 ${
              openIndex === index 
                ? 'border-primary/50 shadow-lg shadow-primary/5' 
                : 'border-border/50 hover:border-primary/30'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <span className="text-lg font-medium text-foreground pr-4">
                {faq.question}
              </span>
              <ChevronDown
                className={`w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${
                openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="px-6 pb-6 pt-0">
                <p className="text-muted-foreground leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
