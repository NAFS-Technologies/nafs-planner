/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { PlaneLogo } from "@plane/propel/icons";
export function LogoSpinner() { return <div className="flex items-center justify-center" role="status" aria-label="Loading Taskflow"><PlaneLogo className="h-8 w-8 motion-safe:animate-pulse" /><span className="sr-only">Loading Taskflow</span></div>; }
