export default function TextArea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          bg-white transition-all resize-none placeholder:text-slate-400"
      />
    </div>
  );
}
