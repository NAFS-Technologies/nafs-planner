/**
 * Copyright (c) 2023-present Plane Software, Inc. and contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 * See the LICENSE file for details.
 */

import * as React from "react";
import type { ISvgIcons } from "../type";

export function PlaneLockup({ width = "1180", height = "260", className }: ISvgIcons) {
  return (
    <svg width={width} height={height} viewBox="0 0 1180 260" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} role="img" aria-label="TaskFlow">
      <defs>
        <linearGradient id="taskflow-blue-lockup" x1="30" y1="36" x2="250" y2="224" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D4F86"/>
          <stop offset="1" stopColor="#086BC8"/>
        </linearGradient>
        <linearGradient id="taskflow-teal-lockup" x1="105" y1="86" x2="192" y2="180" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10BFAE"/>
          <stop offset="1" stopColor="#13CCBA"/>
        </linearGradient>
      </defs>
      <g transform="translate(20 24) scale(.43)">
        <path d="M111 135H337C380 135 415 170 415 213C415 256 380 291 337 291H245" stroke="url(#taskflow-blue-lockup)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M261 291H174C132 291 98 325 98 367C98 409 132 443 174 443H373" stroke="url(#taskflow-blue-lockup)" strokeWidth="46" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="104" cy="135" r="59" fill="url(#taskflow-blue-lockup)"/>
        <circle cx="381" cy="443" r="59" fill="url(#taskflow-blue-lockup)"/>
        <circle cx="256" cy="291" r="70" fill="url(#taskflow-teal-lockup)"/>
      </g>
      <text x="250" y="181" fontFamily="Inter, Arial, Helvetica, sans-serif" fontSize="142" fontWeight="700" letterSpacing="-7">
        <tspan fill="#0D4F86">Task</tspan><tspan fill="#10BFAE">Flow</tspan>
      </text>
    </svg>
  );
}
