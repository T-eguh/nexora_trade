import React, { useState } from 'react';
import { Badge } from '../../components/Badge';
import { Card } from '../../components/Card';
import { Input } from '../../components/Input';
import { Accordion, AccordionItem } from '../../components/Accordion';
import { useFaqs } from '../../hooks/useStorage';
import { Search, HelpCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/Button';

export const FaqPage: React.FC = () => {
  const { faqs } = useFaqs();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const categories = ['ALL', 'General', 'Trading', 'Accounts', 'Deposits & Withdrawals', 'Platforms'];

  const filteredFaqs = faqs.filter((faq) => {
    const matchSearch =
      faq.question.toLowerCase().includes(search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === 'ALL' || faq.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          KNOWLEDGE BASE
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Find instant answers to questions regarding demo accounts, platform features, execution mechanics, and trading parameters.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-red-600 text-white'
                  : 'bg-[#151518] text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-72">
          <Input
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Accordion */}
      {filteredFaqs.length > 0 ? (
        <Accordion>
          {filteredFaqs.map((faq, idx) => (
            <AccordionItem key={faq.id} title={faq.question} defaultOpen={idx === 0}>
              <div className="space-y-2">
                <p>{faq.answer}</p>
                <div className="pt-2 flex justify-end">
                  <Badge variant="neutral" size="sm">
                    {faq.category}
                  </Badge>
                </div>
              </div>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card padding="lg" className="text-center py-12 space-y-3">
          <HelpCircle className="w-10 h-10 text-neutral-500 mx-auto" />
          <h4 className="text-base font-bold text-white">No Matching Questions Found</h4>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Try adjusting your search keywords or reach out to our client support desk directly.
          </p>
          <div className="pt-2">
            <Link to="/contact">
              <Button variant="secondary" size="sm">
                Contact Support Desk
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Still need help CTA */}
      <div className="bg-[#0D0D0F] border border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-white">Still have questions?</h3>
          <p className="text-xs text-neutral-400 mt-0.5">
            Our support desk is available 24/7 to assist you.
          </p>
        </div>
        <Link to="/contact">
          <Button size="md">Reach Out to Support</Button>
        </Link>
      </div>
    </div>
  );
};
