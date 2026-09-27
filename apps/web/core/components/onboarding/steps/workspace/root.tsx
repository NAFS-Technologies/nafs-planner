/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import type { IWorkspaceMemberInvitation } from "@plane/types";
import { EOnboardingSteps } from "@plane/types";
import { WorkspaceJoinInvitesStep } from "./";

type Props = {
  invitations: IWorkspaceMemberInvitation[];
  handleStepChange: (step: EOnboardingSteps, skipInvites?: boolean) => void;
};

export const WorkspaceSetupStep = observer(function WorkspaceSetupStep({ invitations, handleStepChange }: Props) {
  return <WorkspaceJoinInvitesStep invitations={invitations} handleNextStep={async () => { handleStepChange(EOnboardingSteps.WORKSPACE_CREATE_OR_JOIN, true); }} />;
});
