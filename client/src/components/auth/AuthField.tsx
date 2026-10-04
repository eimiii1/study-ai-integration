type AuthFieldProps = {
  label: string;
  name: string;
  type?: string;
};

export default function AuthField({ label, name, type = "text" }: AuthFieldProps) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm text-bone/70">{label}</span>
      <input
        name={name}
        type={type}
        required
        className="bg-transparent border-0 border-b border-bone/15 pb-2.5 text-base outline-none transition focus:border-gilt"
      />
    </label>
  );
}