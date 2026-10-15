"use client";
import { useLayoutEffect, type RefObject } from "react";

export function usePopupPosition(open: boolean, anchorRef: RefObject<HTMLElement | null>, popupRef: RefObject<HTMLElement | null>, center = false) {
  useLayoutEffect(() => {
    if (!open) return;
    const anchor = anchorRef.current;
    const popup = popupRef.current;
    if (!anchor || !popup) return;
    const position = () => {
      const rect = anchor.getBoundingClientRect();
      const viewport = document.documentElement.clientWidth;
      const gutter = viewport < 640 ? 20 : 16;
      const width = Math.min(577, viewport - gutter * 2);
      const desiredLeft = center ? rect.left + rect.width / 2 - width / 2 : rect.left;
      const top = rect.bottom + 8;
      Object.assign(popup.style, {
        width: `${width}px`, left: `${Math.max(gutter, Math.min(desiredLeft, viewport - width - gutter))}px`,
        top: `${top}px`, maxHeight: `${Math.max(80, window.innerHeight - top - 16)}px`,
      });
    };
    position();
    window.addEventListener("resize", position);
    window.addEventListener("scroll", position, true);
    return () => {
      window.removeEventListener("resize", position);
      window.removeEventListener("scroll", position, true);
    };
  }, [open, anchorRef, popupRef, center]);
}
