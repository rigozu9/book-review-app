import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import BooksList from './BooksList';

const SearchBook = () => {
    const [books, setBooks] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState({});

    const debouncedGetBooks = debounce(() => {
        getBooks();
    }, 500);

    useEffect(() => {
        if (input) {
            if (cache[input]) {
                setBooks(cache[input]);
            } else {
                debouncedGetBooks();
            }
        }
    }, [input, debouncedGetBooks, cache]);

    const getBooks = async () => {
        setLoading(true);
        const res = await fetch(`http://localhost:3000/api/books?q=${input}`);
        const data = await res.json();
        setLoading(false);
        if (data) {
            setBooks(data);
            setCache(prevCache => ({ ...prevCache, [input]: data }));
        }
    };

    return (
        <>
            <div className="input-container">
                <input 
                    className="search-bar"
                    type="text" 
                    value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    placeholder="Search..." 
                    autoFocus 
                />
            </div>
            {loading ? <div>Loading...</div> : <BooksList books={books} />}
        </>
    );
};

export default SearchBook;
