const colorMap: Record<string, string> = {
  violet: "var(--color-violet)",
  pink: "var(--color-pink)",
  orange: "var(--color-orange)",
  teal: "var(--color-teal)",
  blue: "var(--color-blue)",
  green: "var(--color-green)",
};

interface AvatarClusterProps {
  colors: string[];
  size?: number;
}

export function AvatarCluster({ colors, size = 18 }: AvatarClusterProps) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {colors.map((c, i) => (
        <span
          key={i}
          style={{
            width: size,
            height: size,
            borderRadius: "50%",
            background: colorMap[c] ?? "var(--color-violet)",
            border: "2px solid var(--color-panel)",
            marginLeft: i === 0 ? 0 : -size * 0.4,
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)",
          }}
        />
      ))}
    </div>
  );
}
