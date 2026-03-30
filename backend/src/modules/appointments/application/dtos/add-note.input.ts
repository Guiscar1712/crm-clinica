import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class AddNoteInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(2000)
  content: string;
}
