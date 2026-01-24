import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Library() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [library, setLibrary] = useState([]);
  const [finishedBooks, setFinishedBooks] = useState([]);
  const [activeTab, setActiveTab] = useState('saved'); 
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      router.push(`/for-you?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(savedUser));
    
    const savedLibrary = JSON.parse(localStorage.getItem("library") || "[]");
    const savedFinishedBooks = JSON.parse(localStorage.getItem("finishedBooks") || "[]");
    setLibrary(savedLibrary);
    setFinishedBooks(savedFinishedBooks);
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleRemoveFromLibrary = (bookId) => {
    const updatedLibrary = library.filter(book => book.id !== bookId);
    setLibrary(updatedLibrary);
    localStorage.setItem("library", JSON.stringify(updatedLibrary));
  };

  const handleRemoveFromFinished = (bookId) => {
    const updatedFinished = finishedBooks.filter(book => book.id !== bookId);
    setFinishedBooks(updatedFinished);
    localStorage.setItem("finishedBooks", JSON.stringify(updatedFinished));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>My Library - Summarist</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="nav nav--for-you">
        <div className="nav__wrapper--for-you">
          <div className="nav__left">
            <button className="hamburger-menu" onClick={() => setSidebarOpen(!sidebarOpen)} aria-label="Toggle sidebar">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <figure className="nav__img--mask">
              <img className="nav__img" src="/assets/logo.png" alt="logo" />
            </figure>
          </div>
          <div className="search__wrapper search__wrapper--right">
            <input
              type="text"
              placeholder="Search for books..."
              className="search__input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearch}
            />
            {searchQuery && (
              <button className="search__clear" onClick={clearSearch}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            )}
            <svg className="search__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </div>
        </div>
      </nav>

      <div className="page__layout">
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        

        <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
          <div className="sidebar__items">
            <div className="sidebar__item" onClick={() => router.push("/for-you")}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="sidebar__text">For you</span>
            </div>
            <div className="sidebar__item sidebar__item--active">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
              <span className="sidebar__text">My Library</span>
            </div>
            <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
              </svg>
              <span className="sidebar__text">Highlights</span>
            </div>
            <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              <span className="sidebar__text">Search</span>
            </div>
          </div>
          <div className="sidebar__bottom">
            <div className="sidebar__item" onClick={() => router.push("/settings")}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3"></circle>
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
              </svg>
              <span className="sidebar__text">Settings</span>
            </div>
            <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                <line x1="12" y1="17" x2="12.01" y2="17"></line>
              </svg>
              <span className="sidebar__text">Help & Support</span>
            </div>
            <div className="sidebar__item" onClick={handleLogout}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              <span className="sidebar__text">Logout</span>
            </div>
          </div>
        </aside>
        <main className="for-you__container">
          <div className="library-page">
            <div className="library-page__header">
              <h1 className="library-page__title">My Library</h1>
              <div className="library-page__tabs">
                <button 
                  className={`library-page__tab ${activeTab === 'saved' ? 'library-page__tab--active' : ''}`}
                  onClick={() => setActiveTab('saved')}
                >
                  Saved ({library.length})
                </button>
                <button 
                  className={`library-page__tab ${activeTab === 'finished' ? 'library-page__tab--active' : ''}`}
                  onClick={() => setActiveTab('finished')}
                >
                  Finished ({finishedBooks.length})
                </button>
              </div>
            </div>
            {activeTab === 'saved' && (
              library.length === 0 ? (
                <div className="library-page__empty">
                  <svg className="library-page__empty-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                  </svg>
                  <h2 className="library-page__empty-title">No saved books yet</h2>
                  <p className="library-page__empty-text">
                    Click "Add to My Library" on any book to see it here
                  </p>
                  <button 
                    className="library-page__empty-button"
                    onClick={() => router.push("/for-you")}
                  >
                    Browse Books
                  </button>
                </div>
              ) : (
                <div className="library-page__grid">
                  {library.map((book) => (
                    <div key={book.id} className="library-book">
                      <div 
                        className="library-book__image-wrapper"
                        onClick={() => router.push(`/book/${book.id}`)}
                      >
                        <img 
                          src={book.imageLink} 
                          alt={book.title}
                          className="library-book__image"
                        />
                      </div>
                      <div className="library-book__content">
                        <h3 
                          className="library-book__title"
                          onClick={() => router.push(`/book/${book.id}`)}
                        >
                          {book.title}
                        </h3>
                        <p className="library-book__author">{book.author}</p>
                        <p className="library-book__subtitle">{book.subTitle}</p>
                        <div className="library-book__footer">
                          <div className="library-book__rating">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>{book.averageRating}</span>
                          </div>
                          <button 
                            className="library-book__remove"
                            onClick={() => handleRemoveFromLibrary(book.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
            {activeTab === 'finished' && (
              finishedBooks.length === 0 ? (
                <div className="library-page__empty">
                  <svg className="library-page__empty-icon" xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <h2 className="library-page__empty-title">No finished books yet</h2>
                  <p className="library-page__empty-text">
                    Books you finish listening to will appear here
                  </p>
                  <button 
                    className="library-page__empty-button"
                    onClick={() => router.push("/for-you")}
                  >
                    Browse Books
                  </button>
                </div>
              ) : (
                <div className="library-page__grid">
                  {finishedBooks.map((book) => (
                    <div key={book.id} className="library-book library-book--finished">
                      <div 
                        className="library-book__image-wrapper"
                        onClick={() => router.push(`/book/${book.id}`)}
                      >
                        <img 
                          src={book.imageLink} 
                          alt={book.title}
                          className="library-book__image"
                        />
                        <div className="library-book__badge">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Finished
                        </div>
                      </div>
                      <div className="library-book__content">
                        <h3 
                          className="library-book__title"
                          onClick={() => router.push(`/book/${book.id}`)}
                        >
                          {book.title}
                        </h3>
                        <p className="library-book__author">{book.author}</p>
                        <p className="library-book__subtitle">{book.subTitle}</p>
                        <div className="library-book__footer">
                          <div className="library-book__rating">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            <span>{book.averageRating}</span>
                          </div>
                          <button 
                            className="library-book__remove"
                            onClick={() => handleRemoveFromFinished(book.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        </main>
      </div>
    </>
  );
}
