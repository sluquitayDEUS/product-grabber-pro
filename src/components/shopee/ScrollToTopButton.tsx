import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

interface ScrollToTopButtonProps {
  showAfterElement?: string; // CSS selector for element after which to show
}

const ScrollToTopButton = ({ showAfterElement = ".description-section" }: ScrollToTopButtonProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const element = document.querySelector(showAfterElement);
      if (element) {
        const elementRect = element.getBoundingClientRect();
        // Show when element is scrolled into view (top is above viewport)
        setIsVisible(elementRect.top < window.innerHeight * 0.5);
      } else {
        // Fallback: show after scrolling 600px
        setIsVisible(window.scrollY > 600);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, [showAfterElement]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-20 right-4 z-50 w-10 h-10 rounded-full bg-white shadow-lg border border-border flex items-center justify-center transition-all duration-200 hover:shadow-xl active:scale-95"
      aria-label="Voltar ao topo"
    >
      <ArrowUp className="w-5 h-5 text-primary" />
    </button>
  );
};

export default ScrollToTopButton;
