
import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, CreditCard, Crown, ShieldCheck, Sparkles, Zap } from 'lucide-react';
import {
  createRazorpayOrder,
  getPaymentHistory,
  getPaymentPlans,
  verifyRazorpayPayment,
  PaymentPlanId,
} from '../services/apiService';

declare global {
  interface Window {
    Razorpay?: any;
  }
}

const loadRazorpayScript = () =>
  new Promise<boolean>((resolve) => {
    if (window.Razorpay) return resolve(true);
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const planIcon = (id: string) => {
  if (id === 'premium') return Crown;
  if (id === 'lifetime') return Sparkles;
  if (id === 'pro') return Zap;
  return CreditCard;
};

export default function PaymentsView() {
  const [plans, setPlans] = useState<any[]>([]);
  const [currentPlan, setCurrentPlan] = useState('free');
  const [configured, setConfigured] = useState(false);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutPlan, setCheckoutPlan] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  const refresh = async () => {
    setLoading(true);
    try {
      const planData = await getPaymentPlans();
      setPlans(planData.plans);
      setCurrentPlan(planData.current_plan);
      setConfigured(planData.configured);
      const hist = await getPaymentHistory();
      setHistory(hist.payments || []);
    } catch (error: any) {
      setMessage(error.message || 'Failed to load payment plans');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const startCheckout = async (planId: PaymentPlanId, billingCycle: 'monthly' | 'lifetime') => {
    setMessage('');
    setCheckoutPlan(planId);

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay Checkout script failed to load');

      const order = await createRazorpayOrder(planId, billingCycle);

      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: order.company_name,
        description: order.description,
        order_id: order.order_id,
        prefill: {
          name: order.user?.name,
          email: order.user?.email,
        },
        notes: {
          plan: order.plan,
          billing_cycle: order.billing_cycle,
          product: 'DevForge OS',
        },
        theme: {
          color: '#111827',
        },
        handler: async (response: any) => {
          await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          setMessage('Payment verified. Your plan is now active.');
          await refresh();
        },
        modal: {
          ondismiss: () => setCheckoutPlan(null),
        },
      };

      const rz = new window.Razorpay(options);
      rz.on('payment.failed', (resp: any) => {
        setMessage(resp?.error?.description || 'Payment failed. Please try again.');
      });
      rz.open();
    } catch (error: any) {
      setMessage(error.message || 'Checkout failed');
    } finally {
      setCheckoutPlan(null);
    }
  };

  if (loading) {
    return (
      <div className="rounded-3xl border border-brand-primary/10 bg-white/70 p-8">
        <div className="h-6 w-40 animate-pulse rounded bg-brand-primary/10" />
        <div className="mt-6 grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-56 animate-pulse rounded-3xl bg-brand-primary/10" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-brand-primary/10 bg-white/80 p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-brand-primary/5 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-brand-primary/60">
              <ShieldCheck size={14} /> Payments V7
            </div>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-brand-primary">Upgrade your training room</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-brand-primary/60">
              Free users get the daily mission. Paid users unlock resume gap analysis, AI answer improvement,
              company packs, voice mock interviews, and deeper GitHub proof reviews.
            </p>
          </div>
          <div className="rounded-2xl border border-brand-primary/10 bg-brand-secondary px-5 py-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-primary/40">Current plan</p>
            <p className="text-xl font-black capitalize text-brand-primary">{currentPlan}</p>
          </div>
        </div>

        {!configured && (
          <div className="mt-6 rounded-2xl border border-amber-300/40 bg-amber-50 p-4 text-sm text-amber-800">
            Razorpay keys are not configured yet. Add <b>RAZORPAY_KEY_ID</b>, <b>RAZORPAY_KEY_SECRET</b>,
            and <b>RAZORPAY_WEBHOOK_SECRET</b> in your backend environment.
          </div>
        )}

        {message && (
          <div className="mt-6 rounded-2xl border border-brand-primary/10 bg-brand-primary/5 p-4 text-sm font-semibold text-brand-primary">
            {message}
          </div>
        )}
      </section>

      <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const Icon = planIcon(plan.id);
          const active = currentPlan === plan.id || (plan.id === 'lifetime' && currentPlan === 'pro');
          return (
            <motion.div
              key={plan.id}
              whileHover={{ y: -4 }}
              className={`relative rounded-[2rem] border p-6 shadow-sm ${
                plan.recommended
                  ? 'border-brand-primary bg-brand-primary text-white'
                  : 'border-brand-primary/10 bg-white/80 text-brand-primary'
              }`}
            >
              {plan.recommended && (
                <div className="absolute right-5 top-5 rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                  Best
                </div>
              )}
              <Icon className={plan.recommended ? 'text-white' : 'text-brand-accent'} size={28} />
              <h3 className="mt-5 text-2xl font-black">{plan.name}</h3>
              <p className={`mt-1 min-h-[40px] text-sm ${plan.recommended ? 'text-white/70' : 'text-brand-primary/55'}`}>
                {plan.best_for}
              </p>
              <div className="mt-5 flex items-end gap-1">
                <span className="text-4xl font-black">₹{plan.price_inr}</span>
                <span className={`pb-1 text-xs font-bold ${plan.recommended ? 'text-white/60' : 'text-brand-primary/40'}`}>
                  /{plan.billing_cycle === 'lifetime' ? 'once' : 'month'}
                </span>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.features.map((f: string) => (
                  <li key={f} className="flex gap-2 text-sm font-semibold">
                    <CheckCircle2 size={16} className={plan.recommended ? 'text-white' : 'text-brand-accent'} />
                    <span className={plan.recommended ? 'text-white/85' : 'text-brand-primary/70'}>{f}</span>
                  </li>
                ))}
              </ul>

              <button
                disabled={active || checkoutPlan === plan.id || !configured}
                onClick={() => startCheckout(plan.id, plan.billing_cycle)}
                className={`mt-7 w-full rounded-2xl px-4 py-3 text-sm font-black transition ${
                  active
                    ? 'bg-emerald-100 text-emerald-700'
                    : plan.recommended
                      ? 'bg-white text-brand-primary hover:bg-white/90'
                      : 'bg-brand-primary text-white hover:bg-brand-primary/90'
                } disabled:cursor-not-allowed disabled:opacity-60`}
              >
                {active ? 'Active' : checkoutPlan === plan.id ? 'Opening...' : `Upgrade to ${plan.name}`}
              </button>
            </motion.div>
          );
        })}
      </section>

      <section className="rounded-[2rem] border border-brand-primary/10 bg-white/80 p-6 shadow-sm">
        <h3 className="text-xl font-black text-brand-primary">Payment History</h3>
        <div className="mt-4 overflow-hidden rounded-2xl border border-brand-primary/10">
          {history.length === 0 ? (
            <p className="p-5 text-sm text-brand-primary/50">No payments yet.</p>
          ) : (
            <table className="w-full text-left text-sm">
              <thead className="bg-brand-primary/5 text-xs uppercase tracking-[0.15em] text-brand-primary/50">
                <tr>
                  <th className="px-4 py-3">Plan</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {history.map((p) => (
                  <tr key={p.id} className="border-t border-brand-primary/10">
                    <td className="px-4 py-3 font-bold capitalize">{p.plan}</td>
                    <td className="px-4 py-3">₹{Math.round(p.amount_paise / 100)}</td>
                    <td className="px-4 py-3 capitalize">{p.status}</td>
                    <td className="px-4 py-3 text-brand-primary/50">{new Date(p.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  );
}
