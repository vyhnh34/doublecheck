"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigUp, Delete, Globe } from "lucide-react";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";

const ROW_1 = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ROW_2 = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ROW_3 = ["Z", "X", "C", "V", "B", "N", "M"];

/** Maps a physical KeyboardEvent to the on-screen key it should flash. */
function keyLabel(e: KeyboardEvent): string | null {
  if (e.key === " ") return "space";
  if (e.key === "Enter") return "return";
  if (e.key === "Backspace") return "delete";
  if (e.key === "Shift") return "shift";
  if (/^[a-zA-Z]$/.test(e.key)) return e.key.toUpperCase();
  if (e.key.length === 1) return "123";
  return null;
}

function Key({
  label,
  flashed,
  fn,
  grow,
  children,
}: {
  label: string;
  flashed: boolean;
  fn?: boolean;
  grow?: number;
  children?: React.ReactNode;
}) {
  return (
    <span
      className="grid h-[40px] place-items-center rounded-[5px] text-[16.5px]"
      style={{
        flexGrow: grow ?? 1,
        flexBasis: 0,
        background: flashed ? "#9aa0ab" : fn ? "#b3b9c4" : "#ffffff",
        color: "#1c1c1e",
        boxShadow: "0 1px 0 rgba(0,0,0,0.3)",
        transition: "background 0.08s ease",
      }}
    >
      {children ?? label}
    </span>
  );
}

/**
 * Simulated iOS keyboard docked at the bottom of the iPhone screen. Flashes
 * keys as the user types on their physical keyboard. In auto-protect mode a
 * DoubleCheck key sits next to the globe key — press and hold it to reveal
 * what's been protected in the draft.
 */
export function SimulatedKeyboard({
  showDoubleCheckKey,
  revealing,
  onRevealStart,
  onRevealEnd,
}: {
  showDoubleCheckKey: boolean;
  revealing: boolean;
  onRevealStart: () => void;
  onRevealEnd: () => void;
}) {
  const [flashed, setFlashed] = useState<string | null>(null);
  const flashTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const label = keyLabel(e);
      if (!label) return;
      if (flashTimer.current) clearTimeout(flashTimer.current);
      setFlashed(label);
      flashTimer.current = setTimeout(() => setFlashed(null), 140);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      if (flashTimer.current) clearTimeout(flashTimer.current);
    };
  }, []);

  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: "auto" }}
      exit={{ height: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 38 }}
      className="flex-shrink-0 overflow-hidden"
      // Keep focus (and the caret) in the composer while pressing on-screen keys.
      onMouseDown={(e) => e.preventDefault()}
      onPointerDown={(e) => e.preventDefault()}
    >
      <div className="px-1 pb-1 pt-2" style={{ background: "#d1d4da" }}>
        <div className="flex flex-col gap-[9px]">
          <div className="flex gap-[6px] px-[2px]">
            {ROW_1.map((k) => (
              <Key key={k} label={k} flashed={flashed === k} />
            ))}
          </div>
          <div className="flex gap-[6px] px-[20px]">
            {ROW_2.map((k) => (
              <Key key={k} label={k} flashed={flashed === k} />
            ))}
          </div>
          <div className="flex items-stretch gap-[6px] px-[2px]">
            <Key label="shift" fn grow={1.3} flashed={flashed === "shift"}>
              <ArrowBigUp size={18} strokeWidth={2} />
            </Key>
            <div className="flex flex-[7] gap-[6px]">
              {ROW_3.map((k) => (
                <Key key={k} label={k} flashed={flashed === k} />
              ))}
            </div>
            <Key label="delete" fn grow={1.3} flashed={flashed === "delete"}>
              <Delete size={18} strokeWidth={2} />
            </Key>
          </div>
          <div className="flex items-stretch gap-[6px] px-[2px]">
            <Key label="123" fn grow={1.2} flashed={flashed === "123"}>
              <span className="text-[13px]">123</span>
            </Key>
            <Key label="globe" fn grow={1.2} flashed={false}>
              <Globe size={17} strokeWidth={2} />
            </Key>
            {showDoubleCheckKey && (
              <motion.button
                aria-label="Hold to see what DoubleCheck protected"
                onPointerDown={(e) => {
                  e.preventDefault();
                  onRevealStart();
                }}
                onPointerUp={onRevealEnd}
                onPointerLeave={onRevealEnd}
                onPointerCancel={onRevealEnd}
                onContextMenu={(e) => e.preventDefault()}
                animate={{
                  boxShadow: revealing
                    ? "0 1px 0 rgba(0,0,0,0.3), 0 0 0 3px rgba(52,199,89,0.45)"
                    : "0 1px 0 rgba(0,0,0,0.3), 0 0 0 0px rgba(52,199,89,0)",
                }}
                transition={{ duration: 0.15 }}
                className="grid h-[40px] cursor-pointer place-items-center rounded-[5px]"
                style={{
                  flexGrow: 1.2,
                  flexBasis: 0,
                  background: revealing ? "var(--ios-green)" : "#b3b9c4",
                  transition: "background 0.15s ease",
                }}
              >
                <DoubleCheckMark size={17} style={{ color: revealing ? "#fff" : "#1c1c1e" }} />
              </motion.button>
            )}
            <Key label="space" fn grow={4.6} flashed={flashed === "space"}>
              <span className="text-[14px]">space</span>
            </Key>
            <Key label="return" fn grow={2} flashed={flashed === "return"}>
              <span className="text-[14px]">return</span>
            </Key>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
