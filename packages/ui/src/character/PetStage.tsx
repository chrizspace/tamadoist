import { useEffect } from "react";
import { animate, motion, MotionConfig, useMotionValue, useReducedMotion } from "framer-motion";
import type { LocationId } from "@tamadoist/core";
import { Pet, type PetState } from "./Pet";
import { NameTag } from "./NameTag";
import { IDLES, PLACEMENTS, idleFor } from "./choreography";

export interface PetStageProps {
  location: LocationId;
  state?: PetState;
  name: string;
  /** Distance from the top of the screen to the name tag. */
  top: number;
  size?: number;
  /** Freeze the figure (e.g. behind a dialog). */
  still?: boolean;
}

const loop = (duration: number, times?: number[]) => ({ duration, times, repeat: Infinity, ease: "easeInOut" as const });

/**
 * The character standing in its scene: placed on the floor of the location (scaled around its feet) and playing
 * the scene's idle loop. Built with Framer Motion; honours the system "reduce motion" setting.
 */
export function PetStage({ location, state = "awake", name, top, size = 270, still }: PetStageProps) {
  const place = PLACEMENTS[location];
  const idle = IDLES[idleFor(location, state)];
  const run = !still;
  const { duration, times, travel, ...keys } = idle;
  const bodyKeys = travel ? { ...keys, x: undefined } : keys;
  const travelX = travel ? idle.x : undefined;
  const x = useMotionValue(0);
  const reduce = useReducedMotion();
  // The sideways walk drives a motion value (JS-driven) so the name tag and the body travel together.
  useEffect(() => {
    if (!travelX || !run || reduce) { x.set(0); return; }
    const controls = animate(x, travelX, loop(duration * 1.6));
    return () => controls.stop();
  }, [travelX, run, reduce, duration, x]);
  return (
    <MotionConfig reducedMotion="user">
      <div className="td-stage" style={{ top, transform: `translate(${place.x}px, ${place.y}px) scale(${place.scale})` }} data-location={location}>
        <motion.div className="td-stage__group" style={{ x }}>
          <NameTag name={name} />
          <motion.div
            className="td-stage__pet"
            animate={run ? bodyKeys : undefined}
            transition={loop(duration, times)}
          >
            <Pet state={state} size={size} />
          </motion.div>
          {location === "recreation.pool" && <Waterline width={size} />}
        </motion.div>
      </div>
    </MotionConfig>
  );
}

/** Water lapping at the character's belly in the pool: a translucent wave drawn in front of its lower body. */
function Waterline({ width }: { width: number }) {
  return (
    <motion.svg
      className="td-stage__water"
      width={width * 1.15}
      height={70}
      viewBox="0 0 230 70"
      aria-hidden="true"
      animate={{ x: [-6, 6, -6] }}
      transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
    >
      <defs>
        <linearGradient id="td-waterfade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#45B6E8" stopOpacity=".7" />
          <stop offset="0.6" stopColor="#45B6E8" stopOpacity=".25" />
          <stop offset="1" stopColor="#45B6E8" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d="M0 14 Q 19 2 38 14 T 76 14 T 114 14 T 152 14 T 190 14 T 230 14 V70 H0 Z" fill="url(#td-waterfade)" />
      <path d="M0 14 Q 19 2 38 14 T 76 14 T 114 14 T 152 14 T 190 14 T 230 14" fill="none" stroke="#fff" strokeOpacity=".7" strokeWidth="2.5" />
    </motion.svg>
  );
}
