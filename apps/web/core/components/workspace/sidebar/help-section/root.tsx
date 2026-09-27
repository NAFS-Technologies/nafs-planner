/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { HelpOutline } from "@makeplane/propel/icons";
import { useTranslation } from "@plane/i18n";
import { CustomMenu } from "@plane/ui";
import { AppSidebarItem } from "@/components/sidebar/sidebar-item";
import { usePowerK } from "@/hooks/store/use-power-k";
export const HelpMenuRoot = observer(function HelpMenuRoot() {
 const { t } = useTranslation();
 const { toggleShortcutsListModal } = usePowerK();
 return <CustomMenu customButton={<AppSidebarItem variant="button" item={{icon:<HelpOutline className="size-5" />}} />} placement="bottom-end" closeOnSelect>
 <CustomMenu.MenuItem onClick={() => toggleShortcutsListModal(true)}>{t("keyboard_shortcuts")}</CustomMenu.MenuItem>
 </CustomMenu>;
});
