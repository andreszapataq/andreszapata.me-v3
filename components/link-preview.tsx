"use client";

import Image, { type StaticImageData } from "next/image";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface LinkPreviewProps {
  href: string;
  name: string;
  tags: string;
  image?: StaticImageData;
  children: React.ReactNode;
}

const CARD_WIDTH = 320;
const CARD_HEIGHT_ESTIMATE = 170;
const GAP = 10;
const MARGIN = 16;
const SHOW_DELAY = 120;
const HIDE_DELAY = 100;

type Placement = "top" | "bottom";

export default function LinkPreview({
  href,
  name,
  tags,
  image,
  children,
}: LinkPreviewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasIntent, setHasIntent] = useState(false);
  const [coords, setCoords] = useState<{
    top: number;
    left: number;
    width: number;
    placement: Placement;
  }>({ top: 0, left: 0, width: CARD_WIDTH, placement: "top" });

  const triggerRef = useRef<HTMLAnchorElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const showTimer = useRef<number | null>(null);
  const hideTimer = useRef<number | null>(null);

  const computePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) return;
    const rect = trigger.getBoundingClientRect();
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const cardW = Math.min(CARD_WIDTH, vw - MARGIN * 2);
    const cardH = cardRef.current?.offsetHeight || CARD_HEIGHT_ESTIMATE;

    const triggerCenterX = rect.left + rect.width / 2;
    let left = triggerCenterX - cardW / 2;
    left = Math.min(Math.max(MARGIN, left), vw - cardW - MARGIN);

    const spaceAbove = rect.top - GAP - MARGIN;
    const spaceBelow = vh - rect.bottom - GAP - MARGIN;

    let placement: Placement;
    let top: number;

    if (spaceAbove >= cardH) {
      placement = "top";
      top = rect.top - GAP - cardH;
    } else if (spaceBelow >= cardH) {
      placement = "bottom";
      top = rect.bottom + GAP;
    } else {
      placement = spaceAbove >= spaceBelow ? "top" : "bottom";
      const rawTop =
        placement === "top" ? rect.top - GAP - cardH : rect.bottom + GAP;
      top = Math.max(MARGIN, Math.min(rawTop, vh - cardH - MARGIN));
    }

    setCoords({ top, left, width: cardW, placement });
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

  const triggerIntent = () => {
    setHasIntent(true);
  };

  const show = () => {
    triggerIntent();
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

  const handleTouchStart = () => {
    triggerIntent();
  };

  useLayoutEffect(() => {
    if (!isVisible) return;
    computePosition();
  }, [isVisible, computePosition]);

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
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </a>
      {hasIntent &&
        image &&
        !isVisible &&
        typeof document !== "undefined" &&
        createPortal(
          <span
            aria-hidden
            style={{
              position: "fixed",
              top: -9999,
              left: -9999,
              width: 1,
              height: 1,
              overflow: "hidden",
              pointerEvents: "none",
            }}
          >
            <Image
              src={image}
              alt=""
              width={640}
              height={400}
              sizes="320px"
              priority
            />
          </span>,
          document.body
        )}
      {isVisible &&
        createPortal(
          <a
            ref={cardRef}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${name} — ${tags}`}
            onMouseEnter={show}
            onMouseLeave={hide}
            style={{
              top: coords.top,
              left: coords.left,
              width: coords.width,
              transformOrigin:
                coords.placement === "top" ? "bottom center" : "top center",
            }}
            className="link-preview-card fixed z-50 block overflow-hidden rounded-2xl border border-foreground/10 bg-background no-underline shadow-[0_14px_40px_-18px_rgba(23,23,23,0.28),0_2px_6px_-2px_rgba(23,23,23,0.06)]"
          >
            <div className="relative aspect-16/10 overflow-hidden border-b border-foreground/6 bg-foreground/2.5">
              {image ? (
                <Image
                  src={image}
                  alt={name}
                  fill
                  sizes="320px"
                  className="object-cover"
                  placeholder="blur"
                />
              ) : (
                <PreviewMark />
              )}
            </div>
            <div className="px-4 py-3.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-[15px] font-semibold text-foreground">
                  {name}
                </span>
                <span className="shrink-0 text-[10px] uppercase tracking-[0.14em] text-now-title">
                  {tags}
                </span>
              </div>
            </div>
          </a>,
          document.body
        )}
    </>
  );
}

function PreviewMark() {
  return (
    <div className="absolute inset-0 grid grid-cols-[1fr_2.2fr] gap-3 p-4">
      <div className="rounded-md bg-foreground/9" />
      <div className="flex flex-col gap-2 pt-1.5">
        <div className="h-2 w-2/3 rounded-full bg-foreground/25" />
        <div className="h-1.5 w-full rounded-full bg-foreground/10" />
        <div className="h-1.5 w-5/6 rounded-full bg-foreground/10" />
      </div>
    </div>
  );
}
