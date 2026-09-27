/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import Link from "next/link";

export function AuthFooter() {
  return (
    <footer className="flex w-full shrink-0 flex-col items-center justify-between gap-2 border-t border-[#e2e8f0] bg-white/70 px-6 py-4 text-[12px] text-[#475569] sm:flex-row lg:px-12">
      <span>© {new Date().getFullYear()} Taskflow</span>
      <Link
        href="/accounts/forgot-password"
        className="inline-flex min-h-6 items-center rounded hover:text-[#0f766e] hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0f766e]"
      >
        Account help
      </Link>
    </footer>
  );
}
