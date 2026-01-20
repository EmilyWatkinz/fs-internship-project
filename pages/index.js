import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isRegisterMode, setIsRegisterMode] = useState(false);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
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
    router.push("/for-you");
  };

  const handleEmailLogin = (e) => {
    e.preventDefault();
    setError("");

    // Validate email
    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (isRegisterMode) {
      // Registration mode
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
      // Also save registered users list
      const registeredUsers = JSON.parse(localStorage.getItem("registeredUsers") || "[]");
      registeredUsers.push({ email, password });
      localStorage.setItem("registeredUsers", JSON.stringify(registeredUsers));
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
      setError("");
      setIsRegisterMode(false);
      router.push("/for-you");
    } else {
      // Login mode
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
      router.push("/for-you");
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  const toggleMode = () => {
    setIsRegisterMode(!isRegisterMode);
    setError("");
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Head>
        <title>Summarist Home Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <nav className="nav">
        <div className="nav__wrapper">
          <figure className="nav__img--mask">
            <img className="nav__img" src="/assets/logo.png" alt="logo" />
          </figure>
          <ul className="nav__list--wrapper">
            {user ? (
              <>
                <li className="nav__list nav__list--user">
                  Welcome, {user.displayName}
                </li>
                <li className="nav__list nav__list--login" onClick={handleLogout}>
                  Logout
                </li>
              </>
            ) : (
              <li className="nav__list nav__list--login" onClick={() => setShowLoginModal(true)}>
                Login
              </li>
            )}
            <li className="nav__list nav__list--mobile">About</li>
            <li className="nav__list nav__list--mobile">Contact</li>
            <li className="nav__list nav__list--mobile">Help</li>
          </ul>
        </div>
      </nav>

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

      <section id="landing">
        <div className="container">
          <div className="row">
            <div className="landing__wrapper">
              <div className="landing__content">
                <div className="landing__content__title">
                  Gain more knowledge <br className="remove--tablet" />
                  in less time
                </div>
                <div className="landing__content__subtitle">
                  Great summaries for busy people,
                  <br className="remove--tablet" />
                  individuals who barely have time to read,
                  <br className="remove--tablet" />
                  and even people who don't like to read.
                </div>
                {!user && (
                  <button className="btn home__cta--btn" onClick={() => setShowLoginModal(true)}>Login</button>
                )}
                {user && (
                  <div className="landing__logged-in">
                    <p>Welcome back, {user.displayName}! Start exploring books.</p>
                  </div>
                )}
              </div>
              <figure className="landing__image--mask">
                <img src="/assets/landing.png" alt="landing" />
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section id="features">
        <div className="container">
          <div className="row">
            <div className="section__title">Understand books in few minutes</div>
            <div className="features__wrapper">
              <div className="features">
                <div className="features__icon">📄</div>
                <div className="features__title">Read or listen</div>
                <div className="features__sub--title">
                  Save time by getting the core ideas from the best books.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">💡</div>
                <div className="features__title">Find your next read</div>
                <div className="features__sub--title">
                  Explore book lists and personalized recommendations.
                </div>
              </div>
              <div className="features">
                <div className="features__icon">🎧</div>
                <div className="features__title">Briefcasts</div>
                <div className="features__sub--title">
                  Gain valuable insights from briefcasts
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--header">
                <div className="statistics__heading">Enhance your knowledge</div>
                <div className="statistics__heading">Achieve greater success</div>
                <div className="statistics__heading">Improve your health</div>
                <div className="statistics__heading">Develop better parenting skills</div>
                <div className="statistics__heading">Increase happiness</div>
                <div className="statistics__heading">Be the best version of yourself!</div>
              </div>
              <div className="statistics__content--details">
                <div className="statistics__data">
                  <div className="statistics__data--number">93%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>significantly increase</b> reading frequency.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">96%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>establish better</b> habits.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">90%</div>
                  <div className="statistics__data--title">
                    have made <b>significant positive</b> change to their lives.
                  </div>
                </div>
              </div>
            </div>
            <div className="statistics__wrapper">
              <div className="statistics__content--details statistics__content--details-second">
                <div className="statistics__data">
                  <div className="statistics__data--number">91%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>report feeling more productive</b> after incorporating the service into their daily routine.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">94%</div>
                  <div className="statistics__data--title">
                    of Summarist members have <b>noticed an improvement</b> in their overall comprehension and retention of information.
                  </div>
                </div>
                <div className="statistics__data">
                  <div className="statistics__data--number">88%</div>
                  <div className="statistics__data--title">
                    of Summarist members <b>feel more informed</b> about current events and industry trends since using the platform.
                  </div>
                </div>
              </div>
              <div className="statistics__content--header statistics__content--header-second">
                <div className="statistics__heading">Expand your learning</div>
                <div className="statistics__heading">Accomplish your goals</div>
                <div className="statistics__heading">Strengthen your vitality</div>
                <div className="statistics__heading">Become a better caregiver</div>
                <div className="statistics__heading">Improve your mood</div>
                <div className="statistics__heading">Maximize your abilities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="reviews">
        <div className="row">
          <div className="container">
            <div className="section__title">What our members say</div>
            <div className="reviews__wrapper">
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Hanna M.</div>
                  <div className="review__stars">⭐</div>
                </div>
                <div className="review__body">
                  This app has been a <b>game-changer</b> for me! It's saved me so much time and effort in reading and comprehending books. Highly recommend it to all book lovers.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">David B.</div>
                  <div className="review__stars">⭐</div>
                </div>
                <div className="review__body">
                  I love this app! It provides <b>concise and accurate summaries</b> of books in a way that is easy to understand. It's also very user-friendly and intuitive.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Nathan S.</div>
                  <div className="review__stars">⭐</div>
                </div>
                <div className="review__body">
                  This app is a great way to get the main takeaways from a book without having to read the entire thing. <b>The summaries are well-written and informative.</b> Definitely worth downloading.
                </div>
              </div>
              <div className="review">
                <div className="review__header">
                  <div className="review__name">Ryan R.</div>
                  <div className="review__stars">⭐</div>
                </div>
                <div className="review__body">
                  If you're a busy person who <b>loves reading but doesn't have the time</b> to read every book in full, this app is for you! The summaries are thorough and provide a great overview of the book's content.
                </div>
              </div>
            </div>
            {!user && (
              <div className="reviews__btn--wrapper">
                <button className="btn home__cta--btn" onClick={() => setShowLoginModal(true)}>Login</button>
              </div>
            )}
          </div>
        </div>
      </section>

      <section id="numbers">
        <div className="container">
          <div className="row">
            <div className="section__title">Start growing with Summarist now</div>
            <div className="numbers__wrapper">
              <div className="numbers">
                <div className="numbers__icon">👑</div>
                <div className="numbers__title">3 Million</div>
                <div className="numbers__sub--title">Downloads on all platforms</div>
              </div>
              <div className="numbers">
                <div className="numbers__icon numbers__star--icon">⭐</div>
                <div className="numbers__title">4.5 Stars</div>
                <div className="numbers__sub--title">Average ratings on iOS and Google Play</div>
              </div>
              <div className="numbers">
                <div className="numbers__icon">🌿</div>
                <div className="numbers__title">97%</div>
                <div className="numbers__sub--title">Of Summarist members create a better reading habit</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="footer">
        <div className="container">
          <div className="row">
            <div className="footer__top--wrapper">
              <div className="footer__block">
                <div className="footer__link--title">Actions</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Magazine</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Cancel Subscription</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Help</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Contact us</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Useful Links</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Pricing</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Summarist Business</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Gift Cards</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Authors & Publishers</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Company</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">About</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Careers</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Partners</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Code of Conduct</a>
                  </div>
                </div>
              </div>
              <div className="footer__block">
                <div className="footer__link--title">Other</div>
                <div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Sitemap</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Legal Notice</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Terms of Service</a>
                  </div>
                  <div className="footer__link--wrapper">
                    <a className="footer__link">Privacy Policies</a>
                  </div>
                </div>
              </div>
            </div>
            <div className="footer__copyright--wrapper">
              <div className="footer__copyright">Copyright &copy; 2023 Summarist.</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
