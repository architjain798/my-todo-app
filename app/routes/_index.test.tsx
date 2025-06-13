import { describe, test, expect, vi, beforeEach } from 'vitest';
import { json } from '@remix-run/node';
import { loader, action } from './_index';
import * as todosServer from '../lib/todos.server';

// Mock the todos.server module
vi.mock('../lib/todos.server', async (importOriginal) => {
  const actual = await importOriginal<typeof todosServer>();
  return {
    ...actual,
    getAllTodos: vi.fn(),
    createTodo: vi.fn(),
    toggleTodoDone: vi.fn(),
    deleteTodo: vi.fn(),
  };
});

const mockedGetAllTodos = vi.mocked(todosServer.getAllTodos);
const mockedCreateTodo = vi.mocked(todosServer.createTodo);
const mockedToggleTodoDone = vi.mocked(todosServer.toggleTodoDone);
const mockedDeleteTodo = vi.mocked(todosServer.deleteTodo);

describe('Index Route (_index.tsx)', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('loader', () => {
    test('should return todos with default sort order (asc)', async () => {
      const mockTodos = [{ id: 1, content: 'Test Todo', done: false, priority: 1 }];
      mockedGetAllTodos.mockResolvedValue(mockTodos);

      const request = new Request('http://localhost:5173/');
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json(); // loader always returns Response

      expect(response.status).toBe(200);
      expect(mockedGetAllTodos).toHaveBeenCalledWith('asc');
      expect(data.todos).toEqual(mockTodos);
    });

    test('should return todos with specified sort order (desc)', async () => {
      const mockTodos = [{ id: 1, content: 'Test Todo', done: false, priority: 1 }];
      mockedGetAllTodos.mockResolvedValue(mockTodos);

      const request = new Request('http://localhost:5173/?order=desc');
      const response = await loader({ request, params: {}, context: {} });
      const data = await response.json(); // loader always returns Response

      expect(response.status).toBe(200);
      expect(mockedGetAllTodos).toHaveBeenCalledWith('desc');
      expect(data.todos).toEqual(mockTodos);
    });
  });

  describe('action', () => {
    describe('intent: create', () => {
      test('should create a new todo and return success', async () => {
        const formData = new FormData();
        formData.append('intent', 'create');
        formData.append('content', 'New Awesome Todo');
        formData.append('priority', '2');

        mockedCreateTodo.mockResolvedValue(undefined);

        const request = new Request('http://localhost:5173/', {
          method: 'POST',
          body: formData,
        });

        const response = await action({ request, params: {}, context: {} });
        
        expect(response).not.toBeNull(); // Assert response is not null
        const data = await response!.json(); // Use non-null assertion

        expect(mockedCreateTodo).toHaveBeenCalledWith('New Awesome Todo', 2);
        expect(response!.status).toBe(200); // Use non-null assertion
        expect(data.success).toBe(true);
      });

      test('should return validation errors if content is missing', async () => {
        const formData = new FormData();
        formData.append('intent', 'create');
        formData.append('priority', '1');

        const request = new Request('http://localhost:5173/', {
          method: 'POST',
          body: formData,
        });

        const response = await action({ request, params: {}, context: {} });

        expect(response).not.toBeNull(); // Assert response is not null
        const data = await response!.json(); // Use non-null assertion

        expect(mockedCreateTodo).not.toHaveBeenCalled();
        expect(response!.status).toBe(400); // Use non-null assertion
        expect(data.success).toBe(false);
        expect(data.errors.content).toBeDefined();
      });

       test('should return validation errors if priority is invalid', async () => {
        const formData = new FormData();
        formData.append('intent', 'create');
        formData.append('content', 'Valid Content');
        formData.append('priority', '10'); // Invalid priority

        const request = new Request('http://localhost:5173/', {
          method: 'POST',
          body: formData,
        });

        const response = await action({ request, params: {}, context: {} });
        
        expect(response).not.toBeNull(); // Assert response is not null
        const data = await response!.json(); // Use non-null assertion

        expect(mockedCreateTodo).not.toHaveBeenCalled();
        expect(response!.status).toBe(400); // Use non-null assertion
        expect(data.success).toBe(false);
        expect(data.errors.priority).toBeDefined();
      });
    });

    describe('intent: toggleDone', () => {
      test('should toggle todo done status', async () => {
        const formData = new FormData();
        formData.append('intent', 'toggleDone');
        formData.append('id', '123');

        mockedToggleTodoDone.mockResolvedValue(undefined);

        const request = new Request('http://localhost:5173/', {
          method: 'POST',
          body: formData,
        });

        const response = await action({ request, params: {}, context: {} });
        
        expect(mockedToggleTodoDone).toHaveBeenCalledWith(123);
        expect(response).toBeNull(); 
      });
    });

    describe('intent: delete', () => {
      test('should delete a todo', async () => {
        const formData = new FormData();
        formData.append('intent', 'delete');
        formData.append('id', '456');

        mockedDeleteTodo.mockResolvedValue(undefined);

        const request = new Request('http://localhost:5173/', {
          method: 'POST',
          body: formData,
        });

        const response = await action({ request, params: {}, context: {} });

        expect(mockedDeleteTodo).toHaveBeenCalledWith(456);
        expect(response).toBeNull(); 
      });
    });

    test('should return null for unknown intent', async () => {
      const formData = new FormData();
      formData.append('intent', 'unknown_intent');

      const request = new Request('http://localhost:5173/', {
        method: 'POST',
        body: formData,
      });

      const response = await action({ request, params: {}, context: {} });
      expect(response).toBeNull();
    });
  });
});