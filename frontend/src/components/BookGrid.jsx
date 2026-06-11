import BookCard from "./BookCard";

function BookGrid({ books, onBookSelect, onAddToCart, onToggleWishlist, wishlist = [] }) {
  if (books.length === 0) {
    return <p className="empty-message">해당 카테고리에 도서가 없습니다.</p>;
  }

  return books.map((book, index) => (
    <BookCard
      book={book}
      key={book.id || book.isbn || book.title || index}
      onBookSelect={onBookSelect}
      onAddToCart={onAddToCart}
      onToggleWishlist={onToggleWishlist}
      isWished={wishlist.some(w => w.id === book.id)}
    />
  ));
}

export default BookGrid;
