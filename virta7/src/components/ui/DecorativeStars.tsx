import { Star } from 'lucide-react';

const STARS = [
  { top: '2%', left: '-4%', size: 40, rotate: -12 },
  { top: '14%', left: '78%', size: 28, rotate: 8 },
  { top: '32%', left: '88%', size: 52, rotate: -6 },
  { top: '48%', left: '4%', size: 32, rotate: 15 },
  { top: '65%', left: '82%', size: 36, rotate: -10 },
  { top: '80%', left: '12%', size: 48, rotate: 5 },
  { top: '92%', left: '70%', size: 26, rotate: -18 },
];

export function DecorativeStars() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {STARS.map((s, i) => (
        <Star
          key={i}
          className="absolute fill-accent text-accent opacity-40"
          style={{
            top: s.top,
            left: s.left,
            width: s.size,
            height: s.size,
            transform: `rotate(${s.rotate}deg)`,
          }}
        />
      ))}
    </div>
  );
}
