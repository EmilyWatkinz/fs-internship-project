import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ForYou() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [recommendedBooks, setRecommendedBooks] = useState([]);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [audioDurations, setAudioDurations] = useState({});
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
      // Fetch books from API
      fetchBooks();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchBooks = async () => {
    try {
      // Fetch selected book
      const selectedResponse = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=selected"
      );
      const selectedData = await selectedResponse.json();
      
      if (selectedData && selectedData.length > 0) {
        setSelectedBook(selectedData[0]);
      }

      // Fetch recommended books
      const recommendedResponse = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=recommended"
      );
      const recommendedData = await recommendedResponse.json();
      
      if (recommendedData && recommendedData.length > 0) {
        console.log("Recommended books data:", recommendedData[0]); // Debug log
        setRecommendedBooks(recommendedData);
        loadAudioDurations(recommendedData);
      }

      // Fetch suggested books
      const suggestedResponse = await fetch(
        "https://us-central1-summaristt.cloudfunctions.net/getBooks?status=suggested"
      );
      const suggestedData = await suggestedResponse.json();
      
      if (suggestedData && suggestedData.length > 0) {
        console.log("Suggested books data:", suggestedData[0]); // Debug log
        setSuggestedBooks(suggestedData);
        loadAudioDurations(suggestedData);
      }

      if (selectedData && selectedData.length > 0) {
        loadAudioDurations([selectedData[0]]);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching books:", error);
      setLoading(false);
    }
  };

  const loadAudioDurations = (books) => {
    books.forEach((book) => {
      if (book.audioLink && !audioDurations[book.id]) {
        const audio = new Audio();
        audio.addEventListener('loadedmetadata', () => {
          const mins = Math.floor(audio.duration / 60);
          const secs = Math.floor(audio.duration % 60);
          const formattedDuration = `${mins}:${secs.toString().padStart(2, '0')}`;
          setAudioDurations(prev => ({
            ...prev,
            [book.id]: formattedDuration
          }));
        });
        audio.src = book.audioLink;
      }
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setSelectedBook(null);
    setRecommendedBooks([]);
    setSuggestedBooks([]);
    setSearchResults([]);
    setIsSearching(false);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleGuestLogin = () => {
    const guestUser = {
      email: "guest@summarist.com",
      displayName: "Guest User",
      isGuest: true
    };
    setUser(guestUser);
    localStorage.setItem("user", JSON.stringify(guestUser));
    setShowLoginModal(false);
    setError("");
    window.location.reload();
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (isRegisterMode) {
      if (password.length < 6) {
        setError("Short password");
        return;
      }

      const newUser = {
        email: email,
        displayName: email.split("@")[0],
        isGuest: false
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      registeredUsers.push({ email, password });
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
      setError("");
      setIsRegisterMode(false);
      window.location.reload();
    } else {
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      const userExists = registeredUsers.find(u => u.email === email && u.password === password);
      
      if (!userExists) {
        setError("User not found");
        return;
      }

      const newUser = {
        email: email,
        displayName: email.split("@")[0],
        isGuest: false
      };
      setUser(newUser);
      localStorage.setItem("user", JSON.stringify(newUser));
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
      setError("");
      window.location.reload();
    }
  };

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      setIsSearching(true);
      try {
        const response = await fetch(
          `https://us-central1-summaristt.cloudfunctions.net/getBooksByAuthorOrTitle?search=${encodeURIComponent(searchQuery)}`
        );
        const data = await response.json();
        setSearchResults(data || []);
      } catch (error) {
        console.error("Error searching books:", error);
        setSearchResults([]);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading__spinner"></div>
      </div>
    );
  }

  // If user is not logged in, show login prompt
  if (!user) {
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
                disabled
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
              <div className="sidebar__item sidebar__item--active" onClick={() => router.push("/for-you")}>
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
                <span className="sidebar__text">For you</span>
              </div>
              <div className="sidebar__item" onClick={() => router.push("/library")}>
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                </svg>
                <span className="sidebar__text">My Library</span>
              </div>
              <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
                </svg>
                <span className="sidebar__text">Highlights</span>
              </div>
              <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                <span className="sidebar__text">Help & Support</span>
              </div>
              <div className="sidebar__item" onClick={() => setShowLoginModal(true)}>
                <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                  <polyline points="10 17 15 12 10 7"></polyline>
                  <line x1="15" y1="12" x2="3" y2="12"></line>
                </svg>
                <span className="sidebar__text">Login</span>
              </div>
            </div>
          </aside>
          <div className="main__content">
            <div className="container">
              <div className="for-you__wrapper">
                <div className="settings-login">
                  <div className="settings-login__content">
                    <img 
                      src="/assets/login.png" 
                      alt="Login required" 
                      className="settings-login__image"
                    />
                    <h2 className="settings-login__title">Log in to your account to see book recommendations</h2>
                    <button className="settings-login__btn" onClick={() => setShowLoginModal(true)}>
                      Login
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {showLoginModal && (
          <div className="modal__overlay" onClick={() => setShowLoginModal(false)}>
            <div className="modal__card" onClick={(e) => e.stopPropagation()}>
              <button className="modal__close" onClick={() => setShowLoginModal(false)}>×</button>
              <h2 className="modal__title">{isRegisterMode ? "Register to Summarist" : "Log in to Summarist"}</h2>
              
              {error && (
                <div className="modal__error">
                  {error}
                </div>
              )}
              
              <button className="modal__btn modal__btn--guest" onClick={handleGuestLogin}>
                Login as Guest
              </button>
              
              <div className="modal__separator">
                <span>or</span>
              </div>
              
              <button className="modal__btn modal__btn--google">
                <img src="/assets/google.png" alt="Google" className="modal__google-icon" />
                Login with Google
              </button>
              
              <div className="modal__separator">
                <span>or</span>
              </div>
              
              <form className="modal__form" onSubmit={handleEmailLogin}>
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  className="modal__input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input 
                  type="password" 
                  placeholder="Password" 
                  className="modal__input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" className="modal__btn modal__btn--login">
                  {isRegisterMode ? "Register" : "Login"}
                </button>
              </form>
              
              <div className="modal__footer">
                <a href="#" className="modal__link">Forgot your password?</a>
                <a href="#" className="modal__link" onClick={(e) => { e.preventDefault(); toggleMode(); }}>
                  {isRegisterMode ? "Already have an account?" : "Don't have an account?"}
                </a>
              </div>
            </div>
          </div>
        )}
      </>
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
          <div className="nav__left">
            <button 
              className="hamburger-menu" 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
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
        {sidebarOpen && (
          <div 
            className="sidebar-overlay" 
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}
        <aside className={`sidebar ${sidebarOpen ? 'sidebar--open' : ''}`}>
          <div className="sidebar__items">
            <div className="sidebar__item sidebar__item--active">
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
              <span className="sidebar__text">For you</span>
            </div>
            <div className="sidebar__item" onClick={() => router.push("/library")}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m19 21-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
              </svg>
              <span className="sidebar__text">My Library</span>
            </div>
            <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"></path>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
              </svg>
              <span className="sidebar__text">Highlights</span>
            </div>
            <div className="sidebar__item" style={{cursor: 'not-allowed'}}>
              <svg className="sidebar__icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        <div className="main__content">
          <div className="container">
            <div className="row">
              <div className="for-you__wrapper">
                {isSearching ? (
                  <section className="search-results">
                    <div className="search-results__header">
                      <h2 className="search-results__title">
                        Search Results for "{searchQuery}"
                      </h2>
                      <button className="btn--link" onClick={clearSearch}>
                        Back to For You
                      </button>
                    </div>
                    {searchResults.length > 0 ? (
                      <div className="search-results__books">
                        {searchResults.map((book, index) => (
                          <div key={index} className="recommended__book-card" onClick={() => router.push(`/book/${book.id}`)}>
                            <div className="book-image__wrapper">
                              {book.imageLink && (
                                <img
                                  src={book.imageLink}
                                  alt={book.title}
                                  className="recommended__book-image"
                                />
                              )}
                              {book.subscriptionRequired && (
                                <div className="book__premium-badge">Premium</div>
                              )}
                            </div>
                            <div className="recommended__book-title">{book.title}</div>
                            <div className="recommended__book-author">{book.author}</div>
                            <div className="recommended__book-subtitle">{book.subTitle}</div>
                            <div className="recommended__book-details">
                              {book.audioLength && (
                                <span className="recommended__book-duration">
                                  <svg className="duration__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12 6 12 12 16 14"></polyline>
                                  </svg>
                                  {Math.floor(book.audioLength / 60)} min
                                </span>
                              )}
                              {book.averageRating && (
                                <>
                                  <span>{book.averageRating}</span>
                                  <svg className="rating__star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                                  </svg>
                                </>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="search-results__empty">
                        <p>No books found matching "{searchQuery}"</p>
                      </div>
                    )}
                  </section>
                ) : (
                  <>
                <section className="selected-book">
                  <h2 className="selected-book__title">Selected just for you</h2>
                  {!selectedBook ? (
                    <div className="skeleton-selected-book">
                      <div className="skeleton skeleton-selected-book__image"></div>
                      <div className="skeleton skeleton-selected-book__text"></div>
                      <div className="skeleton skeleton-selected-book__title"></div>
                      <div className="skeleton skeleton-selected-book__text"></div>
                      <div className="skeleton skeleton-selected-book__button"></div>
                    </div>
                  ) : (
                <div className="selected-book__card" style={{ cursor: 'pointer' }}>
                  <div className="selected-book__subtitle-section">
                    <div className="selected-book__subtitle">
                      {selectedBook.subTitle}
                    </div>
                  </div>
                  <div className="selected-book__divider"></div>
                  <div className="selected-book__content">
                    {selectedBook.imageLink && (
                      <img
                        src={selectedBook.imageLink}
                        alt={selectedBook.title}
                        className="selected-book__image"
                        onClick={() => router.push(`/book/${selectedBook.id}`)}
                      />
                    )}
                    <div className="selected-book__info">
                      <h3 className="selected-book__book-title">
                        {selectedBook.title}
                      </h3>
                      <p className="selected-book__author">
                        {selectedBook.author}
                      </p>
                      <div className="selected-book__play-section" onClick={() => router.push(`/player/${selectedBook.id}`)}>
                        <button className="selected-book__play-btn">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="5 3 19 12 5 21 5 3"></polygon>
                          </svg>
                        </button>
                        <span className="selected-book__audio-length">
                          {audioDurations[selectedBook.id] ? 
                            audioDurations[selectedBook.id].split(':').map((val, idx) => 
                              idx === 0 ? `${parseInt(val)} mins ` : `${parseInt(val)} secs`
                            ).join('') 
                            : '...'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
            <section className="recommended">
              <div className="recommended__header">
                <h2 className="recommended__title">Recommended For You</h2>
                <p className="recommended__subtitle">We think you'll like these</p>
              </div>
              <div className="recommended__books">
                {recommendedBooks.length === 0 ? (
                  <>
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="skeleton-book-card">
                        <div className="skeleton skeleton-book-card__image"></div>
                        <div className="skeleton skeleton-book-card__title"></div>
                        <div className="skeleton skeleton-book-card__author"></div>
                        <div className="skeleton skeleton-book-card__subtitle"></div>
                        <div className="skeleton-book-card__footer">
                          <div className="skeleton skeleton-book-card__duration"></div>
                          <div className="skeleton skeleton-book-card__rating"></div>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  recommendedBooks.slice(0, 5).map((book, index) => (
                  <div key={index} className="recommended__book-card" onClick={() => router.push(`/book/${book.id}`)}>
                    <div className="book-image__wrapper">
                      {book.imageLink && (
                        <img
                          src={book.imageLink}
                          alt={book.title}
                          className="recommended__book-image"
                        />
                      )}
                      {book.subscriptionRequired && (
                        <div className="book__premium-badge">Premium</div>
                      )}
                    </div>
                    <div className="recommended__book-title">{book.title}</div>
                    <div className="recommended__book-author">{book.author}</div>
                    <div className="recommended__book-subtitle">
                      {book.subTitle}
                    </div>
                    <div className="recommended__book-footer">
                      <div className="recommended__book-duration">
                        <svg className="duration__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{audioDurations[book.id] || '...'}</span>
                      </div>
                      <div className="recommended__book-rating">
                        <span>{book.averageRating || 0}</span>
                        <svg className="rating__star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                )))}
              </div>
            </section>
            <section className="suggested">
              <div className="suggested__header">
                <h2 className="suggested__title">Suggested Books</h2>
                <p className="suggested__subtitle">Browse those books</p>
              </div>
              <div className="suggested__books">
                {suggestedBooks.slice(0, 5).map((book, index) => (
                  <div key={index} className="suggested__book-card" onClick={() => router.push(`/book/${book.id}`)}>
                    <div className="book-image__wrapper">
                      {book.imageLink && (
                        <img
                          src={book.imageLink}
                          alt={book.title}
                          className="suggested__book-image"
                        />
                      )}
                      {book.subscriptionRequired && (
                        <div className="book__premium-badge">Premium</div>
                      )}
                    </div>
                    <div className="suggested__book-title">{book.title}</div>
                    <div className="suggested__book-author">{book.author}</div>
                    <div className="suggested__book-subtitle">
                      {book.subTitle}
                    </div>
                    <div className="suggested__book-footer">
                      <div className="suggested__book-duration">
                        <svg className="duration__icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"></circle>
                          <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span>{audioDurations[book.id] || '...'}</span>
                      </div>
                      <div className="suggested__book-rating">
                        <span>{book.averageRating || 0}</span>
                        <svg className="rating__star" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#ffd700" stroke="#ffd700" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
                </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
