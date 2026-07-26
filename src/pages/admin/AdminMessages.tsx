import { useEffect, useState, useMemo } from 'react';
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  Search,
  Calendar,
  User,
  ExternalLink,
  Inbox,
  X,
  Check,
} from 'lucide-react';
import { messagesService } from '../../lib/messagesService';
import { isMockAuth } from '../../lib/firebase';
import type { ContactMessage } from '../../types';

export function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  // Subscribe to real-time messages
  useEffect(() => {
    setLoading(true);
    const unsubscribe = messagesService.subscribe((list) => {
      setMessages(list);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Keep selected message in sync with the real-time messages list
  useEffect(() => {
    if (selectedMessage) {
      const updated = messages.find((m) => m.id === selectedMessage.id);
      if (updated && (updated.read !== selectedMessage.read || updated.content !== selectedMessage.content)) {
        setSelectedMessage(updated);
      }
    }
  }, [messages, selectedMessage]);

  // Handle Mark as Read/Unread
  const handleToggleRead = async (msg: ContactMessage, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      await messagesService.markAsRead(msg.id, !msg.read);
    } catch (err) {
      console.error('Failed to update message status:', err);
    }
  };

  // Handle Delete Message
  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    try {
      await messagesService.deleteMessage(id);
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    } catch (err) {
      console.error('Failed to delete message:', err);
    }
  };

  // Handle View Details
  const handleViewMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      // Auto-mark as read
      try {
        await messagesService.markAsRead(msg.id, true);
      } catch (err) {
        console.error('Failed to mark message as read on view:', err);
      }
    }
  };

  // Filter & Search Messages
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch =
        `${msg.firstName} ${msg.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
        msg.email.toLowerCase().includes(search.toLowerCase()) ||
        (msg.orderNumber && msg.orderNumber.toLowerCase().includes(search.toLowerCase())) ||
        msg.content.toLowerCase().includes(search.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'unread' && !msg.read) ||
        (filter === 'read' && msg.read);

      return matchesSearch && matchesFilter;
    });
  }, [messages, search, filter]);

  const unreadCount = useMemo(() => {
    return messages.filter((m) => !m.read).length;
  }, [messages]);

  // Format date elegantly
  const formatDate = (dateString: string) => {
    try {
      const d = new Date(dateString);
      return d.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold tracking-tight">Messages</h1>
          <p className="mt-1 text-sm text-ink-500 dark:text-ink-300">
            Read and manage incoming customer support and styling inquiries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isMockAuth
              ? 'bg-amber-400/10 text-amber-600 dark:text-amber-400'
              : 'bg-emerald-400/10 text-emerald-600 dark:text-emerald-400'
          }`}>
            {isMockAuth ? 'Demo Mode (Local Storage)' : 'Realtime Cloud Firestore'}
          </span>
          {unreadCount > 0 && (
            <span className="rounded-full bg-gold-500 px-2.5 py-1 text-xs font-bold text-ink-950 animate-pulse">
              {unreadCount} Unread
            </span>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl bg-ink-100 dark:bg-ink-800 p-1 max-w-fit">
          {(['all', 'unread', 'read'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold capitalize transition-all ${
                filter === f
                  ? 'bg-white text-ink-900 shadow-soft dark:bg-ink-900 dark:text-white'
                  : 'text-ink-500 hover:text-ink-900 dark:hover:text-white'
              }`}
            >
              {f} ({
                f === 'all'
                  ? messages.length
                  : f === 'unread'
                  ? unreadCount
                  : messages.length - unreadCount
              })
            </button>
          ))}
        </div>

        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            placeholder="Search sender, email, order, or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-lux pl-10"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-900 dark:hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Message Table */}
      {loading ? (
        <div className="card-lux p-12 text-center text-sm text-ink-500 dark:text-ink-300">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-gold-500 border-t-transparent" />
          <p className="mt-2">Loading messages...</p>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="card-lux p-16 text-center text-sm text-ink-500 dark:text-ink-300 flex flex-col items-center justify-center">
          <div className="grid h-12 w-12 place-items-center rounded-full bg-ink-100 dark:bg-ink-800 text-ink-400 mb-4">
            <Inbox size={20} />
          </div>
          <p className="font-semibold text-base text-ink-900 dark:text-white">No messages found</p>
          <p className="mt-1 text-sm text-ink-500">
            {search || filter !== 'all'
              ? 'Try modifying your search or filter criteria'
              : 'Messages sent via the customer contact page will appear here.'}
          </p>
        </div>
      ) : (
        <div className="card-lux overflow-visible">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead>
                <tr className="border-b border-black/5 dark:border-white/10 bg-ink-50/60 dark:bg-ink-800/60 text-[11px] uppercase tracking-wider text-ink-500 dark:text-ink-300">
                  <th className="px-4 py-3 font-semibold">Sender</th>
                  <th className="px-4 py-3 font-semibold">Message Preview</th>
                  <th className="px-4 py-3 font-semibold">Order #</th>
                  <th className="px-4 py-3 font-semibold">Received</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMessages.map((msg) => {
                  const initials = `${msg.firstName?.[0] || ''}${msg.lastName?.[0] || ''}`.toUpperCase();
                  return (
                    <tr
                      key={msg.id}
                      onClick={() => handleViewMessage(msg)}
                      className={`cursor-pointer border-b border-black/5 dark:border-white/5 transition-colors hover:bg-ink-50/60 dark:hover:bg-ink-800/40 ${
                        !msg.read ? 'font-semibold bg-gold-500/5 dark:bg-gold-500/5' : ''
                      }`}
                    >
                      {/* Sender Info */}
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                            !msg.read
                              ? 'bg-gold-500 text-ink-950'
                              : 'bg-ink-100 dark:bg-ink-800 text-ink-600 dark:text-ink-300'
                          }`}>
                            {initials || <User size={14} />}
                          </div>
                          <div>
                            <div className="text-ink-900 dark:text-white">
                              {msg.firstName} {msg.lastName}
                            </div>
                            <div className="text-xs text-ink-400 font-normal">
                              {msg.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Content Preview */}
                      <td className="px-4 py-3 max-w-[280px]">
                        <div className="truncate text-xs text-ink-600 dark:text-ink-300">
                          {msg.content}
                        </div>
                      </td>

                      {/* Order Number */}
                      <td className="px-4 py-3">
                        {msg.orderNumber ? (
                          <span className="rounded bg-gold-400/15 px-2 py-0.5 text-xs text-gold-600 dark:text-gold-300 font-mono">
                            {msg.orderNumber}
                          </span>
                        ) : (
                          <span className="text-xs text-ink-400">—</span>
                        )}
                      </td>

                      {/* Date/Time */}
                      <td className="px-4 py-3 text-xs text-ink-500 dark:text-ink-400">
                        {formatDate(msg.createdAt)}
                      </td>

                      {/* Read status Badge */}
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wider uppercase ${
                          msg.read
                            ? 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                            : 'bg-gold-500/20 text-gold-600 dark:text-gold-400 border border-gold-500/20'
                        }`}>
                          {msg.read ? 'Read' : 'Unread'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewMessage(msg)}
                            className="rounded-lg p-1.5 text-ink-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:text-white"
                            title="View Message"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={(e) => handleToggleRead(msg, e)}
                            className="rounded-lg p-1.5 text-ink-500 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:text-white"
                            title={msg.read ? 'Mark as Unread' : 'Mark as Read'}
                          >
                            {msg.read ? <Mail size={15} /> : <MailOpen size={15} />}
                          </button>
                          <button
                            onClick={(e) => handleDelete(msg.id, e)}
                            className="rounded-lg p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                            title="Delete Message"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Message View Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
          <div
            className="w-full max-w-lg rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-900 p-6 shadow-lux animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-black/5 dark:border-white/10 pb-4">
              <div>
                <span className={`inline-flex rounded-full px-2 py-0.5 text-[9px] font-semibold tracking-wider uppercase mb-1.5 ${
                  selectedMessage.read
                    ? 'bg-ink-100 text-ink-600 dark:bg-ink-800 dark:text-ink-300'
                    : 'bg-gold-500/20 text-gold-600 dark:text-gold-400'
                }`}>
                  {selectedMessage.read ? 'Read Inquiry' : 'New Inquiry'}
                </span>
                <h3 className="font-display text-lg font-bold text-ink-900 dark:text-white">
                  {selectedMessage.firstName} {selectedMessage.lastName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedMessage(null)}
                className="rounded-lg p-1.5 text-ink-400 hover:bg-black/5 dark:hover:bg-white/10 hover:text-ink-900 dark:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Details */}
            <div className="mt-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 rounded-xl bg-ink-50/60 dark:bg-ink-800/40 p-3.5 border border-black/5 dark:border-white/5">
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">Email Address</div>
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="mt-1 flex items-center gap-1 font-semibold text-gold-600 hover:underline text-xs"
                  >
                    {selectedMessage.email}
                    <ExternalLink size={12} />
                  </a>
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-ink-400">Order Number</div>
                  <div className="mt-1 font-semibold text-ink-900 dark:text-white text-xs">
                    {selectedMessage.orderNumber ? (
                      <span className="font-mono text-gold-600">{selectedMessage.orderNumber}</span>
                    ) : (
                      <span className="text-ink-400 italic font-normal">None</span>
                    )}
                  </div>
                </div>
                <div className="col-span-2 pt-2 border-t border-black/5 dark:border-white/5 flex items-center gap-1.5 text-[11px] text-ink-500 dark:text-ink-400">
                  <Calendar size={13} />
                  <span>Received: {formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase tracking-wider text-ink-400 mb-2">Message Content</div>
                <div className="rounded-xl border border-black/5 dark:border-white/10 bg-white dark:bg-ink-950 p-4 text-xs leading-relaxed text-ink-700 dark:text-ink-200 whitespace-pre-wrap max-h-60 overflow-y-auto">
                  {selectedMessage.content}
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-6 flex items-center justify-end gap-2 border-t border-black/5 dark:border-white/10 pt-4">
              <button
                type="button"
                onClick={() => handleToggleRead(selectedMessage)}
                className="btn-ghost text-xs px-3 py-1.5 flex items-center gap-1.5"
              >
                {selectedMessage.read ? (
                  <>
                    <Mail size={14} /> Mark Unread
                  </>
                ) : (
                  <>
                    <Check size={14} /> Mark Read
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => handleDelete(selectedMessage.id)}
                className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-300 text-xs px-3.5 py-1.5 flex items-center gap-1.5 font-semibold hover:bg-red-100 transition-colors"
              >
                <Trash2 size={14} /> Delete
              </button>
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: CrazyFeb Inquiry ${
                  selectedMessage.orderNumber ? `[Order #${selectedMessage.orderNumber}]` : ''
                }`}
                className="btn-dark text-xs px-4 py-1.5 flex items-center gap-1.5"
              >
                <MailOpen size={14} /> Reply
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
