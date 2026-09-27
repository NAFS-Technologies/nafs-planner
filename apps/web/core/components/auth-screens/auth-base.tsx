/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import { ArrowRight, Check, Layers } from "lucide-react";
import { AuthRoot } from "@/components/account/auth-forms/auth-root";
import type { EAuthModes } from "@/helpers/authentication.helper";
import { AuthFooter } from "./footer";
import { AuthHeader } from "./header";

type AuthBaseProps = {
  authType: EAuthModes;
};

export function AuthBase({ authType }: AuthBaseProps) {
  return (
    <div className="relative z-10 flex h-screen w-full flex-col overflow-y-auto bg-canvas p-5 sm:p-8 lg:p-10">
      <AuthHeader type={authType} />
      <div className="mx-auto grid w-full max-w-7xl flex-1 items-center gap-12 py-10 lg:grid-cols-2 lg:gap-20 lg:py-14">
        <aside className="relative hidden overflow-hidden rounded-3xl border border-subtle bg-accent-primary/5 p-10 lg:block xl:p-12">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-accent-primary/20 bg-surface-1 px-3 py-1.5 text-12 font-medium text-accent-primary">
            <Layers className="size-4" /> A clearer way to work
          </div>
          <h2 className="max-w-md text-[2.5rem] leading-[1.15] font-semibold tracking-tight text-primary xl:text-[3rem]">
            Great work starts
            <br />
            with a clear plan.
          </h2>
          <p className="mt-5 max-w-sm text-16 leading-relaxed text-secondary">
            Bring your projects, priorities, and people together. Keep your team focused on what comes next.
          </p>
          {/* ponytail: static illustration; no live workspace data needed on the login page. */}
          <div
            aria-hidden="true"
            className="mt-10 rounded-xl border border-subtle bg-surface-1 p-5 shadow-lg shadow-accent-primary/5"
          >
            <div className="flex items-center justify-between border-b border-subtle pb-4">
              <div className="flex items-center gap-2 text-13 font-semibold text-primary">
                <span className="grid size-7 place-items-center rounded-md bg-accent-primary/10 text-accent-primary">
                  <Layers className="size-4" />
                </span>{" "}
                Team workspace
              </div>
              <span className="rounded-md bg-layer-1 px-2 py-1 text-11 text-tertiary">This week</span>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { title: "To do", task: "Plan the next sprint", detail: "Planning", progress: "w-1/4" },
                { title: "In progress", task: "Build something great", detail: "Product", progress: "w-2/3" },
                { title: "Done", task: "Bring the team together", detail: "Team", progress: "w-full" },
              ].map((column, index) => (
                <div key={column.title} className="min-w-0">
                  <div className="mb-3 flex items-center gap-1.5 text-11 font-medium text-secondary">
                    <span
                      className={`size-1.5 rounded-full ${index === 1 ? "bg-accent-primary" : "bg-accent-primary/30"}`}
                    />
                    {column.title}
                  </div>
                  <div className="rounded-lg border border-subtle bg-layer-1 p-3">
                    <span className="text-10 text-tertiary">TF-{index + 101}</span>
                    <p className="mt-2 min-h-12 text-12 leading-5 font-medium text-primary">{column.task}</p>
                    <div className="mt-3 h-1 rounded-full bg-accent-primary/10">
                      <div className={`h-full rounded-full bg-accent-primary/60 ${column.progress}`} />
                    </div>
                    <div className="mt-3 flex items-center justify-between text-10 text-tertiary">
                      <span>{column.detail}</span>
                      <span className="grid size-5 place-items-center rounded-full bg-surface-1 text-accent-primary">
                        {index === 2 ? <Check className="size-3" /> : <span>{index === 0 ? "JD" : "AK"}</span>}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 flex items-center gap-2 text-13 font-medium text-secondary">
            Less friction. More momentum.
            <ArrowRight className="size-4 text-accent-primary" />
          </div>
        </aside>
        <section
          aria-label="Account access"
          className="mx-auto flex w-full max-w-[28rem] flex-col rounded-2xl border border-subtle bg-surface-1 px-6 py-8 sm:px-9"
        >
          <AuthRoot authMode={authType} />
        </section>
      </div>
      <AuthFooter />
    </div>
  );
}
