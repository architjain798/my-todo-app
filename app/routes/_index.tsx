import { useLoaderData, useSearchParams, useActionData } from "@remix-run/react";
import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { getAllTodos, createTodo, toggleTodoDone, deleteTodo, TodoSchema } from "../lib/todos.server";
import AddTodoForm from "../components/todo/AddTodoForm";
import TodoList from "../components/todo/TodoList";
import SortControl from "../components/todo/SortControl";
import type { Todo } from "../types/todo";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const order = url.searchParams.get("order") || "asc";

  const allTodos = await getAllTodos(order as "asc" | "desc");
  return json({ todos: allTodos });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "create") {
    const result = TodoSchema.safeParse({
      content: formData.get('content'),
      priority: formData.get('priority'),
    });

    if (result.success) {
      await createTodo(
        result.data.content,
        result.data.priority
      );
      return json({ success: true });
    } else {
      return json(
        { errors: result.error.formErrors.fieldErrors, success: false },
        { status: 400 }
      );
    }
  }

  if (intent === "toggleDone") {
    const id = parseInt(formData.get('id') as string);
    await toggleTodoDone(id);
  }

  if (intent === "delete") {
    const id = parseInt(formData.get('id') as string);
    await deleteTodo(id);
  }

  return null;
};

export default function Index() {
  const { todos } = useLoaderData<{ todos: Todo[] }>();
  const [searchParams] = useSearchParams();
  const currentOrder = searchParams.get("order") || "asc";
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              To Do App
            </span>
          </h1>
        </div>

        {/* Add Todo Form */}
        <AddTodoForm errors={actionData?.errors} />

        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
          <SortControl currentOrder={currentOrder} />
        </div>

        {/* Todo List */}
        <TodoList todos={todos} />
      </div>
    </div>
  );
}