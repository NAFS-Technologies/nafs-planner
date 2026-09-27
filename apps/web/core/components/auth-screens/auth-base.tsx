/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import React from "react";
import Link from "next/link";
import { AuthRoot } from "@/components/account/auth-forms/auth-root";
import { PageHead } from "@/components/core/page-title";
import { EAuthModes } from "@/helpers/authentication.helper";

type AuthBaseProps = {
  authType: EAuthModes;
  children?: React.ReactNode;
};

export function AuthBase({ authType, children }: AuthBaseProps) {
  return (
    <main className="grid min-h-dvh w-full bg-[#fdf9f5] text-[#1c1b1a] lg:grid-cols-2">
      <PageHead
        title={`${children ? "Account recovery" : authType === EAuthModes.SIGN_IN ? "Sign in" : "Sign up"} - Taskflow`}
      />
      <aside className="shadow-sm relative mx-4 mt-4 h-[250px] overflow-hidden rounded-2xl bg-[#e6e2de] sm:h-[300px] lg:sticky lg:top-0 lg:m-0 lg:h-dvh lg:rounded-none lg:shadow-none">
        <img
          src="/taskflow-login-workspace-hd.jpg"
          alt="A calm workspace with natural light and a software design desk"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/15 to-transparent" />
        <div className="absolute right-6 bottom-6 left-6 text-white lg:right-10 lg:bottom-10 lg:left-10">
          <div className="mb-4 h-1 w-8 rounded-full bg-[#62aef0] lg:h-px lg:bg-white/50" />
          <blockquote className="lg:font-normal max-w-md text-[24px] leading-[1.3] font-semibold tracking-tight lg:text-[22px]">
            Great work starts with a clear plan.
          </blockquote>
          <p className="mt-3 hidden max-w-md text-[15px] leading-6 text-white/75 lg:block">
            The thoughtful workspace designed for flow, precision, and clarity.
          </p>
          <div className="mt-6 hidden border-t border-white/20 pt-3 text-[11px] tracking-wide text-white/75 lg:block">
            TASKFLOW SOFTWARE
          </div>
        </div>
      </aside>
      <div className="flex min-w-0 flex-col justify-between px-4 py-8 sm:px-10 lg:min-h-dvh lg:px-16 lg:py-12 xl:px-20">
        <Link
          href="/"
          aria-label="Taskflow home"
          className="tracking-widest mx-auto hidden w-full max-w-[400px] items-center gap-2 text-[12px] font-bold text-black lg:flex"
        >
          <img src="/taskflow-logo.svg" alt="Taskflow" className="h-10 w-auto" />
        </Link>
        <section
          aria-label="Account access"
          className="mx-auto my-auto w-full max-w-[400px] py-1 lg:py-12 [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-4 [&_a:focus-visible]:outline-[#005db2] [&_button:focus-visible]:outline-2 [&_button:focus-visible]:outline-offset-4 [&_button:focus-visible]:outline-[#005db2] [&_button[type=submit]]:min-h-12 [&_button[type=submit]]:rounded-lg [&_button[type=submit]]:bg-black [&_button[type=submit]]:text-white [&_button[type=submit]:disabled]:opacity-50 [&_button[type=submit]:hover]:bg-[#31302e] [&_h1]:text-[28px] [&_h1]:text-black [&_input]:text-black [&_input]:placeholder:text-[#a39e98] [&_label]:text-[#31302e] [&_p]:text-[#615d59]"
        >
          {children ?? <AuthRoot authMode={authType} />}
          <p className="mt-8 text-center text-[12px] leading-5 text-[#a39e98]">
            By signing in, you agree to your organization&apos;s applicable terms and privacy policy.
          </p>
        </section>
        <footer className="mx-auto mt-8 flex w-full max-w-[400px] flex-col items-center justify-between gap-3 border-t border-[#e6e6e6] pt-6 text-[12px] text-[#a39e98] sm:flex-row lg:mt-0">
          <span>© {new Date().getFullYear()} Taskflow</span>
          <Link
            href="/accounts/forgot-password"
            className="rounded text-[#615d59] hover:text-black hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#005db2]"
          >
            Account help
          </Link>
        </footer>
      </div>
    </main>
  );
}
