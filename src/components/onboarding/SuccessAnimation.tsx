import Lottie from "lottie-react";
import { useMemo } from "react";

// Generate a success bloom Lottie animation
const generateSuccessAnimation = () => ({
  v: "5.7.4",
  fr: 60,
  ip: 0,
  op: 120,
  w: 400,
  h: 400,
  nm: "Success Animation",
  ddd: 0,
  assets: [],
  layers: [
    // Central checkmark circle
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Check Circle",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.34], y: [1] }, o: { x: [0.66], y: [0] }, t: 0, s: [0, 0, 100] },
            { i: { x: [0.34], y: [1] }, o: { x: [0.66], y: [0] }, t: 30, s: [120, 120, 100] },
            { t: 45, s: [100, 100, 100] }
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
              s: { a: 0, k: [100, 100] },
              p: { a: 0, k: [0, 0] },
              nm: "Circle"
            },
            {
              ty: "gf",
              o: { a: 0, k: 100 },
              r: 1,
              bm: 0,
              g: {
                p: 2,
                k: { a: 0, k: [0, 0.063, 0.725, 0.506, 1, 0.024, 0.714, 0.831] }
              },
              s: { a: 0, k: [-50, -50] },
              e: { a: 0, k: [50, 50] },
              t: 1,
              nm: "Gradient"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Circle Group"
        }
      ],
      ip: 0,
      op: 120,
      st: 0
    },
    // Checkmark
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Checkmark",
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 20, s: [0] },
            { t: 40, s: [100] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.34], y: [1] }, o: { x: [0.66], y: [0] }, t: 20, s: [0, 0, 100] },
            { t: 50, s: [100, 100, 100] }
          ]
        }
      },
      ao: 0,
      shapes: [
        {
          ty: "gr",
          it: [
            {
              ty: "sh",
              ks: {
                a: 0,
                k: {
                  c: false,
                  v: [[-20, 0], [-5, 15], [25, -15]],
                  i: [[0, 0], [0, 0], [0, 0]],
                  o: [[0, 0], [0, 0], [0, 0]]
                }
              },
              nm: "Check Path"
            },
            {
              ty: "st",
              c: { a: 0, k: [1, 1, 1, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 6 },
              lc: 2,
              lj: 2,
              bm: 0,
              nm: "Stroke"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Checkmark Group"
        }
      ],
      ip: 0,
      op: 120,
      st: 0
    },
    // Radiating particles
    ...[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => ({
      ddd: 0,
      ind: i + 3,
      ty: 4,
      nm: `Particle ${i + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 30 + i * 3, s: [0] },
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 45 + i * 3, s: [100] },
            { t: 90 + i * 3, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: {
          a: 1,
          k: [
            {
              i: { x: 0.34, y: 1 },
              o: { x: 0.66, y: 0 },
              t: 30 + i * 3,
              s: [200, 200, 0],
              to: [0, 0, 0],
              ti: [0, 0, 0]
            },
            {
              t: 90 + i * 3,
              s: [200 + 150 * Math.cos((angle * Math.PI) / 180), 200 + 150 * Math.sin((angle * Math.PI) / 180), 0]
            }
          ]
        },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.667], y: [1] }, o: { x: [0.333], y: [0] }, t: 30 + i * 3, s: [100, 100, 100] },
            { t: 90 + i * 3, s: [50, 50, 100] }
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
              s: { a: 0, k: [12, 12] },
              p: { a: 0, k: [0, 0] },
              nm: "Particle"
            },
            {
              ty: "fl",
              c: { a: 0, k: i % 2 === 0 ? [0.063, 0.725, 0.506, 1] : [0.024, 0.714, 0.831, 1] },
              o: { a: 0, k: 100 },
              r: 1,
              bm: 0,
              nm: "Fill"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Particle Group"
        }
      ],
      ip: 0,
      op: 120,
      st: 0
    })),
    // Network bloom rings
    ...[0, 1, 2].map((ring) => ({
      ddd: 0,
      ind: 15 + ring,
      ty: 4,
      nm: `Ring ${ring + 1}`,
      sr: 1,
      ks: {
        o: {
          a: 1,
          k: [
            { i: { x: [0.833], y: [0.833] }, o: { x: [0.167], y: [0.167] }, t: 35 + ring * 10, s: [60] },
            { t: 80 + ring * 10, s: [0] }
          ]
        },
        r: { a: 0, k: 0 },
        p: { a: 0, k: [200, 200, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            { i: { x: [0.34], y: [1] }, o: { x: [0.66], y: [0] }, t: 35 + ring * 10, s: [100, 100, 100] },
            { t: 80 + ring * 10, s: [200 + ring * 50, 200 + ring * 50, 100] }
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
              s: { a: 0, k: [100, 100] },
              p: { a: 0, k: [0, 0] },
              nm: "Ring"
            },
            {
              ty: "st",
              c: { a: 0, k: [0.063, 0.725, 0.506, 1] },
              o: { a: 0, k: 100 },
              w: { a: 0, k: 3 - ring },
              lc: 1,
              lj: 1,
              bm: 0,
              nm: "Stroke"
            },
            { ty: "tr", p: { a: 0, k: [0, 0] }, a: { a: 0, k: [0, 0] }, s: { a: 0, k: [100, 100] }, r: { a: 0, k: 0 }, o: { a: 0, k: 100 } }
          ],
          nm: "Ring Group"
        }
      ],
      ip: 0,
      op: 120,
      st: 0
    }))
  ],
  markers: []
});

export function SuccessAnimation() {
  const animationData = useMemo(() => generateSuccessAnimation(), []);

  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-emerald/30 to-accent/20 blur-3xl animate-pulse" />
      <Lottie 
        animationData={animationData}
        loop
        autoplay
        className="relative z-10"
      />
    </div>
  );
}
