import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function Pricing() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState("yearly");
  const [openFaq, setOpenFaq] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  const handleSubscribe = (plan) => {
    if (!user) {
      router.push("/");
      return;
    }
    
  
    const updatedUser = { ...user, isPremium: true };
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
    
    alert(`Successfully subscribed to ${plan} plan!`);
    router.push("/for-you");
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      question: "Can I switch plans?",
      answer: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle."
    },
    {
      question: "What happens after my free trial?",
      answer: "After your 7-day free trial ends, you'll be automatically charged for your selected plan. You can cancel anytime before the trial ends to avoid charges."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your settings page. You'll continue to have access until the end of your billing period."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, debit cards, and PayPal. All payments are processed securely."
    },
    {
      question: "Is there a refund policy?",
      answer: "We offer a 30-day money-back guarantee. If you're not satisfied with our service, contact us within 30 days for a full refund."
    }
  ];

  return (
    <>
      <Head>
        <title>Choose Your Plan - Summarist</title>
        <meta name="description" content="Get unlimited access to book summaries" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper">
        <main className="pricing-container">
          <div className="pricing__hero">
            <div className="pricing__hero-content">
              <h1 className="pricing__hero-title">
                Get unlimited access to many amazing books to read
              </h1>
              <p className="pricing__hero-subtitle">
                Turn ordinary moments into amazing learning opportunities.
              </p>
              <div className="pricing__hero-image">
                <img 
                  src="/assets/pricing-top.png" 
                  alt="Unlock unlimited access" 
                  className="pricing__top-image"
                />
              </div>
            </div>
          </div>
          <div className="pricing__features">
            <div className="pricing__feature">
              <div className="pricing__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <p className="pricing__feature-text">
                <strong>Key ideas in few min</strong> with many books to read
              </p>
            </div>

            <div className="pricing__feature">
              <div className="pricing__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 6v6l4 2"></path>
                </svg>
              </div>
              <p className="pricing__feature-text">
                <strong>3 million</strong> people growing with Summarist everyday
              </p>
            </div>

            <div className="pricing__feature">
              <div className="pricing__feature-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              </div>
              <p className="pricing__feature-text">
                <strong>Precise recommendations</strong> collections curated by experts
              </p>
            </div>
          </div>
          <div className="pricing__header">
            <h2 className="pricing__section-title">
              Choose the plan that fits you
            </h2>
          </div>
          <div className="pricing__plans-wrapper">
            <div 
              className={`pricing__plan-option ${selectedPlan === "yearly" ? "pricing__plan-option--selected" : ""}`}
              onClick={() => setSelectedPlan("yearly")}
            >
              <div className="pricing__plan-radio">
                <div className="pricing__plan-radio-outer">
                  {selectedPlan === "yearly" && <div className="pricing__plan-radio-inner"></div>}
                </div>
              </div>
              <div className="pricing__plan-details">
                <div className="pricing__plan-header">
                  <h3 className="pricing__plan-title">Premium Plus Yearly</h3>
                  <div className="pricing__plan-price-inline">
                    <span className="pricing__plan-amount-inline">$99.99</span>
                    <span className="pricing__plan-period-inline">/year</span>
                  </div>
                </div>
                <p className="pricing__plan-description">7-day free trial included</p>
              </div>
            </div>
            <div 
              className={`pricing__plan-option ${selectedPlan === "monthly" ? "pricing__plan-option--selected" : ""}`}
              onClick={() => setSelectedPlan("monthly")}
            >
              <div className="pricing__plan-radio">
                <div className="pricing__plan-radio-outer">
                  {selectedPlan === "monthly" && <div className="pricing__plan-radio-inner"></div>}
                </div>
              </div>
              <div className="pricing__plan-details">
                <div className="pricing__plan-header">
                  <h3 className="pricing__plan-title">Premium Plus Monthly</h3>
                  <div className="pricing__plan-price-inline">
                    <span className="pricing__plan-amount-inline">$9.99</span>
                    <span className="pricing__plan-period-inline">/month</span>
                  </div>
                </div>
                <p className="pricing__plan-description">No trial included</p>
              </div>
            </div>
          </div>
          <div className="pricing__cta">
            <button 
              className="pricing__cta-btn"
              onClick={() => handleSubscribe(selectedPlan === "yearly" ? "Yearly" : "Monthly")}
            >
              {selectedPlan === "yearly" ? "Start your free 7-day trial" : "Subscribe Now"}
            </button>
            {selectedPlan === "yearly" && (
              <p className="pricing__cta-terms">
                cancel your trial at any time before it ends, and you won't be charged
              </p>
            )}
          </div>
          <div className="pricing__faq">
            <h2 className="pricing__faq-title">Frequently Asked Questions</h2>
            <div className="pricing__faq-list">
              {faqs.map((faq, index) => (
                <div key={index} className="pricing__faq-item">
                  <button 
                    className={`pricing__faq-question ${openFaq === index ? "pricing__faq-question--active" : ""}`}
                    onClick={() => toggleFaq(index)}
                  >
                    <span>{faq.question}</span>
                    <svg 
                      className={`pricing__faq-icon ${openFaq === index ? "pricing__faq-icon--open" : ""}`}
                      width="16" 
                      height="16" 
                      viewBox="0 0 16 16" 
                      fill="none"
                    >
                      <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  {openFaq === index && (
                    <div className="pricing__faq-answer">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
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
      </div>
    </>
  );
}
