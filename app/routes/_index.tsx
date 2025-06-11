import { useLoaderData, Form, useFetcher, useNavigate, useSearchParams } from "@remix-run/react";
import { todos } from "../../src/db/schema";
import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { desc, asc, eq } from "drizzle-orm";
import { useEffect } from "react";
import db from "src/db";

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const order = url.searchParams.get("order") === "desc" ? desc(todos.priority) : asc(todos.priority);

  const allTodos = await db.select().from(todos).orderBy(order);
  return json({ todos: allTodos });
};

interface Todo {
  id: number;
  content: string;
  done: boolean;
  priority: number;
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if(intent === "create"){
    await db.insert(todos).values({
      content: formData.get('content') as string,
      priority: parseInt(formData.get('priority') as string),
    });
  }

  if(intent === "toggleDone"){
    const id = parseInt(formData.get('id') as string);
    const currentTodo = await db.select().from(todos).where(eq(todos.id, id));
    await db.update(todos).set({done: !currentTodo[0].done}).where(eq(todos.id, id));
  }

  if(intent === "delete"){
    const id = parseInt(formData.get('id') as string);
    await db.delete(todos).where(eq(todos.id, id));
  }

  return null;
};

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Get the order from URL search params instead of local state
  const currentOrder = searchParams.get("order") || "asc";

  const toggleOrder = () => {
    const newOrder = currentOrder === "asc" ? "desc" : "asc";
    navigate(`?order=${newOrder}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-600">
              Task Master
            </span>
          </h1>
          <p className="mt-3 text-base text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Organize your tasks efficiently with our modern todo application.
          </p>
        </div>

        {/* Add Todo Form */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg mb-8 p-6">
          <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Create New Task</h2>
          <Form method="post" className="space-y-4">
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Task Description</label>
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
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Priority Level</label>
                <input 
                  type="number" 
                  name="priority" 
                  id="priority"
                  min="1" 
                  defaultValue="1"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <button 
                type="submit" 
                name="intent" 
                value="create"
                className="ml-4 mt-6 w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
              >
                Add Task
              </button>
            </div>
          </Form>
        </div>
        
        {/* Controls */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your Tasks</h2>
          <button 
            onClick={toggleOrder}
            className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 mr-2 ${currentOrder === 'asc' ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            Sort by Priority {currentOrder === 'asc' ? '(Low to High)' : '(High to Low)'}
          </button>
        </div>
        
        {/* Todo List */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg overflow-hidden">
          {todos.length === 0 ? (
            <div className="p-8 text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-4 text-gray-500 dark:text-gray-400">No tasks yet. Add one to get started!</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
              {todos.map((todo: Todo) => (
                <li key={todo.id} className={`px-6 py-4 ${todo.done ? 'bg-gray-50 dark:bg-gray-700/50' : ''} transition-all hover:bg-gray-50 dark:hover:bg-gray-700/70`}>
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
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            Priority: {todo.priority}
                          </span>
                          <span className={`ml-2.5 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            todo.done 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                          }`}>
                            {todo.done ? 'Completed' : 'Pending'}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <fetcher.Form method="post">
                        <input type="hidden" name="id" value={todo.id}/>
                        <button 
                          type="submit" 
                          name="intent" 
                          value="toggleDone"
                          className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md ${
                            todo.done 
                              ? 'text-yellow-700 bg-yellow-100 hover:bg-yellow-200 dark:text-yellow-300 dark:bg-yellow-900/30 dark:hover:bg-yellow-900/50' 
                              : 'text-green-700 bg-green-100 hover:bg-green-200 dark:text-green-300 dark:bg-green-900/30 dark:hover:bg-green-900/50'
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all`}
                        >
                          {todo.done ? 'Undo' : 'Complete'}
                        </button>
                      </fetcher.Form>
                      <fetcher.Form method="post">
                        <input type="hidden" name="id" value={todo.id}/>
                        <button 
                          type="submit" 
                          name="intent" 
                          value="delete"
                          className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 dark:text-red-300 dark:bg-red-900/30 dark:hover:bg-red-900/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all"
                        >
                          Delete
                        </button>
                      </fetcher.Form>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}