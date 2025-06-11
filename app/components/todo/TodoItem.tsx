import { useFetcher } from "@remix-run/react";
import type { Todo } from "../../types/todo";
import Button from "../ui/Button";
import Badge from "../ui/Badge";

interface TodoItemProps {
  todo: Todo;
}

export default function TodoItem({ todo }: TodoItemProps) {
  const fetcher = useFetcher();
  
  return (
    <li 
      className={`px-6 py-4 ${todo.done ? 'bg-gray-50 dark:bg-gray-700/50' : ''} 
                 transition-all hover:bg-gray-50 dark:hover:bg-gray-700/70`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-start space-x-4">
          <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mt-1 ${
            todo.done ? 'bg-green-100 dark:bg-green-900/20' : 'bg-blue-100 dark:bg-blue-900/20'
          }`}>
            {todo.done ? (
              <svg className="h-4 w-4 text-green-500 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            ) : (
              <span className="h-4 w-4 rounded-full bg-white dark:bg-gray-700 border border-blue-500 dark:border-blue-400"></span>
            )}
          </div>
          <div>
            <p className={`text-base font-medium ${
              todo.done ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-white'
            }`}>
              {todo.content}
            </p>
            <div className="mt-1.5 flex items-center">
              <Badge variant="blue">
                Priority: {todo.priority}
              </Badge>
              <Badge variant={todo.done ? "green" : "yellow"} className="ml-2.5">
                {todo.done ? 'Completed' : 'Pending'}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          <fetcher.Form method="post">
            <input type="hidden" name="id" value={todo.id}/>
            <Button 
              type="submit" 
              name="intent" 
              value="toggleDone"
              variant={todo.done ? "warning" : "success"}
              size="sm"
            >
              {todo.done ? 'Undo' : 'Complete'}
            </Button>
          </fetcher.Form>
          <fetcher.Form method="post">
            <input type="hidden" name="id" value={todo.id}/>
            <Button 
              type="submit" 
              name="intent" 
              value="delete"
              variant="danger"
              size="sm"
            >
              Delete
            </Button>
          </fetcher.Form>
        </div>
      </div>
    </li>
  );
}