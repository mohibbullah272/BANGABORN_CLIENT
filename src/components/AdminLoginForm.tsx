'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { toast } from 'sonner';
import { adminLogin } from '@/actions/Admin.action';

export function AdminLoginForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');

  const handleSubmit = () => {
    if (!form.email || !form.password) {
      setErr('Both fields are required.');
      return;
    }
    setErr('');
    startTransition(async () => {
      const res = await adminLogin(form);
      if (res.success) {
        toast.success('Welcome back, Admin!');
        router.replace('/admin/web-management');
        router.refresh();
      } else {
        setErr(res.message || 'Invalid credentials');
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      {/* Ambient bg */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-primary/8 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-sm"
      >
        {/* Card */}
        <div className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-2xl">
          {/* Header strip */}
          <div className="relative overflow-hidden border-b border-border/50 bg-muted/30 px-8 py-8">
            <div className="relative z-10 flex flex-col items-center text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
                className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20"
              >
                <ShieldCheck size={24} className="text-primary" />
              </motion.div>
              <h1 className="text-xl font-black tracking-tight text-foreground">Admin Access</h1>
              <p className="mt-1 text-[11px] text-muted-foreground">Bangaborn · Management System</p>
            </div>
            {/* Decorative dots */}
            <div className="pointer-events-none absolute right-6 top-6 grid grid-cols-3 gap-1.5 opacity-20">
              {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="h-1 w-1 rounded-full bg-primary" />
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="px-8 py-6 space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-email" className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                Email Address
              </Label>
              <div className="relative">
                <Mail size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-email"
                  type="email"
                  placeholder="admin@bangaborn.com"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="h-11 rounded-xl pl-9 text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <Label htmlFor="admin-pass" className="text-xs font-semibold uppercase tracking-wider text-foreground/70">
                Password
              </Label>
              <div className="relative">
                <Lock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="admin-pass"
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                  className="h-11 rounded-xl pl-9 pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {err && (
              <motion.p
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-xl bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive"
              >
                {err}
              </motion.p>
            )}

            {/* Submit */}
            <Button
              onClick={handleSubmit}
              disabled={isPending}
              className="mt-2 h-11 w-full rounded-xl font-bold"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Verifying…
                </span>
              ) : (
                'Enter Management'
              )}
            </Button>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-muted-foreground">
          Restricted access · Bangaborn Internal
        </p>
      </motion.div>
    </div>
  );
}