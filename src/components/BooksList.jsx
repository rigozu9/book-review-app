const BooksList = ({ books }) => {
    return (
        <div className="books">
            {books.map((book) => {
                const imageLinks = book.volumeInfo.imageLinks;
                const imageUrl = imageLinks?.thumbnail || imageLinks?.smallThumbnail;

                return (
                    <div key={book.id} className="book-container">
                        {imageUrl && 
                        <img className="book" src={imageUrl} alt="book cover" />}
                        <div className="overlay">
                            {book.volumeInfo.title}
                            <p>By: {book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : "Anon"}</p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default BooksList;
