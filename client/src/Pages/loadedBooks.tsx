import "./loadedBooks.css";


export default function LoadedBooks() {

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
    </>);
}