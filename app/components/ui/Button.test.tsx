import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, test, expect,vi } from 'vitest';
import Button from './Button';

describe('Button Component', () => {
  // Test 1: Button renders correctly with text
  test('renders with the correct text', () => {
    render(<Button>Click me</Button>);
    
    // This looks for a button with text "Click me"
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  // Test 2: Button can be disabled
  test('can be disabled', () => {
    render(<Button disabled>Click me</Button>);
    
    // Check if the button is disabled
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
  });

  // Test 3: Button calls onClick when clicked
  test('calls onClick handler when clicked', async () => {
    // Create a mock function to track if it gets called
    const handleClick = vi.fn();
    
    render(<Button onClick={handleClick}>Click me</Button>);
    
    // Simulate a user clicking the button
    const button = screen.getByRole('button');
    await userEvent.click(button);
    
    // Verify the function was called exactly once
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});