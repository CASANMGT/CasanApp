import { useEffect } from "react";

interface MetaPixelProps {
  pixelId: string;
}

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: any;
  }
}

export const MetaPixel = ({ pixelId }: MetaPixelProps) => {
  useEffect(() => {
    (function (f: any, b: Document, e: string, v: string) {
      let n: any, t: HTMLScriptElement, s: Node | null;
      if (f.fbq) return;
      n = f.fbq = function (...args: any[]) {
        n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
      };
      if (!f._fbq) f._fbq = n;
      n.push = n;
      n.loaded = true;
      n.version = "2.0";
      n.queue = [];
      t = b.createElement(e) as HTMLScriptElement;
      t.async = true;
      t.src = v;
      s = b.getElementsByTagName(e)[0];
      s?.parentNode?.insertBefore(t, s);
    })(
      window,
      document,
      "script",
      "https://connect.facebook.net/en_US/fbevents.js"
    );

    window.fbq?.("init", pixelId);
    window.fbq?.("track", "PageView");
  }, [pixelId]);

  return null;
};
