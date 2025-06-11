// /developer/practice/my-todo-app/app/components/todo/SortControl.tsx
import { useNavigate } from "@remix-run/react";
import Button from "../ui/Button";

interface SortControlProps {
  currentOrder: string;
}

export default function SortControl({ currentOrder }: SortControlProps) {
  const navigate = useNavigate();

  const toggleOrder = () => {
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    navigate(`?order=${newOrder}`);
  };

  return (
    <Button 
      onClick={toggleOrder}
      variant="secondary"
      size="md"
      className="flex items-center"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className={`h-4 w-4 mr-2 ${currentOrder === 'asc' ? 'transform rotate-180' : ''}`} 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
      </svg>
      Sort by Priority {currentOrder === 'asc' ? '(Low to High)' : '(High to Low)'}
    </Button>
  );
}