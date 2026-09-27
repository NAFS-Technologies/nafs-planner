/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import { ArrowRight, Check, Layers, LockKeyhole } from "lucide-react";
import { AuthRoot } from "@/components/account/auth-forms/auth-root";
import type { EAuthModes } from "@/helpers/authentication.helper";
import { AuthFooter } from "./footer";
import { AuthHeader } from "./header";

type AuthBaseProps = {
  authType: EAuthModes;
};

export function AuthBase({ authType }: AuthBaseProps) {
  return (
    <div
      className="relative z-10 flex h-screen w-full flex-col overflow-y-auto bg-[#f8fafc] text-[#0f172a]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 0% 15%, #ccfbf1 0, transparent 28%), radial-gradient(circle at 100% 85%, #cffafe 0, transparent 28%)",
      }}
    >
      <AuthHeader type={authType} />
      <div className="relative mx-auto grid w-full max-w-[76rem] flex-1 items-center gap-6 px-4 py-5 sm:px-6 lg:grid-cols-[7fr_5fr] lg:gap-10 lg:px-8 lg:py-12">
        <aside className="relative order-2 overflow-hidden rounded-2xl bg-linear-to-br from-[#0b8279] via-[#0f766e] to-[#115e59] p-4 text-white shadow-xl shadow-[#115e59]/15 sm:p-6 lg:order-1 lg:rounded-3xl lg:p-10 xl:p-12">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[11px] font-semibold text-white lg:mb-8 lg:py-1.5 lg:text-[12px]">
            <Layers className="size-4" /> A clearer way to work
          </div>
          <h2 className="text-[18px] leading-[1.15] font-bold tracking-tight text-white lg:text-[2.5rem] xl:text-[3rem]">
            Great work starts with a clear plan.
          </h2>
          <p className="mt-2 text-[12px] leading-relaxed text-white lg:mt-5 lg:text-[17px]">
            <span className="lg:hidden">Bring projects, priorities, and people together on mobile.</span>
            <span className="hidden lg:inline">
              Bring your projects, priorities, and people together. Keep your team focused on what comes next.
            </span>
          </p>
          {/* ponytail: static illustration; no live workspace data needed on the login page. */}
          <div
            aria-hidden="true"
            className="mt-4 rounded-xl border border-white/60 bg-white p-3 text-[#0f172a] shadow-lg lg:mt-8 lg:rounded-2xl lg:p-5"
          >
            <div className="flex items-center justify-between border-b border-[#e2e8f0] pb-2 lg:pb-3">
              <div className="flex items-center gap-2 text-[12px] font-semibold text-[#1e293b]">
                <span className="grid size-5 place-items-center rounded-md lg:size-7 bg-[#f0fdfa] text-[#0f766e]">
                  <Layers className="size-4" />
                </span>{" "}
                Team workspace
              </div>
              <span className="rounded-md bg-[#f1f5f9] px-2 py-1 text-[10px] font-medium text-[#475569]">
                This week
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2 lg:mt-4 lg:grid-cols-3 lg:gap-3">
              {[
                { title: "To do", task: "Plan the next sprint", detail: "Planning", progress: "w-2/5" },
                { title: "In progress", task: "Build something great", detail: "Product", progress: "w-3/4" },
                { title: "Done", task: "Bring the team together", detail: "Team", progress: "w-full" },
              ].map((column, index) => (
                <div key={column.title} className={`min-w-0 ${index === 0 ? "hidden lg:block" : ""}`}>
                  <div className="mb-2 hidden items-center gap-1.5 text-[10px] font-semibold tracking-wide text-[#475569] uppercase lg:flex">
                    <span className={`size-1.5 rounded-full ${index === 1 ? "bg-[#0f766e]" : "bg-[#64748b]"}`} />
                    {column.title}
                  </div>
                  <div
                    className={`rounded-xl border p-2.5 lg:p-3 ${index === 1 ? "border-[#99f6e4] bg-[#f0fdfa]" : "border-[#e2e8f0] bg-[#f8fafc]"}`}
                  >
                    <span className="text-[10px] text-[#475569]">
                      TF-{index + 101}
                      <span className="lg:hidden"> · {column.title.toUpperCase()}</span>
                    </span>
                    <p className="mt-1 min-h-8 text-[11px] leading-4 font-semibold text-[#1e293b] lg:min-h-10 lg:text-[12px]">
                      {column.task}
                    </p>
                    <div className="mt-2 h-1.5 rounded-full lg:mt-3 bg-[#ccfbf1]">
                      <div className={`h-full rounded-full bg-[#0f766e] ${column.progress}`} />
                    </div>
                    <div className="mt-2 flex items-center justify-between text-[10px] lg:mt-3 text-[#475569]">
                      <span>{column.detail}</span>
                      <span className="grid size-5 place-items-center rounded-full bg-[#ccfbf1] text-[#115e59]">
                        {index === 2 ? <Check className="size-3" /> : <span>{index === 0 ? "JD" : "AK"}</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[12px] font-medium text-white lg:mt-8 lg:border-t lg:border-white/20 lg:pt-4 lg:text-[14px]">
            Less friction. More momentum.
            <ArrowRight className="size-4" />
          </div>
        </aside>
        <section
          aria-label="Account access"
          className="order-1 mx-auto flex w-full flex-col rounded-3xl border border-[#e2e8f0] bg-white p-6 text-[#0f172a] shadow-[0_20px_40px_-15px_rgba(15,23,42,0.1)] sm:p-8 lg:order-2 lg:p-10 [&_h1]:text-[#0f172a] [&_h1]:text-[26px] lg:[&_h1]:text-[30px] [&_p]:text-[#475569] [&_label]:text-[#334155] [&_input]:text-[#0f172a] [&_input]:placeholder:text-[#475569] [&_button:not([type=submit])]:min-h-6 [&_button:not([type=submit])]:min-w-6 [&_button[type=submit]]:min-h-12 [&_button[type=submit]]:rounded-xl [&_button[type=submit]]:bg-[#0f766e] [&_button[type=submit]]:text-white [&_button[type=submit]:hover]:bg-[#115e59] [&_button[type=submit]:disabled]:bg-[#e2e8f0] [&_button[type=submit]:disabled]:text-[#475569] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#0f766e] [&_input:focus-visible]:outline-2 [&_input:focus-visible]:outline-offset-2 [&_input:focus-visible]:outline-[#0f766e] [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#0f766e] [&_:focus-visible]:[outline-style:solid]!"
        >
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full border border-[#99f6e4] bg-[#f0fdfa] px-3 py-1 text-[12px] font-medium text-[#115e59]">
            <span className="size-1.5 rounded-full bg-[#0f766e]" aria-hidden="true" /> Workspace login
          </div>
          <AuthRoot authMode={authType} />
          <div className="mt-6 flex items-center justify-center gap-2 border-t border-[#e2e8f0] pt-5 text-center text-[12px] leading-5 text-[#475569]">
            <LockKeyhole className="size-4 shrink-0 text-[#0f766e]" aria-hidden="true" /> Sign in with your work email
            to join your team.
          </div>
        </section>
      </div>
      <AuthFooter />
    </div>
  );
}
