

export const BookCard = ({ book }) => {
    console.log(book)
    return <div>
        this is not working
        <div key={book.id}>
            {book.title}
        </div>
    </div>
}