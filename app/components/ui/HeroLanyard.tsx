"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState, type MouseEvent, type PointerEvent } from "react";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
// Half a circle in total: 90° either side, so the badge can never go over the top.
const MAX_SWING = 90;
// Dragging can pull past the limit a little; the soft limit turns that into resistance.
const DRAG_LIMIT = MAX_SWING * 1.5;
const MAX_CARD_TILT = 20;
const KNOCK_LIMIT = 8;
const KNOCK_ANGLE = 7;
const DRAG_THRESHOLD = 4;
const SWING_SPRING = { stiffness: 60, damping: 7, mass: 1.1 };
const STRAP_TEXT = Array.from({ length: 16 }, () => "RANSU.DEV").join(" · ");

interface DragState {
  pointerId: number;
  pivotX: number;
  pivotY: number;
  lastAngle: number;
  angle: number;
  startX: number;
  startY: number;
  moved: boolean;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export default function HeroLanyard() {
  const rootRef = useRef<HTMLElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);
  const reducedMotionRef = useRef(false);
  const [strapLength, setStrapLength] = useState<number | null>(null);

  // The badge chases this angle on a spring, so it lags behind the hand and keeps its momentum.
  const target = useMotionValue(0);
  const rotate = useSpring(target, SWING_SPRING);
  // Ease the swing into a soft limit so a hard throw can never send the badge over the top.
  const swing = useTransform(rotate, (value) => MAX_SWING * Math.tanh(value / MAX_SWING));
  // The card hangs from a hinge under the clip, so gravity keeps it a little more upright than the strap.
  // This is a direct, capped share of the swing: a spring here fed back into itself and spun the card around.
  const cardTilt = useTransform(swing, (value) => clamp(value * -0.3, -MAX_CARD_TILT, MAX_CARD_TILT));

  // Run the strap from the badge up to the top of the hero, or to the headline when stacked.
  useEffect(() => {
    const root = rootRef.current;
    const hero = root?.closest<HTMLElement>(".neo-hero");
    if (!root || !hero) return;

    const copy = hero.querySelector<HTMLElement>(".neo-hero__copy");

    // Layout offsets ignore transforms, so the drop-in animation and the swing can't skew the measurement.
    const topWithinHero = (el: HTMLElement) => {
      let top = 0;
      let node: HTMLElement | null = el;
      while (node && node !== hero) {
        top += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return top;
    };

    const measure = () => {
      const rootTop = topWithinHero(root);
      const copyBottom = copy ? topWithinHero(copy) + copy.offsetHeight : 0;
      const isStacked = copyBottom <= rootTop;
      const top = isStacked ? copyBottom + 16 : -8;
      setStrapLength(Math.max(48, Math.round(rootTop - top)));
    };

    measure();
    // The badge moves when the headline reflows (web fonts loading, resizing), so watch both.
    const observer = new ResizeObserver(measure);
    observer.observe(hero);
    observer.observe(root);
    if (copy) observer.observe(copy);
    document.fonts?.ready.then(measure);
    window.addEventListener("load", measure);
    return () => {
      observer.disconnect();
      window.removeEventListener("load", measure);
    };
  }, []);

  // Drop in with a swing that settles.
  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (reducedMotionRef.current) return;

    target.jump(-12);
    rotate.jump(-12);
    const timer = window.setTimeout(() => target.set(0), 250);
    return () => window.clearTimeout(timer);
  }, [target, rotate]);

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || reducedMotionRef.current || !rootRef.current) return;

    const rect = rootRef.current.getBoundingClientRect();
    const pivotX = rect.left + rect.width / 2;
    const pivotY = rect.top - (strapLength ?? 0);

    const drag: DragState = {
      pointerId: event.pointerId,
      pivotX,
      pivotY,
      lastAngle: Math.atan2(event.clientX - pivotX, event.clientY - pivotY),
      angle: target.get(),
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
    };
    dragRef.current = drag;

    // Follow the pointer across the whole page, so a fast flick off the badge still swings it.
    // Window listeners (rather than pointer capture) let a plain click still reach the About me link.
    const handleMove = (moveEvent: globalThis.PointerEvent) => {
      if (moveEvent.pointerId !== drag.pointerId) return;

      if (!drag.moved) {
        const distance = Math.hypot(moveEvent.clientX - drag.startX, moveEvent.clientY - drag.startY);
        if (distance < DRAG_THRESHOLD) return;
        drag.moved = true;
      }

      // Add up small steps instead of using the absolute angle, which jumps 360° when the pointer
      // crosses above the strap. Clamping each step pins the badge at the limit instead of flipping it.
      const pointerAngle = Math.atan2(moveEvent.clientX - drag.pivotX, moveEvent.clientY - drag.pivotY);
      let step = pointerAngle - drag.lastAngle;
      if (step > Math.PI) step -= Math.PI * 2;
      if (step < -Math.PI) step += Math.PI * 2;
      drag.lastAngle = pointerAngle;
      drag.angle = clamp(drag.angle - (step * 180) / Math.PI, -DRAG_LIMIT, DRAG_LIMIT);
      target.set(drag.angle);
    };

    const handleUp = (upEvent: globalThis.PointerEvent) => {
      if (upEvent.pointerId !== drag.pointerId) return;

      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleUp);
      dragRef.current = null;
      suppressClickRef.current = drag.moved;

      // On a quick flick the badge hasn't caught up yet, so keep pulling briefly before letting it swing back.
      const lag = Math.abs(target.get() - rotate.get());
      window.setTimeout(() => {
        if (!dragRef.current) target.set(0);
      }, Math.min(220, lag * 12));
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleUp);
  };

  // Brushing past the badge with the mouse gives it a small knock.
  const handlePointerEnter = (event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse" || dragRef.current || reducedMotionRef.current) return;
    // Ignore knocks while it's still swinging hard, so repeated passes can't build it up.
    if (Math.abs(rotate.get()) > KNOCK_LIMIT) return;
    const push = clamp(event.movementX / 4, -1, 1) * -KNOCK_ANGLE;
    if (push === 0) return;
    target.set(push);
    window.setTimeout(() => {
      if (!dragRef.current) target.set(0);
    }, 140);
  };

  const handleClickCapture = (event: MouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <aside
      ref={rootRef}
      className="lanyard"
      aria-label="About Lance"
      style={strapLength ? { ["--strap-length" as string]: `${strapLength}px` } : undefined}
    >
      <motion.div className="lanyard__swing" style={{ rotate: swing }}>
        <div className="lanyard__strap" aria-hidden="true">
          <span>{STRAP_TEXT}</span>
        </div>
        <div className="lanyard__clip" aria-hidden="true" />

        <motion.div
          className="lanyard__card"
          style={{ rotate: cardTilt }}
          onPointerDown={handlePointerDown}
          onPointerEnter={handlePointerEnter}
          onClickCapture={handleClickCapture}
        >
          <span className="lanyard__slot" aria-hidden="true" />
          <div className="lanyard__header">
            <span>ransu.dev</span>
            <span>ID 001</span>
          </div>
          <div className="lanyard__photo">
            <Image
              src="/lance-pixel-avatar.png"
              alt="Pixel portrait of Lance"
              width={256}
              height={256}
              priority
              draggable={false}
            />
          </div>
          <div className="lanyard__meta">
            <div>
              <p className="lanyard__name">Lance</p>
              <p className="lanyard__role">Developer</p>
            </div>
            <span className="lanyard__barcode" aria-hidden="true" />
          </div>
          <a href="#about" className="lanyard__about" draggable={false}>
            About me
          </a>
        </motion.div>
      </motion.div>
    </aside>
  );
}
