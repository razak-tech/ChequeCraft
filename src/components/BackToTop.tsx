import { useState, useEffect } from 'react';

const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <button
        type="button"
        onClick={scrollToTop}
        className={`${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        } inline-flex items-center justify-center p-3 rounded-full shadow-lg bg-gradient-to-r from-rose-500 to-red-600 text-white transition-all duration-300 ease-in-out hover:from-rose-600 hover:to-red-700 focus:outline-none focus:ring-4 focus:ring-rose-200/60 transform hover:-translate-y-1`}
        aria-label="Back to top"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>
    </div>
  );
};

export default BackToTop;
