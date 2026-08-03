"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowBigUp, Delete, Globe } from "lucide-react";
import { DoubleCheckMark } from "@/components/icons/DoubleCheckMark";

const ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
];

function LetterKey({ label }: { label: string }) {
  return (
    <span
      className="grid h-[30px] flex-1 place-items-center rounded-[5px] bg-white text-[13px] font-normal"
      style={{ color: "#1c1c1e", boxShadow: "0 1px 0 rgba(0,0,0,0.3)" }}
    >
      {label}
    </span>
  );
}

function FnKey({ children, grow }: { children: React.ReactNode; grow?: number }) {
  return (
    <span
      className="grid h-[30px] place-items-center rounded-[5px] text-[12px]"
      style={{
        flexGrow: grow ?? 1,
        flexBasis: 0,
        background: "#b3b9c4",
        color: "#1c1c1e",
        boxShadow: "0 1px 0 rgba(0,0,0,0.3)",
      }}
    >
      {children}
    </span>
  );
}

function Highlight({ children, on }: { children: React.ReactNode; on: boolean }) {
  return (
    <span
      className="rounded-[3px] px-0.5"
      style={{
        background: on ? "rgba(52,199,89,0.18)" : "transparent",
        boxShadow: on ? "inset 0 -1.5px 0 var(--ios-green)" : "inset 0 -1.5px 0 transparent",
        transition: "background 0.25s ease, box-shadow 0.25s ease",
      }}
    >
      {children}
    </span>
  );
}

export function AutoProtectKeyboardPreview() {
  const [holding, setHolding] = useState(false);

  return (
    <div className="w-full max-w-[320px] select-none" style={{ touchAction: "none" }}>
      {/* The draft being typed — clean while typing, highlights revealed on hold */}
      <div
        className="rounded-t-[16px] px-4 py-3.5 text-left"
        style={{ background: "var(--ios-fill)" }}
      >
        <p className="text-[14.5px] leading-relaxed" style={{ color: "var(--ios-label)" }}>
          Call me at <Highlight on={holding}>206-555-0117</Highlight> tomorrow.
          <span
            className="ml-0.5 inline-block h-[15px] w-[1.5px] translate-y-[2px] animate-pulse rounded-full"
            style={{ background: "var(--ios-blue)" }}
          />
        </p>
      </div>

      {/* iOS keyboard mockup */}
      <div className="rounded-b-[16px] px-2 pb-2 pt-2" style={{ background: "#d1d4da" }}>
        <div className="flex flex-col gap-[7px]">
          <div className="flex gap-[5px]">
            {ROWS[0].map((k) => (
              <LetterKey key={k} label={k} />
            ))}
          </div>
          <div className="flex gap-[5px] px-[14px]">
            {ROWS[1].map((k) => (
              <LetterKey key={k} label={k} />
            ))}
          </div>
          <div className="flex items-stretch gap-[5px]">
            <FnKey>
              <ArrowBigUp size={15} strokeWidth={2} />
            </FnKey>
            <div className="flex flex-[3.2] gap-[5px]">
              {["Z", "X", "C", "V", "B", "N", "M"].map((k) => (
                <LetterKey key={k} label={k} />
              ))}
            </div>
            <FnKey>
              <Delete size={15} strokeWidth={2} />
            </FnKey>
          </div>

          {/* Bottom row: 123 · globe · DoubleCheck key · space · return */}
          <div className="flex items-stretch gap-[5px]">
            <FnKey grow={1.2}>123</FnKey>
            <FnKey grow={1.2}>
              <Globe size={15} strokeWidth={2} />
            </FnKey>
            <motion.button
              aria-label="Hold to see what DoubleCheck protected"
              onPointerDown={() => setHolding(true)}
              onPointerUp={() => setHolding(false)}
              onPointerLeave={() => setHolding(false)}
              onPointerCancel={() => setHolding(false)}
              onContextMenu={(e) => e.preventDefault()}
              animate={
                holding
                  ? { boxShadow: "0 1px 0 rgba(0,0,0,0.3), 0 0 0 3px rgba(52,199,89,0.45)" }
                  : {
                      boxShadow: [
                        "0 1px 0 rgba(0,0,0,0.3), 0 0 0 0px rgba(52,199,89,0)",
                        "0 1px 0 rgba(0,0,0,0.3), 0 0 0 4px rgba(52,199,89,0.35)",
                        "0 1px 0 rgba(0,0,0,0.3), 0 0 0 0px rgba(52,199,89,0)",
                      ],
                    }
              }
              transition={holding ? { duration: 0.15 } : { duration: 1.8, repeat: Infinity, repeatDelay: 0.6 }}
              className="grid h-[30px] cursor-pointer place-items-center rounded-[5px]"
              style={{
                flexGrow: 1.2,
                flexBasis: 0,
                background: holding ? "var(--ios-green)" : "#b3b9c4",
                transition: "background 0.15s ease",
              }}
            >
              <DoubleCheckMark size={15} style={{ color: holding ? "#fff" : "#1c1c1e" }} />
            </motion.button>
            <FnKey grow={4.4}>
              <span className="text-[12px]">space</span>
            </FnKey>
            <FnKey grow={1.8}>
              <span className="text-[12px]">return</span>
            </FnKey>
          </div>
        </div>
      </div>

      {/* Hint / status caption */}
      <p
        className="mt-3 text-center text-[12.5px] font-medium"
        style={{ color: holding ? "var(--ios-green)" : "var(--ios-label-secondary)", transition: "color 0.2s ease" }}
      >
        {holding ? "These details were protected automatically." : "Press and hold the DoubleCheck key"}
      </p>
    </div>
  );
}
