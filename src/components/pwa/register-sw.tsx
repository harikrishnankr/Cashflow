"use client";

import { useEffect } from "react";

export function RegisterSW() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js", {
        scope: "/",
        // Always bypass the browser's HTTP cache when checking for a new sw.js,
        // even if the server's Cache-Control headers would allow it to be cached.
        updateViaCache: "none",
      })
      .catch(console.error);
  }, []);

  return null;
}
