import greetingBg from '../../assets/greeting-bg.mp4';

export function AppBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <video
        autoPlay
        muted
        loop
        playsInline
        src={greetingBg}
        className="h-full w-full object-cover"
      />
    </div>
  );
}
