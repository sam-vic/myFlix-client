import React, { useState, useEffect } from "react"
import { BookCard } from "./book-card"
import { BookView } from "../book-view/book-view"

import booksData from "./books.json"

{/*
fetch('../../json/books.json')
.then((response) => response.json())
.then((data) => {data})

console.log(data) */}

export const MainView = () => {
    const [books, setBooks] = useState([])
    const [selectedBook, setSelectedBooks] = useState(null)

    useEffect(() => {
        setBooks(booksData)
    }, [])

    if (selectedBook) {
        return <BookView book={selectedBook} onBackClick={() => setSelectedBooks(null)}/>
    }

    if (books.length === 0) {
        return <div>The list is empty!</div>;
    }

    return (
        <div>
            {books.map((book) => {
                return (
                    <BookCard 
                    className='my-flix' 
                    book={book}
                    key={book.id}
                    onBookClick={(newSelectedBook) => {
                        setSelectedBooks(newSelectedBook)
                    }}
                    />
                )
            })}
        </div>
    )
}
