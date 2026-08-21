import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useArticles } from '../../hooks/useStorage';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Clock, User, Calendar, ArrowLeft, Share2, ArrowRight } from 'lucide-react';

export const ArticleDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { articles } = useArticles();
  const navigate = useNavigate();

  const article = articles.find((a) => a.slug === slug);

  if (!article) {
    return (
      <div className="py-24 px-4 max-w-3xl mx-auto text-center space-y-4">
        <h2 className="text-2xl font-bold text-white">Article Not Found</h2>
        <p className="text-xs text-neutral-400">
          The requested educational material does not exist or has been relocated.
        </p>
        <Link to="/education">
          <Button variant="secondary" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Academy
          </Button>
        </Link>
      </div>
    );
  }

  const related = articles.filter((a) => a.id !== article.id).slice(0, 3);

  return (
    <article className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-10">
      {/* Back Button */}
      <div>
        <Link
          to="/education"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Education Hub
        </Link>
      </div>

      {/* Article Header */}
      <div className="space-y-4 border-b border-neutral-800 pb-8">
        <div className="flex items-center gap-3">
          <Badge variant="red" size="md">
            {article.category}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs text-neutral-400 font-mono-num">
            <Clock className="w-3.5 h-3.5" />
            {article.readTime}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-neutral-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold">
              {article.author.substring(0, 1)}
            </div>
            <div>
              <span className="font-semibold text-white block">{article.author}</span>
              <span className="font-mono-num">Published: {article.publishedAt}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {article.tags.map((t, idx) => (
              <span
                key={idx}
                className="px-2.5 py-1 bg-[#151518] rounded-md text-[11px] text-neutral-300 border border-neutral-800 font-mono-num"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>

        {article.image && (
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-neutral-800 relative mt-6">
            <img
              src={article.image}
              alt={article.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505]/70 via-transparent to-transparent" />
          </div>
        )}
      </div>

      {/* Main Content Body */}
      <div className="prose prose-invert max-w-none text-neutral-300 text-sm sm:text-base leading-relaxed space-y-6">
        <div className="p-4 bg-[#0D0D0F] border-l-4 border-red-500 rounded-r-xl text-neutral-300 font-medium italic">
          {article.summary}
        </div>

        {/* Formatted article text paragraphs */}
        {article.content.split('\n\n').map((para, pIdx) => {
          if (para.startsWith('### ')) {
            return (
              <h3 key={pIdx} className="text-xl font-bold text-white pt-4 pb-1 border-b border-neutral-800">
                {para.replace('### ', '')}
              </h3>
            );
          }
          if (para.startsWith('```')) {
            return (
              <pre
                key={pIdx}
                className="bg-[#0D0D0F] p-4 rounded-xl border border-neutral-800 font-mono text-xs text-red-400 overflow-x-auto"
              >
                {para.replace(/```/g, '')}
              </pre>
            );
          }
          return (
            <p key={pIdx} className="text-neutral-300 text-sm sm:text-base leading-relaxed">
              {para}
            </p>
          );
        })}
      </div>

      {/* Demo notice box */}
      <div className="p-4 bg-[#0D0D0F] rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1">
        <strong className="text-white">Educational Disclaimer:</strong>
        <p>
          This publication is provided strictly for educational purposes and should not be construed as investment advice or financial inducement.
        </p>
      </div>

      {/* Related Articles */}
      <div className="pt-10 border-t border-neutral-800 space-y-6">
        <h3 className="text-xl font-bold text-white">Recommended Reading</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {related.map((rel) => (
            <Card key={rel.id} hoverEffect padding="sm" className="space-y-2 flex flex-col justify-between">
              <div>
                <Badge variant="neutral" size="sm">
                  {rel.category}
                </Badge>
                <h4 className="text-sm font-bold text-white mt-2 line-clamp-2">{rel.title}</h4>
              </div>
              <Link
                to={`/education/${rel.slug}`}
                className="text-xs text-red-400 hover:text-red-300 font-semibold flex items-center gap-1 pt-2"
              >
                Read <ArrowRight className="w-3 h-3" />
              </Link>
            </Card>
          ))}
        </div>
      </div>
    </article>
  );
};
