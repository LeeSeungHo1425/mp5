package com.aivle.bookapp.controller;

import com.aivle.bookapp.entity.Book;
import com.aivle.bookapp.service.BookService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/books")
@CrossOrigin(origins = "*")
public class BookController {

    private final BookService bookService;

    // 생성자 주입
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    // GET /books
    @GetMapping
    public List<Book> getBooks() {
        return bookService.findAllBooks();
    }

    // GET /books/{id}
    @GetMapping("/{id}")
    public Book getBook(@PathVariable Long id) {
        return bookService.findBookById(id);
    }
}