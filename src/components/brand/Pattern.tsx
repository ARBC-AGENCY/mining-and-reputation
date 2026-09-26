"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

type Shard = readonly ["l" | "g", string];
type Unit = readonly Shard[];

/**
 * Brand pattern (PATTERN V1 / V0001), one entry per repeating unit, sorted
 * left to right so a stagger runs across the strip. "l" shards are light
 * grey, "g" shards gold. V0001 is exactly the first six units of V1.
 */
const UNITS: readonly Unit[] = [
  [["l", "71.1,152.4 0,171.2 0,132.4 82.3,123"], ["g", "132.9,99.2 10.9,113.8 12.4,2.1 52.4,1.5 79,70.5 146.4,62.6"], ["l", "183,41 90.4,51.5 71.6,0.2 193.3,0 193.5,12.8"]],
  [["l", "230.6,18.7 301.8,0 301.8,38.8 219.5,48.2"], ["g", "168.9,72 290.8,57.4 289.4,169.1 249.4,169.7 222.8,100.7 155.4,108.5"], ["l", "118.8,130.2 211.4,119.6 230.2,170.9 108.4,171.2 108.3,158.4"]],
  [["l", "383.2,152.4 312.1,171.2 312.1,132.4 394.4,123"], ["g", "444.9,99.2 323,113.8 324.4,2.1 364.4,1.5 391.1,70.5 458.5,62.6"], ["l", "495.1,41 402.5,51.5 383.7,0.2 505.4,0 505.6,12.8"]],
  [["l", "552.2,18.7 623.3,0 623.3,38.8 541,48.2"], ["g", "490.4,72 612.4,57.4 610.9,169.1 570.9,169.7 544.3,100.7 476.9,108.5"], ["l", "440.3,130.2 532.9,119.6 551.7,170.9 429.9,171.2 429.8,158.4"]],
  [["l", "704.7,152.4 633.6,171.2 633.6,132.4 715.9,123"], ["g", "766.5,99.2 644.5,113.8 646,2.1 686,1.5 712.6,70.5 780,62.6"], ["l", "816.6,41 724,51.5 705.2,0.2 827,0 827.1,12.8"]],
  [["l", "864.2,18.7 935.4,0 935.4,38.8 853.1,48.2"], ["g", "802.5,72 924.4,57.4 923,169.1 883,169.7 856.4,100.7 789,108.5"], ["l", "752.4,130.2 845,119.6 863.8,170.9 742,171.2 741.9,158.4"]],
  [["l", "1016.8,152.4 945.6,171.2 945.6,132.4 1027.9,123"], ["g", "1078.5,99.2 956.5,113.8 958,2.1 998,1.5 1024.6,70.5 1092,62.6"], ["l", "1128.6,41 1036,51.5 1017.2,0.2 1139,0 1139.1,12.8"]],
  [["l", "1168,18.7 1239.1,0 1239.1,38.8 1156.8,48.2"], ["g", "1106.3,72 1228.2,57.4 1226.8,169.1 1186.8,169.7 1160.1,100.7 1092.7,108.5"], ["l", "1056.1,130.2 1148.7,119.6 1167.5,170.9 1045.8,171.2 1045.6,158.4"]],
  [["l", "1320.5,152.4 1249.4,171.2 1249.4,132.4 1331.7,123"], ["g", "1382.2,99.2 1260.3,113.8 1261.7,2.1 1301.8,1.5 1328.4,70.5 1395.8,62.6"], ["l", "1432.4,41 1339.8,51.5 1321,0.2 1442.7,0 1442.9,12.8"]],
  [["l", "1480,18.7 1551.1,0 1551.1,38.8 1468.8,48.2"], ["g", "1418.3,72 1540.2,57.4 1538.8,169.1 1498.8,169.7 1472.1,100.7 1404.7,108.5"], ["l", "1368.1,130.2 1460.8,119.6 1479.5,170.9 1357.8,171.2 1357.7,158.4"]],
  [["l", "1632.6,152.4 1561.4,171.2 1561.4,132.4 1643.7,123"], ["g", "1694.3,99.2 1572.4,113.8 1573.8,2.1 1613.8,1.5 1640.4,70.5 1707.8,62.6"], ["l", "1744.5,41 1651.8,51.5 1633,0.2 1754.8,0 1754.9,12.8"]],
  [["l", "1801.5,18.7 1872.7,0 1872.7,38.8 1790.4,48.2"], ["g", "1739.8,72 1861.8,57.4 1860.3,169.1 1820.3,169.7 1793.7,100.7 1726.3,108.5"], ["l", "1689.7,130.2 1782.3,119.6 1801.1,170.9 1679.3,171.2 1679.2,158.4"]],
  [["l", "1954.1,152.4 1883,171.2 1883,132.4 1965.3,123"], ["g", "2015.8,99.2 1893.9,113.8 1895.3,2.1 1935.3,1.5 1962,70.5 2029.4,62.6"], ["l", "2066,41 1973.4,51.5 1954.6,0.2 2076.3,0 2076.5,12.8"]],
  [["l", "2113.6,18.7 2184.7,0 2184.7,38.8 2102.4,48.2"], ["g", "2051.9,72 2173.8,57.4 2172.4,169.1 2132.4,169.7 2105.7,100.7 2038.3,108.5"], ["l", "2001.7,130.2 2094.3,119.6 2113.1,170.9 1991.4,171.2 1991.2,158.4"]],
];

/** Right edge of the strip after N units — the viewBox width. */
const WIDTH: Record<number, number> = { 6: 935.4, 14: 2184.7 };

const FILL = {
  l: "var(--pattern-light, #E6E6E6)",
  g: "var(--pattern-accent, #F7C15D)",
};

type PatternStripProps = {
  /** 6 = short strip (V0001), 14 = long strip (V1). */
  units?: 6 | 14;
  /**
   * "scroll" staggers the shards in when the strip enters the viewport.
   * "none" renders it static — use when a parent timeline animates the
   * `[data-pattern-unit]` groups itself.
   */
  reveal?: "scroll" | "none";
  className?: string;
};

/** Decorative: always aria-hidden. */
export function PatternStrip({
  units = 14,
  reveal = "scroll",
  className,
}: PatternStripProps) {
  const ref = useRef<SVGSVGElement>(null);

  useGSAP(
    () => {
      if (reveal !== "scroll") return;
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from("[data-pattern-unit]", {
          opacity: 0,
          yPercent: 60,
          rotate: -12,
          transformOrigin: "50% 50%",
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.045,
          scrollTrigger: { trigger: ref.current, start: "top 90%", once: true },
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${WIDTH[units]} 171.2`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      {UNITS.slice(0, units).map((unit, i) => (
        <g key={i} data-pattern-unit="">
          {unit.map(([tone, points], j) => (
            <polygon key={j} fill={FILL[tone]} points={points} />
          ))}
        </g>
      ))}
    </svg>
  );
}

/**
 * The split cross mark (PATTERN V2) that anchors the section seams. The two
 * halves are separate groups so an intro can slide them together.
 */
export function CrossMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 57.3 64.8"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <g data-cross-half="top">
        <polygon fill={FILL.l} points="54.2,20.5 57.3,32.4 50.8,32.4 49.2,18.6" />
        <polygon fill={FILL.g} points="45.3,10.2 47.7,30.6 29,30.3 28.9,23.6 40.5,19.2 39.1,7.9" />
        <polygon fill={FILL.l} points="35.5,1.8 37.3,17.3 28.7,20.4 28.7,0 30.8,0" />
      </g>
      <g data-cross-half="bottom">
        <polygon fill={FILL.l} points="3.1,44.3 0,32.4 6.5,32.4 8.1,46.2" />
        <polygon fill={FILL.g} points="12.1,54.6 9.6,34.2 28.3,34.5 28.4,41.2 16.9,45.6 18.2,56.9" />
        <polygon fill={FILL.l} points="21.8,63 20,47.5 28.6,44.4 28.7,64.8 26.5,64.8" />
      </g>
    </svg>
  );
}
