import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Key, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { cn } from '../../lib/utils';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-light flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[100px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-white rounded-[32px] shadow-xl shadow-deep/5 flex items-center justify-center mx-auto mb-6 border border-deep/5">
             <Lock className="text-primary" size={32} />
          </div>
          <h1 className="text-4xl font-display font-black text-deep mb-2">Admin Portal</h1>
          <p className="text-sm font-bold text-deep/30 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
        </div>

        <div className="bg-white p-10 rounded-[48px] shadow-2xl shadow-deep/5 border border-deep/5">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-deep/20" size={18} />
                <input
                  type="email"
                  required
                  placeholder="admin@lumina.com"
                  className="w-full pl-16 pr-8 py-5 bg-bg-light border-transparent focus:bg-white focus:border-primary/30 rounded-2xl outline-none text-sm font-bold transition-all"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-deep/30 uppercase tracking-widest pl-2">Password</label>
              <div className="relative">
                <Key className="absolute left-6 top-1/2 -translate-y-1/2 text-deep/20" size={18} />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-16 pr-8 py-5 bg-bg-light border-transparent focus:bg-white focus:border-primary/30 rounded-2xl outline-none text-sm font-bold transition-all"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-500 animate-in fade-in slide-in-from-top-2">
                <AlertCircle size={18} />
                <p className="text-xs font-bold">{error}</p>
              </div>
            )}

            <button
              disabled={loading}
              className="w-full py-5 bg-deep text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-primary transition-all shadow-xl shadow-deep/10 flex items-center justify-center gap-3 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  Secure Login
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-10 text-[10px] font-black text-deep/20 uppercase tracking-widest">
          Lumina Dental Studio © 2026
        </p>
      </motion.div>
    </div>
  );
};
