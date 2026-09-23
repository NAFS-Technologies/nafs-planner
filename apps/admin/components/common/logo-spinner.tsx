/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import TaskFlowLogo from "@/app/assets/branding/taskflow-logo.svg?url";

export function LogoSpinner() {
  return (
    <div className="flex items-center justify-center">
      <img src={TaskFlowLogo} alt="TaskFlow" className="h-7 w-auto object-contain sm:h-11" />
    </div>
  );
}
