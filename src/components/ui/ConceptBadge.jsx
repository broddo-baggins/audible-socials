import { ArrowUpRight } from 'lucide-react';

/** Small pill that says what this is and links back to the portfolio's project list. */
const ConceptBadge = ({ className = '' }) => (
  <a
    href="https://amityogev.com/?cmd=projects"
    target="_blank"
    rel="noopener noreferrer"
    className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-hl px-3 py-1 text-[0.8125rem] font-semibold text-ink hover:brightness-95 ${className}`}
  >
    Concept demo with sample data
    <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2} aria-hidden="true" />
    <span className="sr-only">(opens amityogev.com)</span>
  </a>
);

export default ConceptBadge;
