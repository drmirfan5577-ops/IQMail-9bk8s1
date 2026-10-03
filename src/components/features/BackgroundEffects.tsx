const particles = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 4 + Math.random() * 12,
  left: `${5 + i * 5.2 + Math.random() * 4}%`,
  top: `${10 + (i % 6) * 15 + Math.random() * 8}%`,
  delay: `${i * 0.4}s`,
  duration: `${4 + (i % 4)}s`,
  color: i % 3 === 0 ? 'rgba(0,180,255,0.5)' : i % 3 === 1 ? 'rgba(100,200,255,0.4)' : 'rgba(200,240,255,0.6)',
}));

const rings = Array.from({ length: 4 }, (_, i) => ({
  id: i,
  size: 150 + i * 80,
  left: `${20 + i * 15}%`,
  top: `${30 + (i % 2) * 20}%`,
  delay: `${i * 0.7}s`,
}));

export default function BackgroundEffects() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Pure CSS gradient base — bright milky white digital */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 30%, #e8f4ff 60%, #f5fbff 100%)'
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: 'radial-gradient(ellipse at 20% 20%, rgba(0,120,255,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(0,200,255,0.07) 0%, transparent 50%), radial-gradient(ellipse at 50% 50%, rgba(150,210,255,0.05) 0%, transparent 70%)'
      }} />

      {/* Pure white milky overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/70 via-blue-50/60 to-cyan-50/70" />

      {/* Animated radial glow center */}
      <div
        className="absolute animate-pulse-glow"
        style={{
          width: '60vw', height: '60vw',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle, rgba(180,220,255,0.35) 0%, transparent 70%)',
          borderRadius: '50%',
        }}
      />

      {/* Rotating ring decoration */}
      {rings.map(r => (
        <div
          key={r.id}
          className="absolute rounded-full border border-blue-200/30 animate-rotate-slow"
          style={{
            width: r.size, height: r.size,
            left: r.left, top: r.top,
            animationDelay: r.delay,
            animationDuration: `${15 + r.id * 5}s`,
          }}
        />
      ))}

      {/* Floating light particles */}
      {particles.map(p => (
        <div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size, height: p.size,
            left: p.left, top: p.top,
            background: p.color,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
            animation: `float-particle ${p.duration} ease-in-out infinite`,
            animationDelay: p.delay,
          }}
        />
      ))}

      {/* Corner accent gradients */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gradient-to-br from-blue-200/25 to-transparent" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-cyan-200/25 to-transparent" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-blue-100/20 to-transparent" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-sky-100/20 to-transparent" />

      {/* Horizontal light streaks */}
      <div className="absolute top-[30%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-300/30 to-transparent" />
      <div className="absolute top-[60%] left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />
    </div>
  );
}
