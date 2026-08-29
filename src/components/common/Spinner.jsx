function Spinner({ size = "sm" }) {
  const sizeClasses = size === "sm" ? "w-4 h-4" : "w-8 h-8";
  return (
    <div
      className={`${sizeClasses} border-2 border-white/40 border-t-white rounded-full animate-spin`}
    />
  );
}

export default Spinner;
