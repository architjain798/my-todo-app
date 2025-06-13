import { render, screen } from '@testing-library/react';
import { describe, test, expect, vi } from 'vitest';
import TodoItem from './TodoItem';
import type { ReactNode } from 'react';

// Define types for our mocked Form component
interface FormProps {
  children: ReactNode;
  method?: string;
  // Use more specific types instead of any
  [key: string]: ReactNode | string | number | boolean | Function | undefined;
}

// Mocking @remix-run/react since we don't want to test Remix, just our component
vi.mock('@remix-run/react', () => ({
  useFetcher: () => ({
    Form: ({ children, method, ...props }: FormProps) => (
      <form method={method} {...props}>{children}</form>
    ),
    state: 'idle',
    submit: vi.fn()
  })
}));

describe('TodoItem Component', () => {
  // Sample todo for testing
  const mockTodo = {
    id: 1,
    content: 'Learn testing',
    done: false,
    priority: 2
  };
  
  test('renders todo content and status correctly', () => {
    render(<TodoItem todo={mockTodo} />);
    
    // Verify correct text content is displayed
    expect(screen.getByText('Learn testing')).toBeInTheDocument();
    
    // Verify priority is displayed
    expect(screen.getByText(/priority: 2/i)).toBeInTheDocument();
    
    // Verify pending status is shown
    expect(screen.getByText(/pending/i)).toBeInTheDocument();
    
    // Check for action buttons
    expect(screen.getByRole('button', { name: /complete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
  
  test('renders completed todos differently', () => {
    const completedTodo = {...mockTodo, done: true};
    render(<TodoItem todo={completedTodo} />);
    
    // Check for completed status
    expect(screen.getByText(/completed/i)).toBeInTheDocument();
    
    // Check that "Complete" button is replaced with "Undo"
    expect(screen.getByRole('button', { name: /undo/i })).toBeInTheDocument();
    
    // Verify content has strike-through styling
    const todoText = screen.getByText('Learn testing');
    expect(todoText).toHaveClass('line-through');
  });
});