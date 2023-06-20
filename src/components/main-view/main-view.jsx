import { useState } from "react"
import { BookCard } from "./book-card"

export const MainView = () => {
    const [books, setBooks] = useState([
        { id: 1, title: "Eloquent JavaScript" },
        { id: 2, title: "Mastering JavaScript Functional Programming" },
        { id: 3, title: "JavaScript: The Good Parts" },
        { id: 4, title: "JavaScript: The Definitive Guide" },
        { id: 5, title: "The Road to React" }
    ])

    if (books.length === 0) {
        return <div>The list is empty!</div>
    }
    return (
        <div>
            {books.map((book) => {
                <div key={book.id}>
                    {book.title}
                </div>
            })}
        </div>
    )
}