import React, { useState } from 'react';
import { Card } from '../../components/Card';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Select } from '../../components/Select';
import {
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  Send,
} from 'lucide-react';
import { ApiService } from '../../services/api';
import { useSiteSettings } from '../../hooks/useStorage';

export const ContactPage: React.FC = () => {
  const { settings } = useSiteSettings();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('Account Inquiry');
  const [message, setMessage] = useState('');

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await ApiService.submitContact({
      name,
      email,
      phone,
      subject,
      message,
    });

    setLoading(false);
    setSubmitted(true);
    setFeedback(res.message);
  };

  return (
    <div className="py-12 lg:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Badge variant="red" size="md">
          CLIENT SUPPORT
        </Badge>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Get in Touch with Nexora Support
        </h1>
        <p className="text-sm sm:text-base text-neutral-300">
          Our global client desk is ready to answer questions about demo trading accounts, technical parameters, or platform integration.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Contact Information */}
        <div className="lg:col-span-5 space-y-6">
          <Card padding="lg" className="space-y-6">
            <h3 className="text-lg font-bold text-white">Direct Communication Channels</h3>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#151518] border border-neutral-800">
                <div className="p-2 rounded-lg bg-red-600/10 text-red-500 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block font-semibold">Email Desk</span>
                  <a href={`mailto:${settings.email}`} className="font-bold text-white hover:text-red-400">
                    {settings.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#151518] border border-neutral-800">
                <div className="p-2 rounded-lg bg-red-600/10 text-red-500 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block font-semibold">Phone Inquiries</span>
                  <span className="font-bold text-white font-mono-num">{settings.phone}</span>
                </div>
              </div>

              <div className="flex items-start gap-3.5 p-3 rounded-xl bg-[#151518] border border-neutral-800">
                <div className="p-2 rounded-lg bg-red-600/10 text-red-500 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-neutral-400 block font-semibold">Operating Desk Hours</span>
                  <span className="font-bold text-white">{settings.supportHours}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-[#111114] rounded-xl border border-neutral-800 text-xs text-neutral-400 space-y-1">
              <span className="text-white font-bold block">Looking for live support?</span>
              <p>
                Existing clients can also create authenticated tickets directly from the Client Dashboard.
              </p>
            </div>
          </Card>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-7">
          <Card padding="lg">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-950/80 border border-emerald-800 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white">Message Dispatched</h3>
                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed">
                  {feedback}
                </p>
                <div className="pt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-bold text-white">Send Us a Message</h3>
                <p className="text-xs text-neutral-400 mb-4">
                  Fill out the form below and our team will respond within 24 hours.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Full Name"
                    placeholder="e.g. Marcus Vance"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    placeholder="e.g. name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="Phone Number (Optional)"
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                  <Select
                    label="Subject Category"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    options={[
                      { value: 'Account Inquiry', label: 'Trading Account Inquiry' },
                      { value: 'Technical Support', label: 'Platform & WebTrader Support' },
                      { value: 'Market Questions', label: 'Spreads & Market Specifications' },
                      { value: 'Partnership', label: 'Institutional / Partnership' },
                      { value: 'Other', label: 'General Questions' },
                    ]}
                  />
                </div>

                <div className="space-y-1.5 text-left">
                  <label className="block text-xs font-semibold text-neutral-300 tracking-wide uppercase">
                    Message Details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full bg-[#151518] text-white placeholder-neutral-500 text-sm rounded-lg border border-neutral-800 p-3.5 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-colors"
                    placeholder="Please specify your question or technical requirement..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" fullWidth size="lg" disabled={loading}>
                  {loading ? 'Transmitting Message...' : 'Submit Message'}
                  <Send className="w-4 h-4 ml-2" />
                </Button>
              </form>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
