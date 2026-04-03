import { cn } from "../../lib/utils.js"; // adjust path if needed

export default function Button({ children, className, ...props }) {
  return (
    <button
      className={cn(
        "relative overflow-hidden px-6 py-3 rounded-lg font-medium",
        "bg-blue-200 text-blue-800",        // Light blue background + darker text
        "hover:bg-blue-300 hover:shadow-lg", // Lighter blue on hover
        "transition-colors duration-300",
        "group",
        className
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <div
        className={cn(
          "absolute inset-0 -translate-x-full",
          "bg-linear-to-r from-transparent via-white/20 to-transparent",
          "group-hover:translate-x-full transition-transform duration-700"
        )}
      />
    </button>
  );
}