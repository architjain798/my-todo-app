import { Form, useNavigation } from "@remix-run/react";
import Button from "../ui/Button";

interface AddTodoFormProps {
  errors?: {
    content?: string[];
    priority?: string[];
    _form?: string[];
  };
}

export default function AddTodoForm({ errors }: AddTodoFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting" && 
                      navigation.formData?.get("intent") === "create";

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
            className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
              errors?.content ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors?.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content[0]}</p>
          )}
        </div>
        
        <div className="flex items-center">
          <div className="w-1/3">
            <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Priority Level (1-5)
            </label>
            <input 
              type="number" 
              name="priority" 
              id="priority"
              min="1" 
              max="5"
              defaultValue="1"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white ${
                errors?.priority ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors?.priority && (
              <p className="mt-1 text-sm text-red-600">{errors.priority[0]}</p>
            )}
          </div>
          <Button 
            type="submit" 
            name="intent" 
            value="create"
            variant="primary"
            size="md"
            className="ml-4 mt-6 w-2/3"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Adding..." : "Add Task"}
          </Button>
        </div>
        
        {errors?._form && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-3 rounded-md">
            {errors._form[0]}
          </div>
        )}
      </Form>
    </div>
  );
}