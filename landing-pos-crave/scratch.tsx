
import { createFileRoute } from "@tanstack/react-router";
import { Check, ListChecks, Shield, Sparkle, UserRoundCheck } from "lucide-react";
import { ImageFrame } from "@/components/ImageFrame";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { DotPattern } from "@/components/magicui/dot-pattern";
import { StripedPattern } from "@/components/magicui/striped-pattern";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PolicyPilot ΓÇö Kelola bisnis anda di dalam #1 Software" },
      {
        name: "description",
        content:
          "Otomatisasi pengelolaan bisnis ada dengan crave yang mampu memangkas waktu workflow dan managemen dengan satu software yang anda bisa kelola dimanapun",
      },
      { property: "og:title", content: "PolicyPilot ΓÇö Kelola bisnis anda di dalam #1 Software" },
      {
        property: "og:description",
        content:
          "Track policies, monitor documents, and never miss a renewal with one insurance dashboard.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Landing,
});

const NAV = ["Product", "Solution", "Features", "Testimonials", "FAQ"];

const SOLUTIONS = [
  {
    icon: Sparkle,
    body: "Ensure your team is always on the same page with policy sharing and transparent updates.",
  },
  {
    icon: ListChecks,
    body: "Prioritize and manage renewals effectively so your team can focus on what matters most.",
  },
  {
    icon: UserRoundCheck,
    body: "Hold every agent accountable without the need for constant check-ins.",
  },
];


const FEATURES = [
  {
    n: "01",
    title: "Document Compliance",
    body: "Keep every policy audit-ready with automated document monitoring. Instantly see which files are valid, pending review, incomplete, or expired.",
    bg: "var(--gradient-soft-1)",
  },
  {
    n: "02",
    title: "Storage Overview",
    body: "View total usage, remaining capacity, and detailed breakdowns by category ΓÇö from policy files to vehicle registrations and inspection reports.",
    bg: "var(--gradient-soft-2)",
  },
  {
    n: "03",
    title: "Smart Notifications",
    body: "Instantly see which items are about to expire, need validation, or require reassignment ΓÇö all in one prioritized feed.",
    bg: "var(--gradient-soft-3)",
  },
  {
    n: "04",
    title: "Performance Review",
    body: "Track agent and broker performance. See how many policies each person manages, which ones need renewal, and reassign in one click.",
    bg: "var(--gradient-soft-4)",
  },
];

const PLANS = [
  {
    name: "Basic Plan",
    price: "$9.99",
    note: "For individuals or small teams starting with policy management.",
    listTitle: "INCLUDES:",
    items: [
      "Automated policy tracking",
      "Document status monitoring",
      "Smart notifications",
    ],
    featured: false,
  },
  {
    name: "Business Plan",
    price: "$19.99",
    note: "For growing teams needing advanced compliance tools.",
    listTitle: "BASIC, PLUS:",
    items: [
      "Team collaboration dashboard",
      "Customizable workflows",
      "Advanced reporting & analytics",
      "Priority support",
    ],
    featured: true,
  },
  {
    name: "Enterprise Plan",
    price: "$49.99",
    note: "For large brokerages managing thousands of policies.",
    listTitle: "BUSINESS, PLUS:",
    items: ["Dedicated success manager", "Custom integrations", "Unlimited storage"],
    featured: false,
  },
];

const FAQS = [
  {
    q: "Can I import my existing policies?",
    a: "Yes. Upload a spreadsheet or connect your current system and PolicyPilot maps every policy, document, and renewal date automatically.",
  },
  {
    q: "How do renewal reminders work?",
    a: "Every policy gets an automated timeline. You and your client are notified before expiry, and the task lands in the right agent's queue.",
  },
  {
    q: "Is my client data secure?",
    a: "All documents are encrypted at rest and in transit, with role-based access and a full audit trail on every file action.",
  },
  {
    q: "Can I invite my whole team?",
    a: "Business and Enterprise plans include unlimited seats, shared workspaces, and per-agent performance reporting.",
  },
];

function Logo({ tone = "light" }: { tone?: "light" | "dark" }) {
  return (
    <div
      className={
        tone === "light"
          ? "flex items-center gap-2 text-brand-foreground"
          : "flex items-center gap-2 text-foreground"
      }
    >
      <Shield className="h-5 w-5" aria-hidden />
      <span className="text-base font-bold tracking-tight">PolicyPilot</span>
    </div>
  );
}

function Landing() {
  return (
    <div className="relative min-h-screen bg-background font-sans antialiased">
      {}
      <header className="bg-hero relative overflow-hidden pb-24">
        <nav className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-6 lg:grid-cols-3">
          <Logo />
          <ul className="hidden items-center justify-center gap-8 lg:flex">
            {NAV.map((item) => (
              <li key={item}>
                <a
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-brand-foreground/85 transition-colors hover:text-brand-foreground"
                >
                  {item}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex justify-end">
            <a
              href="#cta"
              className="rounded-full border border-brand-foreground/50 px-5 py-2 text-sm font-semibold text-brand-foreground transition-colors hover:bg-brand-foreground/10"
            >
              Coba Gratis
            </a>
          </div>
        </nav>

        <div className="mx-auto max-w-3xl px-6 pt-14 text-center">
          <h1 className="text-4xl leading-[1.05] font-bold tracking-tight text-brand-foreground sm:text-5xl md:text-6xl">
            Kelola bisnis anda di dalam #1 Software
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-sm text-brand-foreground/85 sm:text-base">
            A powerful dashboard that reduces errors, accelerates workflows, and ensures
            every document, renewal, and alert is handled on time.
          </p>
          <div className="mt-8 flex justify-center">
            <Button
              asChild
              className="h-11 rounded-full bg-foreground px-7 text-sm font-semibold text-background hover:bg-foreground/90"
            >
              <a href="#cta">Coba Gratis</a>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-5xl px-6">
          <div className="shadow-float rounded-2xl bg-card p-2">
            <div className="flex items-center gap-2 px-3 py-2">
              <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-chart-4/80" />
              <span className="h-2.5 w-2.5 rounded-full bg-chart-2/80" />
              <div className="mx-auto rounded-md bg-muted px-6 py-1 text-[10px] text-muted-foreground">
                policypilot.com
              </div>
            </div>
            <ImageFrame label="your image ΓÇö dashboard" ratio="16 / 10" className="rounded-xl" />
          </div>
        </div>
      </header>

      {}
      <section className="border-b border-border bg-background py-14">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
          Trusted by leaders
        </p>
        <div className="mx-auto mt-8 grid max-w-5xl grid-cols-3 items-center gap-6 px-6 sm:grid-cols-6">
          {["BMW", "Renault", "Nissan", "Audi", "Mitsubishi", "Ford"].map((brand) => (
            <ImageFrame key={brand} label={brand} ratio="5 / 2" className="rounded-lg" />
          ))}
        </div>
      </section>

      {}
      <section id="solution" className="mx-auto max-w-6xl overflow-hidden px-6 py-24">
        <div className="flex justify-center">
          <span className="shadow-card rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
            Solutions
          </span>
        </div>
        <h2 className="mx-auto mt-8 max-w-xl text-center text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl">
          Solve your team's biggest challenges
        </h2>

        <div className="mt-14 grid gap-8 border-y border-border py-10 md:grid-cols-3 md:divide-x md:divide-border">
          {SOLUTIONS.map(({ icon: Icon, body }) => (
            <div key={body} className="px-0 md:px-6">
              <Icon className="h-5 w-5 text-brand" aria-hidden />
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{body}</p>
            </div>
          ))}
        </div>

        <div className="bg-panel shadow-float mt-14 rounded-3xl p-4 sm:p-8">
          <ImageFrame
            label="your image ΓÇö app dashboard"
            ratio="16 / 10"
            className="rounded-2xl bg-card/85"
          />
        </div>
      </section>

      {/* BENTO FEATURES */}
      <section className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex justify-center">
            <span className="shadow-card rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
              Features
            </span>
          </div>
          <h2 className="mt-8 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Keep everything in one place
          </h2>
          <p className="mt-3 text-center text-sm text-muted-foreground">
            Forget complex policy management tools.
          </p>

          <div className="mt-12 grid gap-6 lg:grid-cols-5">
            <article className="shadow-card rounded-3xl bg-card p-8 lg:col-span-2">
              <ImageFrame label="your image" ratio="4 / 3" className="rounded-2xl" />
              <h3 className="mt-8 text-center text-xl font-bold text-foreground">
                Seamless Collaboration
              </h3>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Work together with your team effortlessly, share policies, and update
                progress in real-time.
              </p>
            </article>

            <article className="shadow-card rounded-3xl bg-card p-8 lg:col-span-3">
              <ImageFrame label="your image" ratio="16 / 7" className="rounded-2xl" />
              <h3 className="mt-8 text-center text-xl font-bold text-foreground">
                Time Management Tools
              </h3>
              <p className="mt-3 text-center text-sm text-muted-foreground">
                Optimize your time with integrated tools like timers, reminders, and
                renewal schedules.
              </p>
            </article>

            <article className="shadow-card grid gap-8 rounded-3xl bg-card p-8 sm:grid-cols-[minmax(0,1fr)_1.6fr] sm:items-center lg:col-span-3">
              <div>
                <h3 className="text-xl font-bold text-foreground">Advanced task tracking</h3>
                <p className="mt-3 text-sm text-muted-foreground">
                  A bird's eye view of your entire workflow and productivity.
                </p>
              </div>
              <ImageFrame label="your image" ratio="16 / 10" className="rounded-2xl" />
            </article>

            <article className="rounded-3xl border border-dashed border-border p-8 lg:col-span-2">
              <ImageFrame label="your image" ratio="16 / 9" className="rounded-2xl bg-card" />
              <h3 className="mt-8 text-center text-xl font-bold text-foreground">
                Customizable Workspaces
              </h3>
              <ImageFrame
                label="your image"
                ratio="16 / 9"
                className="mt-6 rounded-2xl bg-card"
              />
            </article>
          </div>

          <p className="mt-10 text-center text-sm text-muted-foreground">
            and a lot more features...
          </p>
        </div>
      </section>

      {}
      <section id="about" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
          About Us
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Effortless Insurance Operations
        </h2>

        <div className="mt-14 grid gap-10 md:grid-cols-3">
          {[
            {
              title: "Policy Lifecycle Management",
              body: "Create, edit, and renew policies in one place with fast, accurate workflows.",
              label: "your image ΓÇö lifecycle chart",
              ratio: "4 / 3",
            },
            {
              title: "Document Tracking & Validation",
              body: "Easily upload and verify documents with AI checks for missing or expired files.",
              label: "your image ΓÇö document validation",
              ratio: "4 / 3",
            },
            {
              title: "Smart Alerts & Renewals",
              body: "Stay on track with automated reminders, custom alerts, and bulk renewals.",
              label: "your image ΓÇö smart alerts",
              ratio: "4 / 3",
            },
          ].map((item) => (
            <article key={item.title} className="text-center">
              <ImageFrame
                label={item.label}
                ratio={item.ratio}
                className="rounded-2xl bg-card shadow-card"
              />
              <h3 className="mt-8 text-lg font-bold text-foreground">{item.title}</h3>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      {}
      <section id="features" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
          Key features
        </p>
        <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Everything You Need to Manage Policies Smarter
        </h2>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {FEATURES.map((f) => (
            <article
              key={f.n}
              className="shadow-card flex flex-col gap-8 rounded-3xl p-8"
              style={{ backgroundImage: f.bg }}
            >
              <div className="grid place-items-center py-6">
                <ImageFrame
                  label="your image"
                  ratio="16 / 9"
                  className="max-w-sm rounded-xl bg-card/70"
                />
              </div>
              <div>
                <span className="text-xs font-bold text-brand">{f.n}</span>
                <h3 className="mt-2 text-lg font-bold text-foreground">{f.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {}
      <section id="product" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
            Pricing
          </p>
          <h2 className="mx-auto mt-4 max-w-2xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Choose The Plan That Fits Your Team And Scale With Ease
          </h2>

          <div className="mt-10 flex justify-center">
            <div className="flex gap-1 rounded-full bg-card p-1 shadow-card">
              <span className="rounded-full bg-secondary px-5 py-1.5 text-sm font-semibold text-foreground">
                Monthly
              </span>
              <span className="rounded-full px-5 py-1.5 text-sm text-muted-foreground">
                Annual
              </span>
            </div>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {PLANS.map((p) => (
              <div
                key={p.name}
                className={
                  p.featured
                    ? "bg-panel shadow-float rounded-3xl p-8 text-center text-brand-foreground"
                    : "shadow-card rounded-3xl bg-card p-8 text-center"
                }
              >
                <h3 className="text-lg font-bold">{p.name}</h3>
                <p className="mt-4 text-4xl font-bold tracking-tight">
                  {p.price}
                  <span className="text-base font-medium opacity-70">/m</span>
                </p>
                <p
                  className={
                    p.featured
                      ? "mt-4 text-sm text-brand-foreground/85"
                      : "mt-4 text-sm text-muted-foreground"
                  }
                >
                  {p.note}
                </p>
                <p className="mt-8 text-[11px] font-bold tracking-[0.18em] uppercase opacity-80">
                  {p.listTitle}
                </p>
                <ul className="mt-4 space-y-3 text-sm">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-center justify-center gap-2">
                      <Check className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <Button
                  asChild
                  className={
                    p.featured
                      ? "mt-8 h-11 w-full rounded-full bg-background text-sm font-semibold text-foreground hover:bg-background/90"
                      : "mt-8 h-11 w-full rounded-full bg-foreground text-sm font-semibold text-background hover:bg-foreground/90"
                  }
                >
                  <a href="#cta">Get Started</a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {}
      <section id="testimonials" className="mx-auto max-w-6xl px-6 py-24">
        <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
          Testimonials
        </p>
        <h2 className="mx-auto mt-4 max-w-xl text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Teams That Stopped Chasing Paperwork
        </h2>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            ["Mason S.", "Broker, Northline", "Renewals used to eat two days a week. Now the dashboard tells us exactly what's due."],
            ["Anna D.", "Ops Manager, Vellum", "Every document is validated before it reaches a client. Audit season is boring now."],
            ["Ravi K.", "Agency Lead, Corso", "We onboarded twelve agents in a day and could see performance per person instantly."],
          ].map(([name, role, quote]) => (
            <figure key={name} className="shadow-card rounded-3xl bg-card p-7">
              <blockquote className="text-sm leading-relaxed text-foreground">
                ΓÇ£{quote}ΓÇ¥
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <ImageFrame label="img" ratio="1 / 1" className="h-10 w-10 rounded-full" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{name}</p>
                  <p className="truncate text-xs text-muted-foreground">{role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {}
      <section id="faq" className="bg-secondary/40 py-24">
        <div className="mx-auto max-w-3xl px-6">
          <p className="text-center text-[11px] font-bold tracking-[0.25em] text-brand uppercase">
            FAQ
          </p>
          <h2 className="mt-4 text-center text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Questions, Answered
          </h2>
          <Accordion type="single" collapsible className="mt-10">
            {FAQS.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger className="text-left text-base font-semibold">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {}
      <section id="cta" className="bg-panel px-6 py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
          <ImageFrame
            label="your image ΓÇö policy card"
            ratio="4 / 3"
            className="rounded-2xl bg-card/80"
          />
          <div className="text-brand-foreground">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Take Control of Your Policies Today
            </h2>
            <p className="mt-4 max-w-md text-sm text-brand-foreground/85">
              Automate tracking, get smart reminders, and never miss a renewal. Simplify
              compliance and stay ahead with one powerful dashboard.
            </p>
            <Button
              asChild
              className="mt-8 h-11 rounded-full bg-background px-7 text-sm font-semibold text-foreground hover:bg-background/90"
            >
              <a href="#product">Coba Gratis</a>
            </Button>
          </div>
        </div>
      </section>

      {}
      <footer className="border-t border-border bg-background">
        <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-6 py-8 sm:flex sm:justify-between">
          <Logo tone="dark" />
          <p className="text-xs text-muted-foreground">
            ┬⌐ {new Date().getFullYear()} PolicyPilot. All rights reserved.
          </p>
        </div>
      </footer>
    </div>

  );
}
