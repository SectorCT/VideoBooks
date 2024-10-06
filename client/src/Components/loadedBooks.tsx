import { useEffect, useState } from "react";
import "./loadedBooks.css";
export default function LoadedBooks() {

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
        },
        {
            title: "The Adventures of Sherlock Holmes",
            imageUrl: "https://images.penguinrandomhouse.com/cover/9780553213508",
            rating: 4.3,
        },
        {
            title: "The Count of monte cristo",
            imageUrl: "https://images.penguinrandomhouse.com/cover/9780553213508",
            rating: 4.5,
        },
        {
            title: "The Adventures of Sherlock Holmes",
            imageUrl: "https://images.penguinrandomhouse.com/cover/9780553213508",
            rating: 4.3,
        },
    ];

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