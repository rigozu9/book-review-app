import { useEffect, useState } from 'react';
import { debounce } from 'lodash';
import { useNavigate } from 'react-router-dom';
import BooksList from './BooksList';

const SearchBook = () => {
    const [books, setBooks] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [cache, setCache] = useState({});
    const navigate = useNavigate();

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

    const goToUserPage = () => {
        const userId = localStorage.getItem('userId');
        console.log('User ID:', userId); // Debugging line
        if (userId) {
            navigate(`/userpage/${userId}`);
        } else {
            console.error('User ID not found in localStorage');
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
            <button onClick={goToUserPage}>Go to My Page</button>
            {loading ? <div>Loading...</div> : <BooksList books={books} />}
        </>
    );
};

export default SearchBook;
