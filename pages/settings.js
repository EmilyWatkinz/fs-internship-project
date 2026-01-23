import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Settings() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = async (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/for-you?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/");
  };

  const handleLoginRedirect = () => {
    setShowLoginModal(true);
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

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <>
        <Head>
          <title>Settings - Login Required</title>
          <meta name="description" content="Login to access settings" />
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
              <div className="sidebar__item sidebar__item--active">
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
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
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
          </div>

          {}
          <main className="for-you__container">
            <div className="settings-login">
              <div className="settings-login__content">
                <img 
                  src="/assets/login.png" 
                  alt="Login required" 
                  className="settings-login__image"
                />
                <h2 className="settings-login__title">Log in to your account to see your Settings</h2>
                <button className="settings-login__btn" onClick={handleLoginRedirect}>
                  Login
                </button>
              </div>
            </div>
          </main>
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
        <title>Settings</title>
        <meta name="description" content="Manage your account settings" />
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
            <div className="sidebar__item sidebar__item--active">
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
          <div className="settings-page">
            <h1 className="settings-page__title">Settings</h1>
            {loading ? (
              <div className="settings-page__content">
                <div className="skeleton-settings-section">
                  <div className="skeleton skeleton-settings-section__title"></div>
                  <div className="skeleton-settings-section__item">
                    <div className="skeleton skeleton-settings-section__label"></div>
                    <div className="skeleton skeleton-settings-section__value"></div>
                  </div>
                </div>
                <div className="skeleton-settings-section">
                  <div className="skeleton skeleton-settings-section__title"></div>
                  <div className="skeleton-settings-section__item">
                    <div className="skeleton skeleton-settings-section__label"></div>
                    <div className="skeleton skeleton-settings-section__value"></div>
                  </div>
                </div>
              </div>
            ) : (
            <div className="settings-page__content">
              <div className="settings-section">
                <h2 className="settings-section__title">Account Information</h2>
                <div className="settings-section__item">
                  <span className="settings-section__label">Email:</span>
                  <span className="settings-section__value">{user.email}</span>
                </div>
              </div>

              <div className="settings-section">
                <h2 className="settings-section__title">Subscription</h2>
                <div className="settings-section__item">
                  <span className="settings-section__label">Plan:</span>
                  <span className="settings-section__value">
                    {user.isPremium ? "Premium" : "Basic"}
                  </span>
                </div>
                {!user.isPremium && (
                  <div className="settings-section__item">
                    <button className="settings-section__upgrade-btn" onClick={() => router.push("/pricing")}>
                      Upgrade to Premium
                    </button>
                  </div>
                )}
              </div>
            </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
