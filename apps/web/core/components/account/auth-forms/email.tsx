/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import type { FormEvent } from "react";
import { useMemo, useRef, useState } from "react";
import { observer } from "mobx-react";
import { ArrowRight, Mail } from "lucide-react";
import Link from "next/link";
// icons
import { CloseCircleOutline, WarningCircleOutline } from "@makeplane/propel/icons";
// plane imports
import { Field } from "@makeplane/propel/components/field";
import { Input, InputGroup } from "@makeplane/propel/components/input";
import { useTranslation } from "@plane/i18n";
import { Button } from "@plane/propel/button";
import type { IEmailCheckData } from "@plane/types";
import { Spinner } from "@plane/ui";
import { checkEmailValidity } from "@plane/utils";
// helpers
type TAuthEmailForm = {
  defaultEmail: string;
  onSubmit: (data: IEmailCheckData) => Promise<void>;
};

export const AuthEmailForm = observer(function AuthEmailForm(props: TAuthEmailForm) {
  const { onSubmit, defaultEmail } = props;
  // states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState(defaultEmail);
  // plane hooks
  const { t } = useTranslation();
  const emailError = useMemo(
    () => (email && !checkEmailValidity(email) ? { email: "auth.common.email.errors.invalid" } : undefined),
    [email]
  );

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    const payload: IEmailCheckData = {
      email: email,
    };
    await onSubmit(payload);
    setIsSubmitting(false);
  };

  const isButtonDisabled = email.length === 0 || Boolean(emailError?.email) || isSubmitting;

  const [isFocused, setIsFocused] = useState(true);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={handleFormSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-[12px] font-semibold tracking-wide text-tertiary uppercase">
          Work email
        </label>
        <Field name="email" invalid={!isFocused && Boolean(emailError?.email)}>
          <InputGroup
            size="2xl"
            className="min-h-12 rounded-xl bg-[#f8fafc]! text-[#0f172a] [&:not(:focus-within):not(:has([data-invalid]))]:border-[#64748b] [&:focus-within:not(:has([data-invalid]))]:border-[#0f766e] [&:focus-within:not(:has([data-invalid]))]:ring-[#0f766e]/20"
            onFocus={() => {
              setIsFocused(true);
            }}
            onBlur={() => {
              setIsFocused(false);
            }}
          >
            <Mail className="size-4 shrink-0 text-[#64748b]" aria-hidden="true" />
            <Input
              size="2xl"
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t("auth.common.email.placeholder")}
              autoComplete="email"
              aria-describedby={emailError?.email && !isFocused ? "email-error" : undefined}
              ref={inputRef}
            />
            {email.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  setEmail("");
                  inputRef.current?.focus();
                }}
                className="grid size-6 place-items-center"
                aria-label={t("aria_labels.auth_forms.clear_email")}
                tabIndex={-1}
              >
                <CloseCircleOutline className="size-5 text-placeholder" />
              </button>
            )}
          </InputGroup>
        </Field>
        {emailError?.email && !isFocused && (
          <p id="email-error" role="alert" className="flex items-center gap-1 px-0.5 text-11 text-danger-primary">
            <WarningCircleOutline height={12} width={12} />
            {t(emailError.email)}
          </p>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 text-[12px]">
        <span className="text-[#475569]">Use your work email</span>
        <Link
          href="/accounts/forgot-password"
          className="inline-flex min-h-6 items-center font-semibold text-[#0f766e] hover:underline"
        >
          Need help?
        </Link>
      </div>
      <Button type="submit" variant="primary" className="min-h-11 w-full" size="xl" disabled={isButtonDisabled}>
        {isSubmitting ? (
          <Spinner height="20px" width="20px" />
        ) : (
          <>
            {t("common.continue")}
            <ArrowRight className="ml-2 size-4" aria-hidden="true" />
          </>
        )}
      </Button>
    </form>
  );
});
