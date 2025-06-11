import { todos } from "../../src/db/schema";
import { eq, desc, asc } from "drizzle-orm";
import db from "../../src/db";
import type { Todo } from "../types/todo";

export async function getAllTodos(sortOrder: "asc" | "desc" = "asc") {
  const order = sortOrder === "desc" ? desc(todos.priority) : asc(todos.priority);
  return db.select().from(todos).orderBy(order);
}

export async function createTodo(content: string, priority: number) {
  await db.insert(todos).values({
    content,
    priority,
  });
}

export async function toggleTodoDone(id: number) {
  const currentTodo = await db.select().from(todos).where(eq(todos.id, id));
  await db.update(todos).set({ done: !currentTodo[0].done }).where(eq(todos.id, id));
}

export async function deleteTodo(id: number) {
  await db.delete(todos).where(eq(todos.id, id));
}