"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  CircleDollarSign,
  LayoutDashboard,
  Menu,
  Users,
  UserRoundCheck,
  Zap,
} from "lucide-react";

type AnalyticsData = {
  total_customers: number;
  total_revenue: number;
  average_order_value: number;
  at_risk_customers: number;
  segments: {
    name: string;
    customers: number;
    revenue: number;
    revenue_share: number;
  }[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

const segmentColors: Record<string, string> = {
  "High Value Customers": "bg-indigo-500",
  "Loyal Repeat Buyers": "bg-emerald-500",
  "Discount Hunters": "bg-amber-500",
  "At-Risk Customers": "bg-rose-500",
};

export default function Home() {
  const [analytics, setAnalytics] =
    useState<AnalyticsData | null>(null);

  const [analyticsError, setAnalyticsError] = useState("");

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const response = await fetch(
          "http://localhost:8000/analytics/overview"
        );

        if (!response.ok) {
          throw new Error("Analytics request failed.");
        }

        const data: AnalyticsData = await response.json();

        setAnalytics(data);
        setAnalyticsError("");
      } catch {
        setAnalyticsError(
          "API unavailable. Start FastAPI to load live analytics."
        );
      }
    }

    loadAnalytics();
  }, []);

  const metrics = [
    {
      label: "Total customers",
      value: analytics
        ? analytics.total_customers.toLocaleString("en-IN")
        : "—",
      icon: Users,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Total revenue",
      value: analytics
        ? formatCurrency(analytics.total_revenue)
        : "—",
      icon: CircleDollarSign,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Average order value",
      value: analytics
        ? formatCurrency(analytics.average_order_value)
        : "—",
      icon: UserRoundCheck,
      color: "bg-violet-50 text-violet-600",
    },
    {
      label: "At-risk customers",
      value: analytics
        ? analytics.at_risk_customers.toLocaleString("en-IN")
        : "—",
      icon: Zap,
      color: "bg-orange-50 text-orange-600",
    },
  ];

  const dashboardSegments = analytics
    ? analytics.segments
        .filter((segment) => segment.customers > 0)
        .map((segment) => ({
          name: segment.name,
          customers: segment.customers.toLocaleString("en-IN"),
          revenue: `${segment.revenue_share}%`,
          width: `${Math.min(segment.revenue_share, 100)}%`,
          color:
            segmentColors[segment.name] || "bg-slate-500",
        }))
    : [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 border-r border-slate-200 bg-[#e1eef2] p-5 lg:block">
          <div className="mb-10 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#285a73] text-white">
              <BarChart3 size={21} />
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight">
                MarketSphere
              </h1>

              <p className="text-xs text-slate-500">
                Customer intelligence
              </p>
            </div>
          </div>

          <nav className="space-y-2">
            <SidebarLink
              href="/"
              icon={<LayoutDashboard size={18} />}
              label="Overview"
              active
            />

            <SidebarLink
              href="/customers"
              icon={<Users size={18} />}
              label="Customers"
            />

            <SidebarLink
              href="/segments"
              icon={<BarChart3 size={18} />}
              label="Segments"
            />

            <SidebarLink
              href="/campaigns"
              icon={<Zap size={18} />}
              label="Campaigns"
            />

            <SidebarLink
              href="/insights"
              icon={<Zap size={18} />}
              label="AI Analyst"
            />
          </nav>

          <div className="mt-10 rounded-2xl bg-indigo-50 p-4">
            <p className="text-sm font-semibold text-indigo-950">
              Manage your data
            </p>

            <p className="mt-1 text-xs leading-5 text-indigo-700">
              Upload customer data to refresh your business
              insights.
            </p>

            <Link
              href="/upload"
              className="mt-4 inline-block text-xs font-semibold text-indigo-700 hover:text-indigo-900"
            >
              Upload data →
            </Link>
          </div>
        </aside>

        {/* Main area */}
        <section className="flex-1">
          {/* Header */}
          <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 md:px-8">
            <div className="flex items-center gap-3">
              <button className="lg:hidden">
                <Menu size={22} />
              </button>

              <div>
                <p className="text-sm text-slate-500">
                  Workspace
                </p>

                <button className="flex items-center gap-1 text-sm font-semibold">
                  Demo workspace
                  <ChevronDown size={15} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-semibold">
                  Demo workspace
                </p>

                <p className="text-xs text-slate-500">
                  Local analytics mode
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 text-sm font-bold text-indigo-700">
                MS
              </div>
            </div>
          </header>

          {/* Dashboard content */}
          <div className="mx-auto max-w-7xl space-y-8 p-5 md:p-8">
            {/* Heading */}
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="mb-2 text-sm font-medium text-indigo-600">
                  Customer intelligence dashboard
                </p>

                <h2 className="text-3xl font-bold tracking-tight">
                  Good evening
                </h2>

                <p className="mt-2 text-slate-500">
                  Here is what is happening with your customers.
                </p>

                {analyticsError && (
                  <p className="mt-2 text-xs text-amber-600">
                    {analyticsError}
                  </p>
                )}

                {analytics && (
                  <p className="mt-2 text-xs font-medium text-emerald-600">
                    Live analytics connected
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/upload"
                  className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  Upload customer data
                </Link>

                <button className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium shadow-sm hover:bg-slate-50">
                  Last 30 days
                  <ChevronDown size={16} />
                </button>
              </div>
            </div>

            {/* KPI cards */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {metrics.map((metric) => {
                const Icon = metric.icon;

                return (
                  <div
                    key={metric.label}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between">
                      <div
                        className={`rounded-xl p-3 ${metric.color}`}
                      >
                        <Icon size={20} />
                      </div>

                      <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        {analytics ? "Live" : "Loading"}
                      </span>
                    </div>

                    <p className="mt-5 text-sm text-slate-500">
                      {metric.label}
                    </p>

                    <p className="mt-1 text-2xl font-bold tracking-tight">
                      {metric.value}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Revenue and segments */}
            <div className="grid gap-6 xl:grid-cols-3">
              {/* Revenue overview */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Revenue overview
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Revenue performance overview
                    </p>
                  </div>

                  <span className="text-xl font-bold">
                    {analytics
                      ? formatCurrency(analytics.total_revenue)
                      : "—"}
                  </span>
                </div>

                <div className="mt-8 flex h-56 items-end gap-2">
                  {[
                    35, 48, 42, 62, 54, 70, 58, 78, 67, 82, 74,
                    92,
                  ].map((height, index) => (
                    <div
                      key={index}
                      className="flex flex-1 flex-col justify-end gap-2"
                    >
                      <div
                        className="rounded-t-md bg-indigo-500 transition hover:bg-indigo-600"
                        style={{ height: `${height}%` }}
                      />

                      <span className="text-center text-[10px] text-slate-400">
                        W{index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  Detailed time-series revenue will be connected
                  in a later analytics step.
                </p>
              </div>

              {/* Segment summary */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">
                      Customer segments
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Revenue contribution
                    </p>
                  </div>

                  <Link
                    href="/segments"
                    className="text-sm font-medium text-indigo-600 hover:text-indigo-700"
                  >
                    View all
                  </Link>
                </div>

                <div className="mt-6 space-y-5">
                  {dashboardSegments.length > 0 ? (
                    dashboardSegments.map((segment) => (
                      <div key={segment.name}>
                        <div className="mb-2 flex justify-between gap-3 text-sm">
                          <span className="font-medium">
                            {segment.name}
                          </span>

                          <span className="text-slate-500">
                            {segment.revenue}
                          </span>
                        </div>

                        <div className="h-2 rounded-full bg-slate-100">
                          <div
                            className={`h-2 rounded-full ${segment.color}`}
                            style={{ width: segment.width }}
                          />
                        </div>

                        <p className="mt-1 text-xs text-slate-400">
                          {segment.customers} customers
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-400">
                      Upload customer data to view segments.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Quick actions */}
            <div className="grid gap-6 md:grid-cols-3">
              <QuickAction
                href="/customers"
                title="Review customer health"
                description="Find customers with high churn risk."
                icon={<Users size={20} />}
              />

              <QuickAction
                href="/segments"
                title="Explore segments"
                description="Understand customer behavior and value."
                icon={<BarChart3 size={20} />}
              />

              <QuickAction
                href="/campaigns"
                title="Plan a campaign"
                description="Get targeted marketing recommendations."
                icon={<Zap size={20} />}
              />
            </div>

            {/* AI insight */}
            <div className="rounded-2xl border border-indigo-100 bg-indigo-600 p-6 text-white shadow-sm">
              <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">
                <div>
                  <p className="text-sm font-medium text-indigo-200">
                    AI business insight
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    {analytics?.segments?.length
                      ? "Your customer data is ready for deeper analysis."
                      : "Upload customer data to unlock business insights."}
                  </h3>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-indigo-100">
                    MarketSphere will use your customer behavior
                    to identify valuable segments, retention
                    opportunities, and targeted marketing actions.
                  </p>
                </div>

                <Link
                  href="/insights"
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-indigo-700 hover:bg-indigo-50"
                >
                  Ask AI analyst
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: ReactNode;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium ${
        active
          ? "bg-indigo-50 text-indigo-700"
          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
      }`}
    >
      {icon}
      {label}
    </Link>
  );
}

function QuickAction({
  href,
  title,
  description,
  icon,
}: {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
          {icon}
        </div>

        <ArrowUpRight
          size={18}
          className="text-slate-400 transition group-hover:text-indigo-600"
        />
      </div>

      <h3 className="mt-5 font-semibold">{title}</h3>

      <p className="mt-1 text-sm leading-6 text-slate-500">
        {description}
      </p>
    </Link>
  );
}