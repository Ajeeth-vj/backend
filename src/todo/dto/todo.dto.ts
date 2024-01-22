import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class CreateTodoDTO {
  @Field()
  @IsNotEmpty()
  @IsString()
  title: string;
}
