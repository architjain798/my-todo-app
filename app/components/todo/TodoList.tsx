// -todo-app/app/components/todo/TodoList.tsx
import type { Todo } from "../../types/todo";
import TodoItem from "./TodoItem";
import EmptyState from "./EmptyState";

interface TodoListProps {
  todos: Todo[];
}

export default function TodoList({ todos }: TodoListProps) {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
      {todos.length === 0 ? (
        <EmptyState />
      ) : (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} />
          ))}
        </ul>
      )}
    </div>
  );
}