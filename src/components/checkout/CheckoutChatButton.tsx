import { useState, useEffect } from "react";
import { MessageCircle, X, ChevronRight, ArrowLeft } from "lucide-react";

const faqData = [
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo de entrega varia de acordo com sua região. Com Frete Grátis: de 3 a 9 dias úteis. Com Frete Expresso (R$ 17,90): de 3 a 5 dias úteis. Após o envio, você receberá o código de rastreamento."
  },
  {
    question: "Este site é seguro?",
    answer: "Sim! Sua compra é 100% segura. Seus dados são protegidos com criptografia de ponta a ponta. Nossa loja possui mais de 89 mil avaliações positivas e 98% de satisfação."
  },
  {
    question: "O produto tem garantia?",
    answer: "Sim! O produto possui 90 dias de garantia contra defeitos de fabricação. Além disso, você tem 7 dias após o recebimento para devolução."
  },
  {
    question: "Como funciona o Pix?",
    answer: "Ao escolher Pix, você receberá um QR Code para escanear. O pagamento é instantâneo e você ganha até 12% de desconto!"
  },
  {
    question: "Posso parcelar?",
    answer: "Sim! Aceitamos cartões de crédito com parcelamento em até 12x sem juros."
  }
];

const CheckoutChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      const clientHeight = window.innerHeight;
      
      // Show when scrolled past 60% of the page
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      setIsVisible(scrollPercentage > 0.6);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial position
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  const handleClose = () => {
    setIsOpen(false);
    setSelectedQuestion(null);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Small floating chat button - bottom left */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-[72px] left-2 w-9 h-9 bg-[#EE4D2D] text-white rounded-full flex items-center justify-center shadow-lg z-40 hover:scale-105 transition-transform"
          aria-label="Abrir chat"
        >
          <MessageCircle className="w-4 h-4" />
        </button>
      )}

      {/* Chat popup - small and compact */}
      {isOpen && (
        <div className="fixed bottom-32 left-3 w-64 max-h-72 bg-card rounded-lg shadow-xl z-50 overflow-hidden border border-border animate-in fade-in slide-in-from-bottom-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-2 bg-[#EE4D2D] text-white">
            <div className="flex items-center gap-2">
              {selectedQuestion !== null && (
                <button onClick={handleBack} className="p-0.5">
                  <ArrowLeft className="w-4 h-4" />
                </button>
              )}
              <MessageCircle className="w-4 h-4" />
              <span className="text-xs font-medium">
                {selectedQuestion !== null ? "Resposta" : "Ajuda"}
              </span>
            </div>
            <button onClick={handleClose} className="p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-56">
            {selectedQuestion === null ? (
              <div className="p-2">
                <p className="text-[10px] text-muted-foreground mb-2">
                  Selecione uma pergunta:
                </p>
                <div className="space-y-1">
                  {faqData.map((item, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedQuestion(index)}
                      className="w-full flex items-center justify-between p-2 rounded border border-border hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-[10px] text-foreground leading-tight">{item.question}</span>
                      <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0 ml-1" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-2">
                <div className="bg-muted/30 rounded p-2 mb-2">
                  <p className="text-[10px] font-medium text-foreground">
                    {faqData[selectedQuestion].question}
                  </p>
                </div>
                <div className="bg-primary/10 rounded p-2">
                  <p className="text-[10px] text-foreground leading-relaxed">
                    {faqData[selectedQuestion].answer}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutChatButton;
