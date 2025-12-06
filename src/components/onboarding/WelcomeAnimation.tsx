import Lottie from "lottie-react";
import { useMemo } from "react";

// Generate a hub-and-spoke Lottie animation data
const generateHubAnimation = () => ({
  v: "5.7.4",
  fr: 30,
  ip: 0,
  op: 180,
  w: 400,
  h: 400,
  nm: "Hub Animation",
  ddd: 0,
  assets: [],
  layers: [
    // Central hub
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Hub",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 180, s: [360] }
          ]
        },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 0, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 90, s: [110, 110, 100] },
            { t: 180, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              s: { a: 0, k: [80, 80] },
              p: { a: 0, k: [0, 0] },
              nm: "Circle"
            },
            {
              ty: "gf",
              o: { a: 0, k: 100 },
              r: 1,
              bm: 0,
              g: {
                p: 3,
                k: { a: 0, k: [0, 0.545, 0.361, 0.965, 0.5, 0.467, 0.329, 0.906, 1, 0.388, 0.298, 0.847] }
              },
              s: { a: 0, k: [-40, -40] },
              e: { a: 0, k: [40, 40] },
              t: 1,
              nm: "Gradient Fill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Hub Circle"
        }
      ],
      ip: 0,
      op: 180,
      st: 0
    },
    // Orbiting nodes
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => ({
      ddd: 0,
      ind: i + 2,
      ty: 4,
      nm: `Node ${i + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: i * 10, s: [40] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: i * 10 + 30, s: [100] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: i * 10 + 60, s: [40] },
            { t: 180, s: [40] }
          ]
        },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.667, y: 1 },
              o: { x: 0.333, y: 0 },
              t: 0,
              s: [200 + 120 * Math.cos((angle * Math.PI) / 180), 200 + 120 * Math.sin((angle * Math.PI) / 180), 0],
              to: [0, 0, 0],
              ti: [0, 0, 0]
            },
            {
              i: { x: 0.667, y: 1 },
              o: { x: 0.333, y: 0 },
              t: 90,
              s: [200 + 140 * Math.cos(((angle + 10) * Math.PI) / 180), 200 + 140 * Math.sin(((angle + 10) * Math.PI) / 180), 0],
              to: [0, 0, 0],
              ti: [0, 0, 0]
            },
            {
              t: 180,
              s: [200 + 120 * Math.cos((angle * Math.PI) / 180), 200 + 120 * Math.sin((angle * Math.PI) / 180), 0]
            }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 5, s: [100, 100, 100] },
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: i * 5 + 45, s: [130, 130, 100] },
            { t: i * 5 + 90, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              s: { a: 0, k: [20, 20] },
              p: { a: 0, k: [0, 0] },
              nm: "Node Circle"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.024, 0.714, 0.831, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              bm: 0,
              nm: "Fill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Node"
        }
      ],
      ip: 0,
      op: 180,
      st: 0
    })),
    // Connecting lines
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => ({
      ddd: 0,
      ind: i + 10,
      ty: 4,
      nm: `Line ${i + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [30] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45, s: [60] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 90, s: [30] },
            { t: 180, s: [30] }
          ]
        },
        r: { a: 0, k: angle },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "rc",
              d: 1,
              s: { a: 0, k: [80, 2] },
              p: { a: 0, k: [60, 0] },
              r: { a: 0, k: 1 },
              nm: "Line"
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.024, 0.714, 0.831, 0.5] },
              o: { a: 0, k: 100 },
              r: 1,
              bm: 0,
              nm: "Fill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Line Shape"
        }
      ],
      ip: 0,
      op: 180,
      st: 0
    })),
    // Outer ring
    {
      ddd: 0,
      ind: 20,
      ty: 4,
      nm: "Outer Ring",
      sr: 1,
      ks: {
        o: { a: 0, k: 30 },
        r: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 0, s: [0] },
            { t: 180, s: [-360] }
          ]
        },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: { a: 0, k: [100, 100, 100] }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "el",
              s: { a: 0, k: [280, 280] },
              p: { a: 0, k: [0, 0] },
              nm: "Ring"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.545, 0.361, 0.965, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 2 },
              lc: 1,
              lj: 1,
              ml: 4,
              bm: 0,
              d: [{ n: "d", nm: "dash", v: { a: 0, k: 10 } }, { n: "g", nm: "gap", v: { a: 0, k: 10 } }],
              nm: "Stroke"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Ring Shape"
        }
      ],
      ip: 0,
      op: 180,
      st: 0
    }
  ],
  markers: []
});

export function WelcomeAnimation() {
  const animationData = useMemo(() => generateHubAnimation(), []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl animate-pulse" />
      <Lottie 
        animationData={animationData}
        loop
        autoplay
        className="relative z-10"
      />
    </div>
  );
}
