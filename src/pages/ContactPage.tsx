import { useState } from 'react';
import { Mail, MapPin, Phone, Send, Sparkles } from 'lucide-react';
import { useStore } from '../store';
import { SectionHeading } from '../components/ui';
import { messagesService } from '../lib/messagesService';

export function ContactPage() {
  const { toast } = useStore();
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    orderNumber: '',
    content: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.firstName.trim() || !form.lastName.trim() || !form.email.trim() || !form.content.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await messagesService.sendMessage({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
        orderNumber: form.orderNumber.trim() || undefined,
        content: form.content.trim(),
      });
      setSent(true);
      toast('Message sent — we will be in touch');
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        orderNumber: '',
        content: ''
      });
    } catch (err: unknown) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to send message. Please try again.');
      toast('Error: Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-lux py-16">
      <SectionHeading eyebrow="We are here to help" title="Contact Us" subtitle="Questions about sizing, orders, or styling? Our concierge team responds within one business day." align="center" />
      <div className="mx-auto mt-12 grid max-w-5xl gap-8 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-4">
          {[
            { icon: <MapPin size={18} />, t: 'Visit', d: 'Gulshan Avenue, Dhaka 1212, Bangladesh' },
            { icon: <Phone size={18} />, t: 'Call', d: '+880 1700 000 000 (9am–9pm)' },
            { icon: <Mail size={18} />, t: 'Email', d: 'care@crazyfeb.atelier' },
          ].map((c) => (
            <div key={c.t} className="card-lux flex items-start gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-full bg-gold-400/15 text-gold-600">{c.icon}</div>
              <div>
                <div className="font-semibold">{c.t}</div>
                <div className="text-sm text-ink-600 dark:text-ink-300">{c.d}</div>
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-800 p-6"
        >
          {sent ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600"><Sparkles size={22} /></div>
                <h3 className="mt-4 font-display text-xl font-semibold">Thank you</h3>
                <p className="mt-1 text-sm text-ink-500">Your message is on its way to our team.</p>
                <button onClick={() => setSent(false)} className="btn-ghost mt-5">Send another</button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                required
                placeholder="First name"
                className="input-lux"
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                disabled={loading}
              />
              <input
                required
                placeholder="Last name"
                className="input-lux"
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                disabled={loading}
              />
              <input
                required
                type="email"
                placeholder="Email"
                className="input-lux sm:col-span-2"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                disabled={loading}
              />
              <input
                placeholder="Order number (optional)"
                className="input-lux sm:col-span-2"
                value={form.orderNumber}
                onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
                disabled={loading}
              />
              <textarea
                required
                placeholder="How can we help?"
                rows={5}
                className="input-lux sm:col-span-2 resize-none"
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                disabled={loading}
              />
              {error && <p className="text-red-500 text-xs sm:col-span-2">{error}</p>}
              <button type="submit" className="btn-dark sm:col-span-2 flex items-center justify-center gap-2" disabled={loading}>
                {loading ? (
                  <>
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactPage;
