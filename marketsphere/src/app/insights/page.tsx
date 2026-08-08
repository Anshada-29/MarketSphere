"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  Lightbulb,
  Send,
  Sparkles,
  User,
} from "lucide-react";

type Message = {
  role: "user" | "assistant";
  text: string;
};

const quickQuestions = [
  "Which segment generates the highest revenue?",
  "Why are premium customers important?",
  "Suggest a campaign for loyal customers.",
];

export default function InsightsPage() {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hello. I am your MarketSphere AI analyst. Ask me about revenue, customers, segments, churn, or marketing campaigns.",
    },
  ]);

  function generateResponse(question: string) {
    const lowerQuestion = question.toLowerCase();

    if (
      lowerQuestion.includes("highest revenue") ||
      lowerQuestion.includes("most revenue")
    ) {
      return "High Value Customers generate the highest revenue, contributing 42% of total revenue. They represent 2,148 customers with an average order value of ₹9,420. A VIP loyalty program could help increase their repeat purchases.";
    }

    if (
      lowerQuestion.includes("premium") ||
      lowerQuestion.includes("high value")
    ) {
      return "Premium customers are important because they contribute more revenue per customer and usually have stronger purchasing power. MarketSphere recommends early product access, premium bundles, and personalized loyalty benefits for this segment.";
    }

    if (
      lowerQuestion.includes("loyal") ||
      lowerQuestion.includes("referral")
    ) {
      return "For Loyal Repeat Buyers, launch a Refer and Reward campaign. This segment contains 3,620 customers and contributes 28% of revenue. Offer a referral reward, review incentive, or subscription benefit to turn loyal customers into brand advocates.";
    }

    if (
      lowerQuestion.includes("churn") ||
      lowerQuestion.includes("at-risk") ||
      lowerQuestion.includes("at risk")
    ) {
      return "There are 1,284 high-risk customers in the current analysis. Start with a win-back campaign using personalized offers, reminders, and category-specific recommendations. Prioritize customers with high historical spend first.";
    }

    if (
      lowerQuestion.includes("campaign") ||
      lowerQuestion.includes("marketing")
    ) {
      return "A practical campaign plan is: target High Value Customers with VIP early access, At-Risk Customers with win-back offers, and Discount Hunters with limited-time coupons. Track revenue, repeat purchases, and conversion rate for each campaign.";
    }

    return "Based on the current demo data, High Value Customers are the strongest revenue opportunity, while At-Risk Customers require immediate retention attention. Try asking me about revenue, churn, segments, or campaigns.";
  }

  function addMessage(question: string) {
    const answer = generateResponse(question);

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: "user", text: question },
      { role: "assistant", text: answer },
    ]);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const question = input.trim();

    if (!question) {
      return;
    }

    addMessage(question);
    setInput("");
  }

  function askQuickQuestion(question: string) {
    addMessage(question);
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 md:px-10">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600"
        >
          <ArrowLeft size={16} />
          Back to overview
        </Link>

        <div className="mb-8">
          <p className="flex items-center gap-2 text-sm font-semibold text-indigo-600">
            <Sparkles size={16} />
            MarketSphere AI
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            AI business analyst
          </h1>

          <p className="mt-2 text-slate-500">
            Ask questions about your customer data and get actionable business
            insights.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_300px]">
          {/* Chat area */}
          <section className="flex min-h-[650px] flex-col rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-slate-200 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Bot size={21} />
              </div>

              <div>
                <h2 className="font-semibold">
                  MarketSphere Analyst
                </h2>

                <p className="text-xs text-emerald-600">
                  Connected to demo workspace
                </p>
              </div>
            </div>

            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex gap-3 ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                      <Bot size={16} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                      message.role === "user"
                        ? "rounded-br-md bg-indigo-600 text-white"
                        : "rounded-bl-md bg-slate-100 text-slate-700"
                    }`}
                  >
                    {message.text}
                  </div>

                  {message.role === "user" && (
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-200 text-slate-600">
                      <User size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSubmit}
              className="border-t border-slate-200 p-4"
            >
              <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2 focus-within:border-indigo-400">
                <input
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask about your business data..."
                  className="flex-1 bg-transparent px-2 text-sm outline-none"
                />

                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-lg bg-indigo-600 p-2.5 text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  <Send size={17} />
                </button>
              </div>

              <p className="mt-2 text-center text-xs text-slate-400">
                AI responses are based on the current workspace data.
              </p>
            </form>
          </section>

          {/* Sidebar */}
          <aside className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <Lightbulb size={18} className="text-amber-500" />

                <h2 className="font-semibold">Try asking</h2>
              </div>

              <div className="mt-4 space-y-2">
                {quickQuestions.map((question) => (
                  <button
                    key={question}
                    onClick={() => askQuickQuestion(question)}
                    className="w-full rounded-lg border border-slate-200 p-3 text-left text-sm text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-indigo-600 p-5 text-white shadow-sm">
              <p className="text-sm font-medium text-indigo-200">
                Current opportunity
              </p>

              <h2 className="mt-2 text-lg font-semibold">
                Improve retention
              </h2>

              <p className="mt-2 text-sm leading-6 text-indigo-100">
                1,284 customers are currently classified as high risk. Start
                with customers who previously generated high revenue.
              </p>

              <Link
                href="/customers"
                className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-white"
              >
                View customers
                <ArrowUpRight size={15} />
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}