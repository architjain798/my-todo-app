import { useLoaderData, Form, useFetcher } from "@remix-run/react";

import { todos } from "../../src/db/schema";

import { json, type LoaderFunction, type ActionFunction } from "@remix-run/node";
import { desc, asc, eq } from "drizzle-orm";
import { useState } from "react";
import db from "src/db";
import styles from "~/styling/todo.css?url";

export function links() {
  return [{ rel: "stylesheet", href: styles }];
}

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

  return null;
};

export default function Index() {
  const { todos } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const [order, setOrder] = useState("asc");

  const toggleOrder = () => {
    setOrder(prev => prev === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div>
      <h1>My Simple Todo App</h1>

      <Form method="post">
        <input type="text" name="content" placeholder="Todo..." required/>
        <input type="number" name="priority" min="1" defaultValue="1"/>
        <button type="submit" name="intent" value="create">Add Todo</button>
      </Form>

      <button onClick={toggleOrder}>Toggle Order ({order})</button>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>
            {todo.content} (Priority: {todo.priority}) - {todo.done ? "✅" : "❌"}
            <fetcher.Form method="post">
              <input type="hidden" name="id" value={todo.id}/>
              <button type="submit" name="intent" value="toggleDone">
                {todo.done ? "Mark Undone" : "Mark Done"}
              </button>
            </fetcher.Form>
          </li>
        ))}
      </ul>
    </div>
  );
}