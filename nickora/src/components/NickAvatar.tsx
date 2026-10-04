// Placeholder doodle portrait for Nick. Swap for a real photo later.
export default function NickAvatar({ size = 40 }: { size?: number }) {
  return (
    <span className="relative inline-block shrink-0" style={{ width: size, height: size }}>
      <svg viewBox="0 0 40 40" width={size} height={size} className="rounded-full bg-blue-soft" aria-hidden>
        <path d="M8 40 C9 31 14 27 20 27 C26 27 31 31 32 40 Z" fill="#2a3ad1" />
        <circle cx="20" cy="18" r="8.5" fill="#fff" stroke="#111318" strokeWidth="1.4" />
        <path d="M11.6 17 C11 10 16 7.5 20 8.5 C25 7.6 29.5 11 28.4 16.6 C26 13.6 22.6 12.6 19.6 13.6 C16.6 12.4 13.4 14 11.6 17 Z" fill="#111318" />
        <circle cx="16.8" cy="18.6" r="2.4" fill="none" stroke="#111318" strokeWidth="1" />
        <circle cx="23.2" cy="18.6" r="2.4" fill="none" stroke="#111318" strokeWidth="1" />
        <path d="M19.2 18.6 h1.6" stroke="#111318" strokeWidth="1" />
        <path d="M17.6 22.6 q2.4 2 4.8 0" fill="none" stroke="#111318" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-paper bg-emerald-500">
        <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
      </span>
    </span>
  );
}
