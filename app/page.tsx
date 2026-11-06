import React from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { StatusBadge } from "@/components/status-badge";

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF8F5] text-[#1C1917]">
      {/* Header */}
      <header className="border-b border-[#E8E4DC] bg-[#FAF8F5]/90 backdrop-blur-xs">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Logo />
          <StatusBadge label="Phase 1: Project Foundation" indicator="preparing" />
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col items-center justify-center px-6 py-16 sm:py-24">
        <div className="flex w-full max-w-3xl flex-col items-center text-center">
          {/* Subtle Tag pill */}
          <div className="mb-6">
            <span className="inline-flex items-center rounded-md border border-[#E0D9CC] bg-[#F4EFE6] px-3 py-1 font-mono text-xs font-medium tracking-wide text-[#8C652D]">
              MULTI-TENANT RESTAURANT SAAS
            </span>
          </div>

          {/* Main Title & Tagline */}
          <h1 className="font-serif text-4xl font-semibold tracking-tight text-[#1C1917] sm:text-5xl lg:text-6xl">
            Your Restaurant. Every Table.{" "}
            <span className="text-[#A37A3C]">One Connected System.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#57534E] sm:text-lg">
            DineFlow is an enterprise-grade multi-tenant platform architected for modern restaurant
            operations, unified QR/NFC table ordering, real-time kitchen displays, and multi-branch
            management.
          </p>

          {/* Status Notification Box */}
          <div className="mt-10 w-full rounded-xl border border-[#E2DDD3] bg-white p-6 text-left shadow-xs sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#E6DEC9] bg-[#F7F3EB] text-[#A37A3C]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="text-base font-semibold text-[#1C1917]">
                  Platform Foundation in Preparation
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[#57534E]">
                  Phase 1 foundational architecture is in place. The core modular monolith,
                  PostgreSQL multi-tenant schema, strict tenant isolation boundaries, and health
                  monitoring pipelines are configured.
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <Link
                    href="/api/health"
                    className="inline-flex items-center gap-2 rounded-lg border border-[#D5CDBD] bg-[#FAF8F5] px-3.5 py-1.5 text-xs font-medium text-[#1C1917] transition hover:bg-[#F2ECE1]"
                  >
                    <span>View Health Probe (/api/health)</span>
                    <span aria-hidden="true">&rarr;</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Architectural Pillars Grid */}
          <div className="mt-8 grid w-full grid-cols-1 gap-4 text-left sm:grid-cols-3">
            <div className="rounded-xl border border-[#E8E4DC] bg-[#FCFAF7] p-5">
              <span className="font-mono text-xs font-semibold text-[#A37A3C]">01. ISOLATION</span>
              <h3 className="mt-2 text-sm font-semibold text-[#1C1917]">
                Strict Tenant Boundaries
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                All tenant-owned records enforce server-side tenant identification and relational
                constraints.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E4DC] bg-[#FCFAF7] p-5">
              <span className="font-mono text-xs font-semibold text-[#A37A3C]">02. STACK</span>
              <h3 className="mt-2 text-sm font-semibold text-[#1C1917]">
                Next.js Modular Monolith
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                Modern App Router architecture with TypeScript strict mode, Zod validation, and
                Tailwind CSS.
              </p>
            </div>

            <div className="rounded-xl border border-[#E8E4DC] bg-[#FCFAF7] p-5">
              <span className="font-mono text-xs font-semibold text-[#A37A3C]">03. DATA</span>
              <h3 className="mt-2 text-sm font-semibold text-[#1C1917]">Relational Schema</h3>
              <p className="mt-1 text-xs leading-relaxed text-[#57534E]">
                PostgreSQL with Prisma ORM modeling Tenants, Branches, Users, Roles, and
                Memberships.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E4DC] bg-[#FAF8F5] py-6">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-[#78716C] sm:flex-row">
          <p>&copy; {new Date().getFullYear()} DineFlow Technologies. All rights reserved.</p>
          <p className="font-mono text-[11px]">DineFlow Core • v0.1.0 • Phase 1 Foundation</p>
        </div>
      </footer>
    </div>
  );
}
