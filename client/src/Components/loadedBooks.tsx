import { useEffect, useState } from "react";
import { Transcription } from "../types";

import "./loadedBooks.css";
export default function LoadedBooks( {setTranscription} : {setTranscription : (transcription: Transcription | null) => void} ) {

    const [isDesktop, setIsDesktop] = useState<boolean>(window.innerWidth > 800); // Track if it's desktop

    useEffect(() => {
        const handleResize = () => setIsDesktop(window.innerWidth > 800);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
      }, []);

    const books = [
        {
            title: "The Count of monte cristo",
            imageUrl: "https://images.penguinrandomhouse.com/cover/9780553213508",
            rating: 4.5,
            serverId: "countofmontecristo_001_dumas"
        },
        {
            title: "The Three Musketeers",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1676445252i/120415558.jpg",
            rating: 4.3,
            serverId: "three_musketeers_01_dumas.mp3"
        },
        {
            title: "Puss in boots",
            imageUrl: "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1594075747i/6043903.jpg",
            rating: 4.5,
            serverId: "pussinbootsjrtomthumb_01_cory_128kb.mp3"
        },
        {
            title: "The Adventures of Sherlock Holmes",
            imageUrl: "https://images.booksense.com/images/972/545/9798629545972.jpg",
            rating: 4.3,
            serverId: "adventureholmes_03_doyle.mp3"
        },
    ];

    async function openBook(book: any) {
        console.log("Opening book", book);

        let result = fetch(`http://localhost:5000/get_book_transcription/${book.serverId}`)
        let transcription = await result.then((response) => response.json());
        console.log(transcription);
        setTranscription(transcription);
    }

    return (<>
        {isDesktop ?(
        <div className="books">
            <h2>Choose from our great collection!</h2>
            {books.map((book, i) => (
                <button key={i} className="book">
                    <img src={book.imageUrl} alt={book.title} />
                    <div className="data">
                        <h3>{book.title}</h3>
                        <h5>{book.rating} ⭐</h5>
                    </div>
                </button>
            ))}
        </div>
        ) : (<>
            <div className="books">
            <h2>Choose from our great collection!</h2>
            {books.map((book, i) => (
                <button key={i} className="book">
                    <img src={book.imageUrl} alt={book.title} />
                    <div className="data">
                        <h3>{book.title}</h3>
                        <h5>{book.rating} ⭐</h5>
                    </div>
                </button>
            ))}
            </div>
            </>
        )
        }
    </>);
}