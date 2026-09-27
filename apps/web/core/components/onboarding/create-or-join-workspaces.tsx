/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import type { IWorkspaceMemberInvitation, TOnboardingSteps } from "@plane/types";
import { Invitations } from "./invitations";
import { SwitchAccountDropdown } from "./switch-account-dropdown";

type Props = {
  invitations: IWorkspaceMemberInvitation[];
  totalSteps: number;
  stepChange: (steps: Partial<TOnboardingSteps>) => Promise<void>;
  finishOnboarding: () => Promise<void>;
};

export const CreateOrJoinWorkspaces = observer(function CreateOrJoinWorkspaces({ invitations, finishOnboarding }: Props) {
  return <div className="flex h-full w-full"><div className="w-full overflow-auto px-6 py-10"><Invitations invitations={invitations} handleNextStep={finishOnboarding} /></div><SwitchAccountDropdown /></div>;
});
