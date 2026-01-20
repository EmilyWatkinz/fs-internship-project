import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ForYou() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(savedUser));

    // Fetch books from API
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
      );
      const data = await response.json();
      
      if (data && data.length > 0) {
        setSelectedBook(data[0]);
        setRecommendedBooks(data.slice(1, 7)); // Get next 6 books for recommendations
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>For You - Summarist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="nav nav--for-you">
        <div className="nav__wrapper--for-you">
          <figure className="nav__img--mask">
            <img className="nav__img" src="/assets/logo.png" alt="logo" />
          </figure>
          <div className="search__wrapper search__wrapper--right">
            <input
              type="text"
              placeholder="Search for books..."
              className="search__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg className="search__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
      </nav>

      <div className="page__layout">
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar__top">
            <div className="sidebar__item sidebar__item--active">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="sidebar__text">For you</span>
            </div>
            <div className="sidebar__item">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
              <span className="sidebar__text">My Library</span>
            </div>
            <div className="sidebar__item">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              <span className="sidebar__text">Highlights</span>
            </div>
            <div className="sidebar__item">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="sidebar__text">Search</span>
            </div>
          </div>

          <div className="sidebar__bottom">
            <div className="sidebar__item">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M12 1v6m0 6v6"></path>
                <path d="m4.93 4.93 4.24 4.24m5.66 5.66 4.24 4.24"></path>
                <path d="M1 12h6m6 0h6"></path>
                <path d="m4.93 19.07 4.24-4.24m5.66-5.66 4.24-4.24"></path>
              </svg>
              <span className="sidebar__text">Settings</span>
            </div>
            <div className="sidebar__item">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <path d="M12 17h.01"></path>
              </svg>
              <span className="sidebar__text">Help & Support</span>
            </div>
            <div className="sidebar__item" onClick={handleLogout}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" x2="9" y1="12" y2="12"></line>
              </svg>
              <span className="sidebar__text">Logout</span>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="main__content">
          <div className="container">
            <div className="row">
              <div className="for-you__wrapper">
                {/* Selected Book Section */}
                <section className="selected-book">
                  <h2 className="selected-book__title">Selected just for you</h2>
                  {selectedBook && (
                <div className="selected-book__card">
                  <div className="selected-book__subtitle-section">
                    <div className="selected-book__subtitle">
                      {selectedBook.subTitle}
                    </div>
                  </div>
                  <div className="selected-book__divider"></div>
                  {selectedBook.imageLink && (
                    <img
                      src={selectedBook.imageLink}
                      alt={selectedBook.title}
                      className="selected-book__image"
                    />
                  )}
                  <div className="selected-book__content">
                    <h3 className="selected-book__book-title">
                      {selectedBook.title}
                    </h3>
                    <p className="selected-book__author">
                      {selectedBook.author}
                    </p>
                    <button className="btn selected-book__btn">
                      Read Now
                    </button>
                  </div>
                </div>
              )}
            </section>

            {/* Recommended Books Section */}
            <section className="recommended">
              <div className="recommended__header">
                <h2 className="recommended__title">Recommended For You</h2>
                <p className="recommended__subtitle">We think you'll like these</p>
              </div>
              <div className="recommended__books">
                {recommendedBooks.map((book, index) => (
                  <div key={index} className="recommended__book-card">
                    {book.imageLink && (
                      <img
                        src={book.imageLink}
                        alt={book.title}
                        className="recommended__book-image"
                      />
                    )}
                    <div className="recommended__book-title">{book.title}</div>
                    <div className="recommended__book-author">{book.author}</div>
                    <div className="recommended__book-subtitle">
                      {book.subTitle}
                    </div>
                  </div>
                ))}
              </div>
            </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
