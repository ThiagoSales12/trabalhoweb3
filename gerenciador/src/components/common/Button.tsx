
export function Button({ onClick, children, variant = 'primary', className = '', disabled = false, type = 'button' }: { onClick?: () => void, children: React.ReactNode, variant?: 'primary' | 'danger' | 'secondary', className?: string, disabled?: boolean, type?: 'button' | 'submit' | 'reset' }) {
  const baseClasses = "px-4 py-2 rounded-md font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  const variantClasses = {
    primary: 'bg-indigo-600 text-white hover:bg-indigo-500',
    danger: 'bg-red-600 text-white hover:bg-red-500',
    secondary: 'bg-gray-600 text-white hover:bg-gray-500',
  };
  return <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses[variant]} ${className}`} disabled={disabled}>{children}</button>;
}