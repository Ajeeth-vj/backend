import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { Todo } from './entities/todo.entity';
import { CreateTodoDTO } from './dto/todo.dto';

const pubSub = new PubSub();

@Resolver()
export class TodoResolver {
  todos = [];

  @Query(() => [Todo])
  getTodos() {
    return this.todos;
  }

  @Mutation(() => Todo)
  createTodo(@Args('input') input: CreateTodoDTO) {
    const todo = {
      id: Date.now().toString(),
      title: input.title,
      completed: false,
    };
    this.todos.push(todo);
    pubSub.publish('todoCreated', { todoCreated: todo });
    return todo;
  }

  @Mutation(() => Todo)
  toggleTodoCompleted(@Args('id') id: string) {
    const todo = this.todos.find((todo) => todo.id === id);
    todo.completed = !todo.completed;
    pubSub.publish('todoCompleted', { todoCompleted: todo });
    return todo;
  }

  @Subscription(() => Todo)
  todoCreated() {
    return pubSub.asyncIterator('todoCreated');
  }

  @Subscription(() => Todo)
  todoCompleted() {
    return pubSub.asyncIterator('todoCompleted');
  }
}
