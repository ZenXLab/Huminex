import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, FileText, CreditCard, Truck, RefreshCw, Database, Brain, MessageSquare } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  policyId: string | null;
}

const policyContent: Record<string, { title: string; icon: React.ElementType; content: string }> = {
  terms: {
    title: "Terms & Conditions",
    icon: FileText,
    content: `
# Terms of Service

**Effective Date:** December 2024

Welcome to ATLAS by CropXon Innovations Pvt. Ltd. By accessing or using our services, you agree to be bound by these Terms & Conditions.

## 1. Acceptance of Terms
By using ATLAS services, you acknowledge that you have read, understood, and agree to be bound by these terms.

## 2. Service Description
ATLAS provides digital transformation, consulting, and technology services including but not limited to:
- Software Development
- AI & Automation Solutions
- Cloud & DevOps Services
- Cybersecurity Solutions
- Enterprise Consulting

## 3. User Obligations
You agree to:
- Provide accurate and complete information
- Maintain the confidentiality of your account
- Use services in compliance with applicable laws
- Not engage in any unauthorized use of the platform

## 4. Intellectual Property
All content, features, and functionality of ATLAS are owned by CropXon Innovations and are protected by copyright, trademark, and other intellectual property laws.

## 5. Limitation of Liability
ATLAS shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the services.

## 6. Modifications
We reserve the right to modify these terms at any time. Continued use of services constitutes acceptance of modified terms.
    `
  },
  privacy: {
    title: "Privacy Policy",
    icon: Shield,
    content: `
# Privacy Policy

**Effective Date:** December 2024

CropXon Innovations Pvt. Ltd. ("we", "our", "us") is committed to protecting your privacy.

## 1. Information We Collect
- **Personal Information:** Name, email, phone number, company details
- **Usage Data:** How you interact with our services
- **Technical Data:** IP address, browser type, device information

## 2. How We Use Your Information
- To provide and maintain our services
- To notify you about changes to our services
- To provide customer support
- To gather analysis for service improvement

## 3. Data Security
We implement industry-standard security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.

## 4. Data Retention
We retain your personal data only for as long as necessary to fulfill the purposes for which it was collected.

## 5. Your Rights
You have the right to:
- Access your personal data
- Correct inaccurate data
- Request deletion of your data
- Object to processing of your data

## 6. Contact Us
For privacy-related inquiries, contact us at privacy@cropxon.com
    `
  },
  payment: {
    title: "Payment Policy",
    icon: CreditCard,
    content: `
# Payment Policy

## 1. Payment Terms
- All payments are due as per the agreed project milestones
- We accept bank transfers, credit cards, and UPI payments
- International payments are accepted via wire transfer

## 2. Project Payments
- Initial deposit: 30-50% of project value (varies by project scope)
- Milestone payments: As per agreed schedule
- Final payment: Upon project completion and delivery

## 3. Subscription Services
- Monthly subscriptions are billed at the start of each billing cycle
- Annual subscriptions offer discounted rates
- Auto-renewal can be disabled at any time

## 4. Refunds
- Refund eligibility is governed by our Refund Policy
- Processing time: 7-14 business days

## 5. Late Payments
- Late payments may incur a 2% monthly interest charge
- Services may be suspended for accounts overdue by more than 30 days
    `
  },
  delivery: {
    title: "Project Delivery Policy",
    icon: Truck,
    content: `
# Project Delivery Policy

## 1. Project Timeline
- Timelines are established during project scoping
- Milestones are agreed upon before project commencement
- Regular progress updates are provided

## 2. Deliverables
- All deliverables are specified in the Statement of Work
- Quality assurance is performed before each delivery
- Documentation is provided with all technical deliverables

## 3. Review & Feedback
- Clients have a 7-day review period for each milestone
- Feedback must be consolidated and submitted in writing
- Additional revision rounds may incur extra charges

## 4. Project Completion
- Final delivery includes all source code, documentation, and assets
- Knowledge transfer sessions are provided
- Post-delivery support period as per agreement

## 5. Delays
- We communicate any anticipated delays promptly
- Force majeure events may extend timelines
- Client-caused delays may affect project timeline
    `
  },
  refund: {
    title: "Refund Policy",
    icon: RefreshCw,
    content: `
# Refund Policy

## 1. Eligibility
Refunds may be considered in the following cases:
- Service not delivered as per agreement
- Quality issues that cannot be resolved
- Project cancellation before work commencement

## 2. Non-Refundable Items
- Work already completed and approved
- Third-party costs (hosting, domains, licenses)
- Consultation fees and discovery sessions

## 3. Refund Process
1. Submit refund request in writing
2. Include reason and supporting documentation
3. Review period: 5-7 business days
4. Refund processing: 7-14 business days

## 4. Partial Refunds
- Calculated based on work completed
- Third-party costs are non-refundable
- Administrative fees may apply

## 5. Dispute Resolution
- We aim to resolve disputes amicably
- Arbitration is the preferred resolution method
    `
  },
  data: {
    title: "Data Usage Consent",
    icon: Database,
    content: `
# Data Usage Consent

## Purpose
By providing consent, you allow us to:
- Store and process your project data securely
- Use anonymized data for service improvement
- Share data with authorized team members only

## Data Protection
- All data is encrypted in transit and at rest
- Access is limited to authorized personnel
- Regular security audits are conducted

## Your Control
- Request data export at any time
- Modify consent preferences
- Request data deletion upon project completion

## Compliance
- GDPR compliant data handling
- Industry-standard security practices
- Regular compliance audits
    `
  },
  ai: {
    title: "AI Automation Consent",
    icon: Brain,
    content: `
# AI Automation Consent

## AI Usage
By providing consent, you authorize us to:
- Use AI tools to enhance service delivery
- Automate routine tasks for efficiency
- Apply machine learning for insights

## Data Processing
- AI systems may process your project data
- All processing follows strict privacy guidelines
- No data is shared with external AI services without consent

## Transparency
- AI-assisted decisions are clearly marked
- Human oversight is maintained
- You can request non-AI alternatives

## Benefits
- Faster project delivery
- Enhanced accuracy
- 24/7 automated support options
    `
  },
  communication: {
    title: "Communication Consent",
    icon: MessageSquare,
    content: `
# WhatsApp/Communication Consent

## Communication Channels
By providing consent, you agree to receive communications via:
- WhatsApp for quick updates
- Email for formal communications
- SMS for urgent notifications

## Message Types
- Project updates and milestones
- Meeting reminders and schedules
- Important announcements
- Marketing communications (optional)

## Opt-Out
- You can opt out of marketing messages anytime
- Critical project communications cannot be opted out
- Modify preferences in your account settings

## Privacy
- Messages are not shared with third parties
- Conversation history is securely stored
- You can request message deletion
    `
  }
};

export function PolicyModal({ isOpen, onClose, policyId }: PolicyModalProps) {
  const policy = policyId ? policyContent[policyId] : null;
  
  if (!policy) return null;

  const Icon = policy.icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] bg-card/95 backdrop-blur-xl border-border/60">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-heading">{policy.title}</DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Please review this policy carefully
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        
        <ScrollArea className="h-[50vh] pr-4">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {policy.content.split('\n').map((line, i) => {
              if (line.startsWith('# ')) {
                return <h1 key={i} className="text-xl font-bold text-foreground mt-4 mb-2">{line.slice(2)}</h1>;
              }
              if (line.startsWith('## ')) {
                return <h2 key={i} className="text-lg font-semibold text-foreground mt-4 mb-2">{line.slice(3)}</h2>;
              }
              if (line.startsWith('**') && line.endsWith('**')) {
                return <p key={i} className="font-semibold text-foreground">{line.slice(2, -2)}</p>;
              }
              if (line.startsWith('- ')) {
                return <li key={i} className="text-muted-foreground ml-4">{line.slice(2)}</li>;
              }
              if (line.trim()) {
                return <p key={i} className="text-muted-foreground mb-2">{line}</p>;
              }
              return null;
            })}
          </div>
        </ScrollArea>

        <div className="flex justify-end pt-4 border-t border-border/40">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
