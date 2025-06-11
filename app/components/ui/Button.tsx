import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "success" | "warning" | "danger" | "secondary";
  size?: "sm" | "md" | "lg";
  children: React.ReactNode;
}

export default function Button({ 
  variant = "secondary", 
  size = "md", 
  children, 
  className = "", 
  ...props 
}: ButtonProps) {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all";
  
  const variants = {
    primary: "bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500 border border-transparent",
    success: "bg-green-100 hover:bg-green-200 text-green-700 focus:ring-green-500 border border-transparent dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300",
    warning: "bg-yellow-100 hover:bg-yellow-200 text-yellow-700 focus:ring-yellow-500 border border-transparent dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50 dark:text-yellow-300",
    danger: "bg-red-100 hover:bg-red-200 text-red-700 focus:ring-red-500 border border-transparent dark:bg-red-900/30 dark:hover:bg-red-900/50 dark:text-red-300",
    secondary: "bg-white hover:bg-gray-50 text-gray-700 focus:ring-indigo-500 border border-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-300 dark:border-gray-600"
  };
  
  const sizes = {
    sm: "py-1.5 px-3 text-xs",
    md: "py-2 px-4 text-sm",
    lg: "py-2.5 px-5 text-base"
  };
  
  const classes = `${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`;
  
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}