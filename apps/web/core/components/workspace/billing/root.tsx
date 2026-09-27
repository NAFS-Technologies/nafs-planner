/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { SettingsBoxedControlItem } from "@/components/settings/boxed-control-item";
import { SettingsHeading } from "@/components/settings/heading";
export function BillingRoot() { return <section className="p-6"><SettingsHeading title="Taskflow workspace" description="Your agency delivery workspace." /><SettingsBoxedControlItem title="Taskflow" description="Unlimited projects, tasks, sprints, modules, pages, and storage" /></section>; }
