"use client";

import React, { useEffect } from "react";

interface TawkApi {
  maximize?: () => void;
  minimize?: () => void;
  toggle?: () => void;
  showWidget?: () => void;
  hideWidget?: () => void;
  onLoad?: () => void;
  onChatMinimized?: () => void;
  onChatMaximized?: () => void;
  [key: string]: unknown;
}

declare global {
  interface Window {
    Tawk_API?: TawkApi;
    Tawk_LoadStart?: Date;
  }
}

const TAWK_SRC = "https://embed.tawk.to/6ab039b0f2f1a234443e634a/default";
const SCRIPT_ID = "tawk-embed-script";

/** Hide the default Tawk logo bubble and re-hide after minimize. */
function applyCustomBranding() {
  if (typeof window === "undefined") return;
  window.Tawk_API = window.Tawk_API || {};

  const prevOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    if (typeof prevOnLoad === "function") prevOnLoad();
    try {
      window.Tawk_API?.hideWidget?.();
    } catch {
      // not ready yet
    }
  };

  // Whenever the widget is minimized, hide the default logo bubble again
  window.Tawk_API.onChatMinimized = function () {
    try {
      window.Tawk_API?.hideWidget?.();
    } catch {
      // ignore
    }
  };
}

/** Safely opens (maximizes) the Tawk.to live chat widget, handling async load. */
export function openLiveChat() {
  if (typeof window === "undefined") return;
  window.Tawk_API = window.Tawk_API || {};

  const trigger = () => {
    try {
      window.Tawk_API?.showWidget?.();
      window.Tawk_API?.maximize?.();
    } catch {
      // widget not ready yet
    }
  };

  const prevOnLoad = window.Tawk_API.onLoad;
  window.Tawk_API.onLoad = function () {
    if (typeof prevOnLoad === "function") prevOnLoad();
    trigger();
  };

  applyCustomBranding();
  trigger();
  window.setTimeout(trigger, 900);
  window.setTimeout(trigger, 2200);
}

/** Injects the Tawk.to live chat widget script once, with the default logo hidden. */
export const TawkToChat: React.FC = () => {
  useEffect(() => {
    if (typeof document === "undefined") return;

    applyCustomBranding();

    if (document.getElementById(SCRIPT_ID)) return;

    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    s1.id = SCRIPT_ID;
    s1.async = true;
    s1.src = TAWK_SRC;
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");
    document.body.appendChild(s1);
  }, []);

  return null;
};
