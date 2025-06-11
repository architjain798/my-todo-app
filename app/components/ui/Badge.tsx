import React from "react";

interface BadgeProps {
  variant?: "blue" | "green" | "yellow" | "red" | "gray";
  children: React.ReactNode;
  className?: string;
}

export default function Badge({ variant = "blue", children, className = "" }: BadgeProps) {
  const variants = {
    blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
    green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
    yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
    red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
    gray: "bg-gray-100 text-gray-800 dark:bg-gray-800/50 dark:text-gray-300"
  };
  
  const classes = `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`;
  
  return <span className={classes}>{children}</span>;
}