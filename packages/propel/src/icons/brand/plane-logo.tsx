/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";
import type { ISvgIcons } from "../type";

export function PlaneLogo({ width = "512", height = "512", className }: ISvgIcons) {
  return (
    <svg width={width} height={height} viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="TaskFlow">
      <defs>
        <linearGradient id="taskflow-blue" x1="66" y1="72" x2="444" y2="442" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D4F86"/>
          <stop offset="1" stopColor="#086BC8"/>
        </linearGradient>
        <linearGradient id="taskflow-teal" x1="190" y1="176" x2="324" y2="324" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10BFAE"/>
          <stop offset="1" stopColor="#13CCBA"/>
        </linearGradient>
      </defs>
      <path d="M111 135H337C380 135 415 170 415 213C415 256 380 291 337 291H245" stroke="url(#taskflow-blue)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M261 291H174C132 291 98 325 98 367C98 409 132 443 174 443H373" stroke="url(#taskflow-blue)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="104" cy="135" r="59" fill="url(#taskflow-blue)"/>
      <circle cx="381" cy="443" r="59" fill="url(#taskflow-blue)"/>
      <circle cx="256" cy="291" r="70" fill="url(#taskflow-teal)"/>
    </svg>
  );
}
