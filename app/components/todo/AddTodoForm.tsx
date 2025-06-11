import { Form } from "@remix-run/react";
import Button from "../ui/Button";

export default function AddTodoForm() {
  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8 p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Task</h2>
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Task Description
          </label>
          <input 
            type="text" 
            name="content" 
            id="content"
            placeholder="What needs to be done?" 
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
        </div>
        
        <div className="flex items-center">
          <div className="w-1/3">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority Level
            </label>
            <input 
              type="number" 
              name="priority" 
              id="priority"
              min="1" 
              defaultValue="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <Button 
            type="submit" 
            name="intent" 
            value="create"
            variant="primary"
            size="md"
            className="ml-4 mt-6 w-2/3"
          >
            Add Task
          </Button>
        </div>
      </Form>
    </div>
  );
}