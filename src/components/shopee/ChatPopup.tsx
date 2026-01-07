import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Message {
  id: number;
  type: "user" | "bot";
  text: string;
}

const faqData = [
  {
    question: "Este site é seguro?",
    answer: "Sim! Sua compra é 100% segura. Todos os produtos são vendidos através da plataforma Shopee, que oferece o programa Garantia Shopee. Seu pagamento só é liberado ao vendedor após você confirmar o recebimento do produto. Além disso, utilizamos criptografia SSL em todas as transações."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo de entrega varia de acordo com sua região. Geralmente, para capitais o prazo é de 7 a 15 dias úteis, e para interior de 10 a 20 dias úteis. Você pode acompanhar seu pedido em tempo real pelo código de rastreamento que será enviado após o despacho."
  },
  {
    question: "O produto tem garantia?",
    answer: "Sim! Todos os nossos produtos possuem garantia de 90 dias contra defeitos de fabricação. Além disso, você tem 7 dias após o recebimento para solicitar devolução caso o produto não atenda suas expectativas, conforme o Código de Defesa do Consumidor."
  },
  {
    question: "Como funciona o frete grátis?",
    answer: "O frete grátis é válido para todo o Brasil! Basta adicionar o produto ao carrinho e finalizar a compra. O desconto do frete é aplicado automaticamente no checkout. Esta é uma promoção especial por tempo limitado."
  },
  {
    question: "Posso parcelar minha compra?",
    answer: "Sim! Você pode parcelar em até 12x no cartão de crédito. Para compras acima de R$ 100, o parcelamento é sem juros. Também aceitamos PIX com 5% de desconto adicional, boleto bancário e cartão de débito."
  },
  {
    question: "Como rastreio meu pedido?",
    answer: "Após a confirmação do pagamento e despacho do produto, você receberá um e-mail com o código de rastreamento. Você pode acompanhar pelo site dos Correios ou transportadora. Também enviamos atualizações automáticas sobre o status da entrega."
  },
  {
    question: "O produto é original?",
    answer: "Sim! Somos uma loja oficial e todos os nossos produtos são 100% originais e novos, lacrados de fábrica. Trabalhamos apenas com fornecedores autorizados e oferecemos nota fiscal em todas as compras."
  },
  {
    question: "Como funciona a troca ou devolução?",
    answer: "Você tem 7 dias após o recebimento para solicitar troca ou devolução. Basta entrar em contato conosco pela plataforma Shopee. O processo é simples: geramos uma etiqueta de postagem gratuita e, após recebermos o produto, realizamos a troca ou reembolso integral."
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim! Emitimos nota fiscal eletrônica (NF-e) em todas as compras. A nota é enviada automaticamente para o e-mail cadastrado após a confirmação do pagamento. Caso precise de segunda via, basta nos contatar."
  },
  {
    question: "A loja é confiável?",
    answer: "Somos uma loja verificada pela Shopee com selo de Loja Oficial! Temos mais de 127 mil pedidos entregues, 98% de avaliações positivas e mais de 85 mil seguidores. Estamos há mais de 3 anos no mercado, sempre com compromisso de qualidade e satisfação do cliente."
  }
];

const ChatPopup = ({ open, onOpenChange }: ChatPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "bot",
      text: "Olá! 👋 Bem-vindo à Atacado Premium! Como posso ajudar você hoje? Selecione uma das opções abaixo ou digite sua pergunta."
    }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);

  const handleQuestionClick = (question: string, answer: string) => {
    const userMessage: Message = {
      id: messages.length,
      type: "user",
      text: question
    };
    
    const botMessage: Message = {
      id: messages.length + 1,
      type: "bot",
      text: answer
    };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQuestions(false);
    
    // Show questions again after a delay
    setTimeout(() => setShowQuestions(true), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 h-[85vh] max-h-[600px] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-primary p-4 flex items-center gap-3">
          <div className="relative">
            <img 
              src="/lovable-uploads/f6949b55-5746-4c6d-a30a-e701c014d9c9.png" 
              alt="Loja" 
              className="w-10 h-10 rounded-full object-cover border-2 border-white"
            />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm">Atacado Premium</h3>
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online agora
            </p>
          </div>
          <button 
            onClick={() => onOpenChange(false)}
            className="text-white/80 hover:text-white p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div 
              key={message.id}
              className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[85%] ${message.type === "user" ? "order-1" : "order-2"}`}>
                {message.type === "bot" && (
                  <div className="flex items-center gap-2 mb-1">
                    <img 
                      src="/lovable-uploads/f6949b55-5746-4c6d-a30a-e701c014d9c9.png" 
                      alt="Loja" 
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="text-xs text-muted-foreground">Resposta Automática da Loja</span>
                  </div>
                )}
                <div 
                  className={`rounded-2xl px-4 py-2.5 ${
                    message.type === "user" 
                      ? "bg-primary text-white rounded-br-md" 
                      : "bg-white text-foreground rounded-bl-md shadow-sm border border-border"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                </div>
                {message.type === "user" && (
                  <p className="text-[10px] text-muted-foreground text-right mt-1">Você</p>
                )}
              </div>
            </div>
          ))}

          {/* Quick Questions */}
          {showQuestions && (
            <div className="space-y-2 pt-2">
              <p className="text-xs text-muted-foreground text-center mb-3">
                Perguntas frequentes:
              </p>
              <div className="flex flex-wrap gap-2">
                {faqData.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(faq.question, faq.answer)}
                    className="bg-white border border-primary/30 text-primary text-xs px-3 py-2 rounded-full hover:bg-primary hover:text-white transition-colors shadow-sm"
                  >
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-border bg-white">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <input
                type="text"
                placeholder="Selecione uma pergunta acima..."
                className="bg-transparent text-sm w-full outline-none text-muted-foreground"
                disabled
              />
            </div>
            <button className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center">
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground text-center mt-2">
            💬 Chat automatizado • Respostas instantâneas 24h
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;
