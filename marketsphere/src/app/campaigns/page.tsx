
import Link from "next/link";
import {
  ArrowLeft,
  ArrowUpRight,
  Megaphone,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

const recommendations = [
  {
    segment: "High Value Customers",
    goal: "Increase customer lifetime value",
    campaign: "VIP Early Access Program",
    message:
      "Give premium customers early access to new products and exclusive bundles.",
    channels: ["Email", "WhatsApp", "Personalized landing page"],
    audience: "2,148 customers",
    impact: "High revenue opportunity",
    color: "indigo",
  },
  {
    segment: "At-Risk Customers",
    goal: "Reduce customer churn",
    campaign: "We Miss You Campaign",
    message:
      "Send a personalized win-back offer with a limited-time incentive.",
    channels: ["Email", "SMS", "Push notification"],
    audience: "1,284 customers",
    impact: "High retention opportunity",
    color: "rose",
  },
  {
    segment: "Discount Hunters",
    goal: "Increase purchase frequency",
    campaign: "Smart Flash Sale",
    message:
      "Use targeted flash sales and category-specific coupons to encourage another purchase.",
    channels: ["Email", "Social ads", "WhatsApp"],
    audience: "2,876 customers",
    impact: "Medium revenue opportunity",
    color: "amber",
  },
  {
    segment: "Loyal Repeat Buyers",
    goal: "Build customer advocacy",
    campaign: "Refer and Reward",
    message:
      "Reward loyal customers when they refer friends or leave a product review.",
    channels: ["Email", "Referral page", "In-app message"],
    audience: "3,620 customers",
    impact: "Strong growth opportunity",
    color: "emerald",
  },
];

export default function CampaignsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 md:px-10">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to overview
        </Link>

        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold text-indigo-600">
              AI growth workspace
            </p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Marketing recommendations
            </h1>
            <p className="mt-2 max-w-2xl text-slate-500">
              Turn customer intelligence into targeted campaigns and measurable
              business actions.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700">
            <Megaphone size={16} />
            Create campaign
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Target size={20} />}
            label="Recommended campaigns"
            value="4"
            color="bg-indigo-50 text-indigo-600"
          />

          <SummaryCard
            icon={<Users size={20} />}
            label="Reachable audience"
            value="9,928"
            color="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<Sparkles size={20} />}
            label="Top opportunity"
            value="Retention"
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        <section className="mt-8">
          <div className="mb-5">
            <h2 className="font-semibold">Recommended actions</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each recommendation is connected to a customer segment and a
              business objective.
            </p>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.campaign}
                recommendation={recommendation}
              />
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl bg-slate-900 p-6 text-white shadow-sm">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-indigo-300">
                MarketSphere AI
              </p>
              <h2 className="mt-2 text-xl font-semibold">
                Need a campaign for a specific business goal?
              </h2>
              <p className="mt-2 text-sm text-slate-300">
                Ask the AI analyst to create a campaign for retention, revenue,
                referrals, or cross-selling.
              </p>
            </div>

            <Link
  href="/insights"
  className="whitespace-nowrap rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
>
  Ask AI analyst
</Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function RecommendationCard({
  recommendation,
}: {
  recommendation: (typeof recommendations)[number];
}) {
  const colorStyles = {
    indigo: "bg-indigo-50 text-indigo-700 border-indigo-100",
    rose: "bg-rose-50 text-rose-700 border-rose-100",
    amber: "bg-amber-50 text-amber-700 border-amber-100",
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-100",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <span
            className={`rounded-full border px-3 py-1 text-xs font-semibold ${
              colorStyles[recommendation.color as keyof typeof colorStyles]
            }`}
          >
            {recommendation.segment}
          </span>

          <h3 className="mt-4 text-xl font-semibold">
            {recommendation.campaign}
          </h3>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {recommendation.message}
          </p>
        </div>

        <div className="rounded-xl bg-slate-100 p-3 text-slate-600">
          <Megaphone size={20} />
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 border-y border-slate-100 py-4">
        <div>
          <p className="text-xs text-slate-400">Business goal</p>
          <p className="mt-1 text-sm font-medium">{recommendation.goal}</p>
        </div>

        <div>
          <p className="text-xs text-slate-400">Target audience</p>
          <p className="mt-1 text-sm font-medium">{recommendation.audience}</p>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs text-slate-400">Suggested channels</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {recommendation.channels.map((channel) => (
            <span
              key={channel}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs text-slate-600"
            >
              {channel}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <span className="text-xs font-semibold text-emerald-600">
          {recommendation.impact}
        </span>

        <button className="inline-flex items-center gap-1 text-sm font-semibold text-indigo-600 hover:text-indigo-700">
          View campaign
          <ArrowUpRight size={15} />
        </button>
      </div>
    </article>
  );
}

function SummaryCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-5 inline-flex rounded-xl p-3 ${color}`}>{icon}</div>
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}