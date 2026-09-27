/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import { observer } from "mobx-react";
import { ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
// icons
import { TickCircleOutline } from "@makeplane/propel/icons";
// plane imports
import { Field } from "@makeplane/propel/components/field";
import { Input, InputGroup } from "@makeplane/propel/components/input";
import { useTranslation } from "@plane/i18n";
import { Button, getButtonStyling } from "@plane/propel/button";
import { TOAST_TYPE, setToast } from "@plane/propel/toast";

import { cn, checkEmailValidity } from "@plane/utils";
// hooks
import useTimer from "@/hooks/use-timer";
// services
import { AuthService } from "@/services/auth.service";
// local components
import { AuthHeaderBase } from "./auth-header";

type TForgotPasswordFormValues = {
  email: string;
};

const defaultValues: TForgotPasswordFormValues = {
  email: "",
};

// services
const authService = new AuthService();

export const ForgotPasswordForm = observer(function ForgotPasswordForm() {
  // search params
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  // plane hooks
  const { t } = useTranslation();
  // timer
  const { timer: resendTimerCode, setTimer: setResendCodeTimer } = useTimer(0);

  // form info
  const {
    control,
    formState: { errors, isSubmitting, isValid },
    handleSubmit,
  } = useForm<TForgotPasswordFormValues>({
    defaultValues: {
      ...defaultValues,
      email: email?.toString() ?? "",
    },
  });

  const handleForgotPassword = async (formData: TForgotPasswordFormValues) => {
    await authService
      .sendResetPasswordLink({
        email: formData.email,
      })
      .then(() => {
        setToast({
          type: TOAST_TYPE.SUCCESS,
          title: t("auth.forgot_password.toast.success.title"),
          message: t("auth.forgot_password.toast.success.message"),
        });
        setResendCodeTimer(30);
      })
      .catch((err) => {
        setToast({
          type: TOAST_TYPE.ERROR,
          title: t("auth.forgot_password.toast.error.title"),
          message: err?.error ?? t("auth.forgot_password.toast.error.message"),
        });
      });
  };

  return (
    <div className="flex w-full flex-col gap-6">
      <AuthHeaderBase header="Reset your password" subHeader="Enter your work email and we’ll send you a reset link." />
      <form onSubmit={handleSubmit(handleForgotPassword)} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-semibold tracking-wide text-tertiary uppercase" htmlFor="email">
            Work email
          </label>
          <Controller
            control={control}
            name="email"
            rules={{
              required: t("auth.common.email.errors.required"),
              validate: (value) => checkEmailValidity(value) || t("auth.common.email.errors.invalid"),
            }}
            render={({ field: { value, onChange, ref } }) => (
              <Field name="email" invalid={Boolean(errors.email)}>
                <InputGroup
                  size="2xl"
                  className="min-h-12 rounded-xl bg-[#f8fafc]! text-[#0f172a] [&:not(:focus-within):not(:has([data-invalid]))]:border-[#64748b] [&:focus-within:not(:has([data-invalid]))]:border-[#0f766e] [&:focus-within:not(:has([data-invalid]))]:ring-[#0f766e]/20"
                >
                  <Mail className="size-4 shrink-0 text-[#64748b]" aria-hidden="true" />
                  <Input
                    size="2xl"
                    id="email"
                    name="email"
                    type="email"
                    value={value}
                    onChange={onChange}
                    ref={ref}
                    placeholder={t("auth.common.email.placeholder")}
                    autoComplete="email"
                    aria-describedby={errors.email ? "recovery-email-error" : undefined}
                    disabled={resendTimerCode > 0}
                  />
                </InputGroup>
              </Field>
            )}
          />
          {errors.email && (
            <p id="recovery-email-error" role="alert" className="text-[12px] text-danger-primary">
              {errors.email.message}
            </p>
          )}
          {resendTimerCode > 0 && (
            <p className="flex w-full items-start gap-1 px-1 text-11 font-medium text-success-primary">
              <TickCircleOutline height={12} width={12} className="mt-0.5" />
              {t("auth.forgot_password.email_sent")}
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="primary"
          className="w-full"
          size="xl"
          disabled={!isValid}
          loading={isSubmitting || resendTimerCode > 0}
        >
          {resendTimerCode > 0
            ? t("auth.common.resend_in", { seconds: resendTimerCode })
            : t("auth.forgot_password.send_reset_link")}
        </Button>
        <Link href="/" className={cn("min-h-11 w-full text-[#0f766e]!", getButtonStyling("link", "lg"))}>
          <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
          {t("auth.common.back_to_sign_in")}
        </Link>
      </form>
    </div>
  );
});
