type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
};

export default function AuthField({ label, name, type = "text" }: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-muted">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="rounded-lg border border-line bg-paper px-3.5 py-2.5 text-sm outline-none transition focus:border-ink"
      />
    </label>
  );
}