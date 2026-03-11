export default function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="mb-3">
      {label && (
        <label className="block text-xs font-semibold text-slate-600 mb-1 uppercase tracking-wide">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
          focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent
          bg-white transition-all placeholder:text-slate-400"
      />
    </div>
  );
}
