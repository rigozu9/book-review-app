import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm';
import LoginForm from './components/LoginForm';
import SearchBook from './components/SearchBook';
import BookDetail from './components/BookDetail';

function App() {
  return (
    <Router>
      <div className="container">
        <h1>Book Review App</h1>
        <Routes>
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/search" element={<SearchBook />} />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="/" element={<Navigate to="/register" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
