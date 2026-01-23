import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function BookPage() {
  const router = useRouter();
  const { id } = router.query;
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [audioDuration, setAudioDuration] = useState('...');
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/for-you?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (!savedUser) {
      router.push("/");
      return;
    }
    setUser(JSON.parse(savedUser));
  }, []);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  useEffect(() => {
    if (book && book.audioLink) {
      const audio = new Audio();
      audio.addEventListener('loadedmetadata', () => {
        const mins = Math.floor(audio.duration / 60);
        const secs = Math.floor(audio.duration % 60);
        const formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
        setAudioDuration(formattedDuration);
      });
      audio.src = book.audioLink;
    }
    
    if (book) {
      const library = JSON.parse(localStorage.getItem("library") || "[]");
      const bookExists = library.some(item => item.id === book.id);
      setIsInLibrary(bookExists);
    }
  }, [book]);

  const fetchBook = async () => {
    try {
      const response = await fetch(
        `https://us-central1-summaristt.cloudfunctions.net/getBook?id=${id}`
      );
      const data = await response.json();
      setBook(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching book:", error);
      setLoading(false);
    }
  };

  const handleReadOrListen = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    router.push(`/player/${id}`);
  };

  const handleAddToLibrary = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const library = JSON.parse(localStorage.getItem("library") || "[]");
    
    const bookExists = library.some(item => item.id === book.id);
    
    if (!bookExists) {
      library.push({
        id: book.id,
        title: book.title,
        author: book.author,
        imageLink: book.imageLink,
        subTitle: book.subTitle,
        averageRating: book.averageRating
      });
      localStorage.setItem("library", JSON.stringify(library));
      setIsInLibrary(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  if (loading) {
    return (
      <>
        <Head>
          <title>Loading... - Summarist</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <div className="wrapper">
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
            </div>
          </nav>

          <main className="for-you__container">
            <div className="skeleton-book-details">
              <div className="skeleton skeleton-book-details__image"></div>
              <div className="skeleton skeleton-book-details__title"></div>
              <div className="skeleton skeleton-book-details__author"></div>
              <div className="skeleton skeleton-book-details__text"></div>
              <div className="skeleton skeleton-book-details__text"></div>
              <div className="skeleton skeleton-book-details__button"></div>
              <div className="skeleton skeleton-book-details__button"></div>
            </div>
          </main>
        </div>
      </>
    );
  }

  if (!book) {
    return (
      <div className="error-container">
        <p>Book not found</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{book.title} - Summarist</title>
        <meta name="description" content={book.subTitle} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper">
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
        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>}
        
        <div className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
          <div className="sidebar__items">
            <div className="sidebar__item" onClick={() => router.push("/for-you")}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="sidebar__text">For you</span>
            </div>
            <div className="sidebar__item" onClick={() => router.push("/library")}>
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
        </div>
        <main className="for-you__container">
          <div className="book-page">
            <div className="book-page__header">
              <div className="book-page__image-wrapper">
                {book.imageLink && (
                  <img
                    src={book.imageLink}
                    alt={book.title}
                    className="book-page__image"
                  />
                )}
              </div>

              <div className="book-page__header-content">
                <h1 className="book-page__title">{book.title}</h1>
                <p className="book-page__author">{book.author}</p>
                <p className="book-page__subtitle">{book.subTitle}</p>
                
                <div className="book-page__info-grid">
                  <div className="book-page__rating">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                    </svg>
                    <span>{book.averageRating} ({book.totalRating} ratings)</span>
                  </div>

                  <div className="book-page__meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{audioDuration}</span>
                  </div>

                  <div className="book-page__type-wrapper">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    <p className="book-page__type">{book.type}</p>
                  </div>

                  <div className="book-page__meta-item">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"></path>
                      <path d="M9 18h6"></path>
                      <path d="M10 22h4"></path>
                    </svg>
                    <span>{book.keyPoints?.length || 0} Key Ideas</span>
                  </div>
                </div>

                {book.subscriptionRequired && (
                  <div className="book-page__premium">Premium</div>
                )}

                <div className="book-page__actions">
                  <button className="btn book-page__action-btn" onClick={handleReadOrListen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
                    </svg>
                    Read
                  </button>
                  <button className="btn book-page__action-btn" onClick={handleReadOrListen}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
                      <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                      <line x1="12" y1="19" x2="12" y2="23"></line>
                      <line x1="8" y1="23" x2="16" y2="23"></line>
                    </svg>
                    Listen
                  </button>
                </div>

                <div 
                  className={`book-page__add-to-library ${isInLibrary ? 'book-page__add-to-library--added' : ''}`}
                  onClick={handleAddToLibrary}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={isInLibrary ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                  </svg>
                  <span>{isInLibrary ? 'Added to your Library' : 'Add title to My Library'}</span>
                </div>

                <div className="book-page__content">
                  <h3 className="book-page__section-title">What's it about?</h3>
                  
                  {book.tags && book.tags.length > 0 && (
                    <div className="book-page__tags">
                      {book.tags.map((tag, index) => (
                        <span key={index} className="book-page__tag">{tag}</span>
                      ))}
                    </div>
                  )}

                  <p className="book-page__text">{book.bookDescription}</p>

                  <h3 className="book-page__section-title">About the Author</h3>
                  <p className="book-page__text">{book.authorDescription || "Author information not available."}</p>
                </div>
              </div>
            </div>

            {book.keyPoints && book.keyPoints.length > 0 && (
              <div className="book-page__keypoints">
                <h2>Key Insights</h2>
                <ul>
                  {book.keyPoints.map((point, index) => (
                    <li key={index}>{point}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
