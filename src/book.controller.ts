import { Controller, Get } from '@nestjs/common';
import { BookService } from './book.service.js';
import { Body, Post } from '@nestjs/common';
import { Param } from '@nestjs/common'; // Param 추가


@Controller('books')
export class BookController {
    constructor(private readonly bookService: BookService) { }

    @Get()
    async getBooks(): Promise<any> {
        return await this.bookService.getAllBooks();
    }

    @Post()
    async createBook(@Body() body: Record<string, any>): Promise<string> {
        return await this.bookService.createBook(body);
    }

    @Get('category/:categoryId')
    async getBooksByCategory(@Param('categoryId') categoryId: string): Promise<any> {
        return await this.bookService.getBooksByCategory(categoryId);
    }
}