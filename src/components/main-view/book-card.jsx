

export const BookCard = ({book, onBookClick}) => {
    return <div>
        <div
            key={book.id}
            onClick={() => {
                onBookClick(book)
            }}
        >
            {book.title}
        </div>
    </div>
}