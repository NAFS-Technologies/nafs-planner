/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { Links, Meta, Outlet, Scripts } from "react-router";
import taskFlowIcon from "@/app/assets/branding/taskflow-icon.svg?url";
import { LogoSpinner } from "@/components/common/logo-spinner";
import globalStyles from "@/styles/globals.css?url";
import type { Route } from "./+types/root";
import ErrorPage from "./error";
import { AppProviders } from "./providers";
import "@fontsource-variable/inter";
import interVariableWoff2 from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import "@fontsource/material-symbols-rounded";
import "@fontsource/ibm-plex-mono";

const APP_TITLE = "TaskFlow Public | Share project views";
const APP_DESCRIPTION = "Public project views powered by TaskFlow.";

export const links: Route.LinksFunction = () => [
  { rel: "icon", type: "image/svg+xml", href: taskFlowIcon },
  { rel: "shortcut icon", type: "image/svg+xml", href: taskFlowIcon },
  { rel: "manifest", href: "/site.webmanifest.json" },
  { rel: "stylesheet", href: globalStyles },
  {
    rel: "preload",
    href: interVariableWoff2,
    as: "font",
    type: "font/woff2",
    crossOrigin: "anonymous",
  },
];

export const headers: Route.HeadersFunction = () => ({
  "Referrer-Policy": "origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-DNS-Prefetch-Control": "on",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains; preload",
});

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="robots" content="noindex, nofollow" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="editor-portal" />
        <AppProviders>{children}</AppProviders>
        <Scripts />
      </body>
    </html>
  );
}

export const meta: Route.MetaFunction = () => [
  { title: APP_TITLE },
  { name: "description", content: APP_DESCRIPTION },
  { property: "og:title", content: APP_TITLE },
  { property: "og:description", content: APP_DESCRIPTION },
  {
    name: "keywords",
    content: "project management, public roadmap, project views, task management, collaboration",
  },
];

export default function Root() {
  return <Outlet />;
}

export function HydrateFallback() {
  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-surface-1">
      <LogoSpinner />
    </div>
  );
}

export function ErrorBoundary({ error: _error }: Route.ErrorBoundaryProps) {
  return <ErrorPage />;
}
