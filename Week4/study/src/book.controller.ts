
 // src/book.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { BookService } from './book.service';
import { CreateBookDto } from './books/dto/create-book.dto';
import { BookResponseDto } from './books/dto/book-response.dto';

@Controller('books')
export class BookController {
  constructor(private readonly bookService: BookService) {}

  // GET /books - 전체 도서 조회
  @Get()
  async getBooks(): Promise<any> {
    return await this.bookService.getAllBooks();
  }

  // POST /books - 도서 등록
  @Post()
  async createBook(
    @Body() body: CreateBookDto,
  ): Promise<BookResponseDto> {
    return await this.bookService.createBook(body);
  }

  // GET /books/category/:categoryId - 카테고리별 조회
  @Get('category/:categoryId')
  async getBooksByCategory(
    @Param('categoryId') categoryId: string,
  ): Promise<any[]> {
    return await this.bookService.getBooksByCategory(
      Number(categoryId),
    );
  }
}