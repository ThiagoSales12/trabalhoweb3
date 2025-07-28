
export function Card({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={`bg-gray-800 rounded-lg shadow-md p-5 ${className}`}>{children}</div>;
}