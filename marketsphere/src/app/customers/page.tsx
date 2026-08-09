"use client";
import { API_URL } from "@/lib/api";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  LoaderCircle,
  Search,
  Users,
} from "lucide-react";

type Customer = {
  id: number;
  customer_id: string;
  age: number | null;
  gender: string | null;
  city: string | null;
  segment: string;
  total_spend: number;
  purchase_frequency: number;
  last_purchase_date: string | null;
  days_since_purchase: number | null;
  churn_risk: number;
  risk_level: "High" | "Medium" | "Low";
  recommended_action: string;
};

type CustomerResponse = {
  total_customers: number;
  high_risk_customers: number;
  customers: Customer[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function CustomersPage() {
  const [data, setData] = useState<CustomerResponse | null>(null);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomers() {
      try {
        const response = await fetch(
          `${API_URL}/analytics/customers`
        );

        if (!response.ok) {
          throw new Error("Unable to load customer data.");
        }

        const result: CustomerResponse = await response.json();
        setData(result);
      } catch {
        setError(
          "Could not connect to the MarketSphere API. Make sure FastAPI is running."
        );
      } finally {
        setLoading(false);
      }
    }

    loadCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!data) return [];

    const query = search.toLowerCase().trim();

    if (!query) return data.customers;

    return data.customers.filter((customer) => {
      return (
        customer.customer_id.toLowerCase().includes(query) ||
        customer.city?.toLowerCase().includes(query) ||
        customer.segment.toLowerCase().includes(query) ||
        customer.risk_level.toLowerCase().includes(query)
      );
    });
  }, [data, search]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <LoaderCircle size={20} className="animate-spin text-indigo-600" />
          Loading customer health...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
        <div className="rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-semibold">Customer data unavailable</h1>

          <p className="mt-2 text-sm text-red-600">
            {error || "No customer data was found."}
          </p>

          <Link
            href="/upload"
            className="mt-5 inline-flex rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
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
              Live customer intelligence
            </p>

            <h1 className="mt-2 text-3xl font-bold tracking-tight">
              Customer health
            </h1>

            <p className="mt-2 text-slate-500">
              Identify customers who need attention and take action early.
            </p>
          </div>

          <Link
            href="/campaigns"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Create campaign
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <SummaryCard
            icon={<Users size={20} />}
            label="Total customers"
            value={data.total_customers.toLocaleString("en-IN")}
            color="bg-blue-50 text-blue-600"
          />

          <SummaryCard
            icon={<AlertTriangle size={20} />}
            label="High-risk customers"
            value={data.high_risk_customers.toLocaleString("en-IN")}
            color="bg-rose-50 text-rose-600"
          />

          <SummaryCard
            icon={<Users size={20} />}
            label="Customers displayed"
            value={filteredCustomers.length.toLocaleString("en-IN")}
            color="bg-emerald-50 text-emerald-600"
          />
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 md:flex-row md:items-center">
            <div>
              <h2 className="font-semibold">Customer risk list</h2>

              <p className="mt-1 text-sm text-slate-500">
                Real churn-risk scores calculated from your customer data.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Search customers..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-5 py-4">Customer</th>
                  <th className="whitespace-nowrap px-5 py-4">Segment</th>
                  <th className="whitespace-nowrap px-5 py-4">
                    Total spend
                  </th>
                  <th className="whitespace-nowrap px-5 py-4">
                    Last purchase
                  </th>
                  <th className="whitespace-nowrap px-5 py-4">Churn risk</th>
                  <th className="whitespace-nowrap px-5 py-4">
                    Recommended action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((customer) => (
                  <tr key={customer.customer_id} className="hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <p className="font-semibold">
                        {customer.customer_id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {customer.city || "Unknown city"}
                        {customer.age ? ` · Age ${customer.age}` : ""}
                      </p>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-700">
                        {customer.segment}
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 font-medium">
                      {formatCurrency(customer.total_spend)}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-500">
                      {customer.last_purchase_date
                        ? new Date(
                            customer.last_purchase_date
                          ).toLocaleDateString("en-IN")
                        : "No purchase date"}
                    </td>

                    <td className="whitespace-nowrap px-5 py-4">
                      <RiskBadge
                        level={customer.risk_level}
                        risk={customer.churn_risk}
                      />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-slate-600">
                      {customer.recommended_action}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredCustomers.length === 0 && (
              <div className="p-10 text-center text-sm text-slate-500">
                No customers found.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

function RiskBadge({
  level,
  risk,
}: {
  level: "High" | "Medium" | "Low";
  risk: number;
}) {
  const styles = {
    High: "bg-rose-50 text-rose-700",
    Medium: "bg-amber-50 text-amber-700",
    Low: "bg-emerald-50 text-emerald-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[level]}`}>
      {level} · {risk}%
    </span>
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
      <div className={`mb-5 inline-flex rounded-xl p-3 ${color}`}>
        {icon}
      </div>

      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}