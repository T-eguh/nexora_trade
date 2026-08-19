import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { BookOpen, Clock, User, ArrowRight, Search } from 'lucide-react';
import { useArticles } from '../../hooks/useStorage';

export const EducationPage: React.FC = () => {
  const { articles } = useArticles();
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('ALL');

  const categories = ['ALL', 'Beginner', 'Analysis', 'Risk', 'Psychology'];

  const filteredArticles = articles.filter((art) => {
    const matchesSearch =
      art.title.toLowerCase().includes(search.toLowerCase()) ||
      art.summary.toLowerCase().includes(search.toLowerCase()) ||
      art.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
    const matchesCat = selectedCat === 'ALL' || art.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          NEXORA ACADEMY
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Financial Trading Education Hub
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Master the mechanics of technical price action, structured risk preservation frameworks, and trading psychology with our curated knowledge modules.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCat(cat)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCat === cat
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
            placeholder="Search topics, patterns, risk..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search className="w-4 h-4 text-neutral-400" />}
            className="py-1.5 text-xs"
          />
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => (
          <Card
            key={article.id}
            hoverEffect
            padding="md"
            className="flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="red" size="sm">
                  {article.category}
                </Badge>
                <span className="flex items-center gap-1 text-[11px] text-neutral-400 font-mono-num">
                  <Clock className="w-3.5 h-3.5" />
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                {article.summary}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-2">
                {article.tags.map((t, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#151518] text-neutral-400 px-2 py-0.5 rounded border border-neutral-800"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between text-xs">
              <span className="text-neutral-400 truncate max-w-[150px]">
                {article.author}
              </span>
              <Link
                to={`/education/${article.slug}`}
                className="text-red-400 group-hover:text-red-300 font-semibold flex items-center gap-1 hover:underline"
              >
                Read Article <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
