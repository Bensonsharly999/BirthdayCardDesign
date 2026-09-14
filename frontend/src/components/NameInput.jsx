export function NameInput({ value, onChange }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">Birthday star</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        maxLength={48}
        placeholder="Enter a name"
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-display text-2xl font-bold outline-none transition placeholder:text-white/25 focus:border-fuchsia-400/70 focus:bg-white/10"
      />
    </label>
  );
}
