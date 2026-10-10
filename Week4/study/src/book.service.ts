
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Book } from './books/entities/book.entity';
import { Category } from './categories/entities/category.entity';
import { CreateBookDto } from './books/dto/create-book.dto';
import { BookResponseDto } from './books/dto/book-response.dto';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,

    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // GET /books - 모든 도서를 최신 등록순으로 조회
async getAllBooks(): Promise<BookResponseDto[]> {
  const books = await this.bookRepository.find({
    relations: {
      category: true,
    },
    order: {
      bookId: 'DESC',
    },
  });

  return books.map((book) => BookResponseDto.from(book));
}

  // POST /books - 도서 등록
  async createBook(
    dto: CreateBookDto,
  ): Promise<BookResponseDto> {
    //1. 카테고리 존재 여부 확인
    const category = await this.categoryRepository.findOneBy({
      categoryId: String(dto.categoryId),
    });

    if (!category) {
      throw new NotFoundException('카테고리를 찾을 수 없습니다.');
    }
    //2. 도서 생성
    const book = this.bookRepository.create({
      title: dto.title,
      description: dto.description ?? null,
      isAvailable: true,
      category,
    });
      //3. MYSQL에 저장
    const savedBook = await this.bookRepository.save(book);

    //4. 저장된 책을 카테고리 관계와 함께 다시 조회
    const result = await this.bookRepository.findOne({
      where: { bookId: savedBook.bookId },
      relations: { category: true },
    });

    if (!result) {
      throw new NotFoundException('저장된 도서를 찾을 수 없습니다.');
    }
    //5. BookResponseDto로 변환하여 반환
    return BookResponseDto.from(result);
  }

  // GET /books/category/:categoryId
  async getBooksByCategory(
    categoryId: number,
  ): Promise<BookResponseDto[]> {
    const books = await this.bookRepository.find({
      where: {
        category: {
          categoryId: String(categoryId),
        },
      },
      relations: {
        category: true,
      },
    });

    return books.map((book) => BookResponseDto.from(book));
  }
}