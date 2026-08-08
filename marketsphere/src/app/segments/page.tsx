"use client";

import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  CircleDollarSign,
  Download,
  LoaderCircle,
  Users,
} from "lucide-react";

type Segment = {
  name: string;
  customers: number;
  revenue: number;
  revenue_share: number;
};

type AnalyticsData = {
  total_customers: number;
  total_revenue: number;
  average_order_value: number;
  at_risk_customers: number;
  segments: Segment[];
};

const segmentDescriptions: Record<string, string> = {
  "High Value Customers":
    "Customers with high spending or frequent purchasing behavior.",
  "Loyal Repeat Buyers":
    "Consistent customers with strong repeat-purchase behavior.",
  "Discount Hunters":
    "Price-sensitive customers who may respond well to promotions.",
  "At-Risk Customers":
    "Customers who have not purchased recently and may need attention.",
};

const segmentColors: Record<string, string> = {
  "High Value Customers": "bg-indigo-500",
  "Loyal Repeat Buyers": "bg-emerald-500",
  "Discount Hunters": "bg-amber-500",
  "At-Risk Customers": "bg-rose-500",
};

function toNumber(value: unknown): number {
  const number = Number(value);
  return Number.isFinite(number) ? number : 0;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

export default function SegmentsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(`${API_URL}/analytics/overview`);

        if (!response.ok) {
          throw new Error("Unable to load analytics.");
        }

        const data = await response.json();

        const normalizedSegments: Segment[] = Array.isArray(data.segments)
          ? data.segments.map((segment: Partial<Segment>) => ({
              name: segment.name || "Unknown segment",
              customers: toNumber(segment.customers),
              revenue: toNumber(segment.revenue),
              revenue_share: toNumber(segment.revenue_share),
            }))
          : [];

        setAnalytics({
          total_customers: toNumber(data.total_customers),
          total_revenue: toNumber(data.total_revenue),
          average_order_value: toNumber(data.average_order_value),
          at_risk_customers: toNumber(data.at_risk_customers),
          segments: normalizedSegments,
        });
      } catch {
        setError(
          "Could not connect to the MarketSphere API. Make sure FastAPI is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadAnalytics();
  }, []);

  const highestRevenueSegment = useMemo(() => {
    const segments = analytics?.segments ?? [];

    if (segments.length === 0) {
      return null;
    }

    return [...segments].sort(
      (first, second) => second.revenue - first.revenue
    )[0];
  }, [analytics]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle size={20} className="animate-spin text-indigo-600" />
          Loading customer analytics...
        </div>
      </main>
    );
  }

  if (error || !analytics) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold text-slate-900">
            Analytics unavailable
          </h1>

          <p className="mt-2 text-sm text-red-600">
            {error || "No analytics data was found."}
          </p>

          <Link
            href="/upload"
            className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white"
          >
            Upload customer data
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
          <div>
            <Link
              href="/upload"
              className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
            >
              <ArrowLeft size={16} />
              Back to upload
            </Link>

            <p className="text-sm font-semibold text-indigo-600">
              Real customer intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Customer segments
            </h1>

            <p className="mt-2 text-slate-500">
              Segments calculated from your uploaded customer data.
            </p>
          </div>

          <button className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm hover:bg-slate-50">
            <Download size={16} />
            Export report
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <MetricCard
            icon={<Users size={20} />}
            label="Customers analyzed"
            value={analytics.total_customers.toLocaleString("en-IN")}
            color="bg-blue-50 text-blue-600"
          />

          <MetricCard
            icon={<CircleDollarSign size={20} />}
            label="Revenue analyzed"
            value={formatCurrency(analytics.total_revenue)}
            color="bg-emerald-50 text-emerald-600"
          />

          <MetricCard
            icon={<ArrowUpRight size={20} />}
            label="At-risk customers"
            value={analytics.at_risk_customers.toLocaleString("en-IN")}
            color="bg-rose-50 text-rose-600"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">Segment performance</h2>

              <p className="mt-1 text-sm text-slate-500">
                Compare customer groups by revenue and customer count.
              </p>
            </div>

            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              Live from SQLite
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {analytics.segments.map((segment) => (
              <div
                key={segment.name}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-indigo-200 hover:shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                  <div className="flex items-start gap-4">
                    <div
                      className={`mt-1 h-3 w-3 rounded-full ${
                        segmentColors[segment.name] || "bg-slate-500"
                      }`}
                    />

                    <div>
                      <h3 className="font-semibold">{segment.name}</h3>

                      <p className="mt-1 max-w-xl text-sm text-slate-500">
                        {segmentDescriptions[segment.name] ||
                          "Customer group identified from purchasing behavior."}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-6 text-right">
                    <div>
                      <p className="text-xs text-slate-400">Customers</p>
                      <p className="mt-1 font-semibold">
                        {segment.customers.toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Revenue</p>
                      <p className="mt-1 font-semibold">
                        {formatCurrency(segment.revenue)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Share</p>
                      <p className="mt-1 font-semibold text-indigo-700">
                        {segment.revenue_share}%
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 h-2 rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full ${
                      segmentColors[segment.name] || "bg-slate-500"
                    }`}
                    style={{
                      width: `${Math.min(segment.revenue_share, 100)}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-2xl bg-indigo-600 p-6 text-white shadow-sm">
          <p className="text-sm font-medium text-indigo-200">
            Business insight
          </p>

          <h2 className="mt-2 text-xl font-semibold">
            {highestRevenueSegment
              ? `${highestRevenueSegment.name} generates the most revenue.`
              : "Upload customer data to generate insights."}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-6 text-indigo-100">
            {highestRevenueSegment
              ? `${highestRevenueSegment.name} contributes ${highestRevenueSegment.revenue_share}% of analyzed revenue. Consider creating a targeted campaign for this customer group.`
              : "MarketSphere will generate segment recommendations after analyzing your customer data."}
          </p>

          <p className="mt-4 text-sm text-indigo-200">
            Average customer purchase amount:{" "}
            <span className="font-semibold text-white">
              {formatCurrency(analytics.average_order_value)}
            </span>
          </p>
        </section>
      </div>
    </main>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-5 inline-flex rounded-xl p-3 ${color}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}