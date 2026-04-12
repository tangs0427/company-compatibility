"use client";

import { useState } from "react";

export default function ShareButtons() {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = window.location.href;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={handleCopy}
        className="flex-1 py-3 rounded-xl bg-violet-100 text-violet-700 font-medium text-sm hover:bg-violet-200 transition-colors"
      >
        {copied ? "복사됨!" : "링크 복사"}
      </button>
      <a
        href="/"
        className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium text-sm hover:bg-gray-200 transition-colors text-center"
      >
        다시 하기
      </a>
    </div>
  );
}
