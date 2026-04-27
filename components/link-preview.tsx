"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface LinkPreviewProps {
  href: string;
  name: string;
  tags: string;
  description: string;
  children: React.ReactNode;
}

const CARD_WIDTH = 320;
const CARD_HEIGHT_ESTIMATE = 220;
const GAP = 10;
const MARGIN = 16;
const SHOW_DELAY = 120;
const HIDE_DELAY = 100;

type Placement = "top" | "bottom";

export default function LinkPreview({
  href,
  name,
  tags,
  description,
  children,
}: LinkPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    placement: Placement;
  }>({ top: 0, left: 0, placement: "top" });

  const triggerRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;

    const triggerCenterX = rect.left + rect.width / 2;
    let left = triggerCenterX - CARD_WIDTH / 2;
    left = Math.min(Math.max(MARGIN, left), vw - CARD_WIDTH - MARGIN);

    const placement: Placement =
      rect.top >= CARD_HEIGHT_ESTIMATE + GAP + MARGIN ? "top" : "bottom";

    const top =
      placement === "top"
        ? rect.top - GAP - CARD_HEIGHT_ESTIMATE
        : rect.bottom + GAP;

    setCoords({ top, left, placement });
  }, []);

  const clearTimers = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
  };

  const show = () => {
    if (hideTimer.current) {
      clearTimeout(hideTimer.current);
      hideTimer.current = null;
    }
    if (isVisible) return;
    showTimer.current = window.setTimeout(() => {
      computePosition();
      setIsVisible(true);
    }, SHOW_DELAY);
  };

  const hide = () => {
    if (showTimer.current) {
      clearTimeout(showTimer.current);
      showTimer.current = null;
    }
    hideTimer.current = window.setTimeout(() => {
      setIsVisible(false);
    }, HIDE_DELAY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!isVisible) {
      e.preventDefault();
      computePosition();
      setIsVisible(true);
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    const onChange = () => computePosition();
    window.addEventListener("scroll", onChange, true);
    window.addEventListener("resize", onChange);
    return () => {
      window.removeEventListener("scroll", onChange, true);
      window.removeEventListener("resize", onChange);
    };
  }, [isVisible, computePosition]);

  useEffect(() => {
    if (!isVisible) return;
    const onTouchOutside = (e: TouchEvent) => {
      const target = e.target as Node;
      if (
        !triggerRef.current?.contains(target) &&
        !cardRef.current?.contains(target)
      ) {
        setIsVisible(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsVisible(false);
    };
    document.addEventListener("touchstart", onTouchOutside);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("touchstart", onTouchOutside);
      document.removeEventListener("keydown", onKey);
    };
  }, [isVisible]);

  useEffect(() => clearTimers, []);

  const linkClass =
    "font-semibold underline underline-offset-3 decoration-1 hover:opacity-70 transition-opacity";

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        onMouseEnter={show}
        onMouseLeave={hide}
        onFocus={show}
        onBlur={hide}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </a>
      {isVisible && (
        <a
          ref={cardRef}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name} — ${description}`}
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            top: coords.top,
            left: coords.left,
            width: CARD_WIDTH,
            transformOrigin:
              coords.placement === "top" ? "bottom center" : "top center",
          }}
          className="link-preview-card fixed z-50 block overflow-hidden rounded-2xl border border-foreground/10 bg-background no-underline shadow-[0_14px_40px_-18px_rgba(23,23,23,0.28),0_2px_6px_-2px_rgba(23,23,23,0.06)]"
        >
          <div className="relative aspect-[16/10] overflow-hidden border-b border-foreground/[0.06] bg-foreground/[0.025]">
            <PreviewMark />
          </div>
          <div className="px-4 pt-3 pb-4">
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <span className="text-[15px] font-semibold text-foreground">
                {name}
              </span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-now-title">
                {tags}
              </span>
            </div>
            <p className="text-[13px] leading-snug text-paragraph">
              {description}
            </p>
          </div>
        </a>
      )}
    </>
  );
}

function PreviewMark() {
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_2.2fr] gap-3 p-4">
      <div className="rounded-md bg-foreground/[0.09]" />
      <div className="flex flex-col gap-2 pt-1.5">
        <div className="h-2 w-2/3 rounded-full bg-foreground/25" />
        <div className="h-1.5 w-full rounded-full bg-foreground/10" />
        <div className="h-1.5 w-5/6 rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}
