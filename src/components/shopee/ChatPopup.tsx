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
    answer: "Sim, 100% seguro! O produto é vendido através da plataforma Shopee, que oferece o programa Garantia Shopee. Seu pagamento só é liberado ao vendedor após você confirmar o recebimento. Utilizamos criptografia SSL e somos uma loja verificada com mais de 127 mil pedidos entregues."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo é de 3 a 9 dias úteis com Frete Grátis ou 3 a 5 dias úteis com Frete Express. A data estimada de entrega é exibida diretamente na página do produto, antes mesmo de você finalizar a compra. Enviamos para todo o Brasil!"
  },
  {
    question: "Quais formas de pagamento?",
    answer: "Aceitamos PIX e Cartão de Crédito (em até 12x com juros). No PIX, oferecemos até 12% de desconto! Não aceitamos cartão de débito nem boleto bancário. O pagamento via PIX é instantâneo e o pedido é processado imediatamente."
  },
  {
    question: "Como rastreio meu pedido?",
    answer: "Após o pedido sair para entrega, você receberá o código de rastreio por e-mail e WhatsApp. Com ele, você acompanha a entrega em tempo real! O produto é enviado via Transportadora Shopee, garantindo segurança e rapidez na entrega."
  },
  {
    question: "O produto tem garantia?",
    answer: "Sim! O AquaVolt possui garantia de 90 dias de fábrica contra defeitos de fabricação. Além disso, você tem 7 dias após o recebimento para solicitar devolução caso o produto não atenda suas expectativas, conforme o Código de Defesa do Consumidor."
  },
  {
    question: "Como funciona o frete grátis?",
    answer: "O frete grátis é válido para todo o Brasil com entrega em 3 a 9 dias úteis! O desconto é aplicado automaticamente no checkout. Se preferir receber mais rápido, temos o Frete Express (3 a 5 dias úteis) por R$ 17,90."
  },
  {
    question: "A loja é confiável?",
    answer: "Somos a Atacado Premium, loja verificada pela Shopee com selo de Loja Oficial! Temos mais de 127 mil pedidos entregues, 98% de avaliações positivas e mais de 85 mil seguidores. Estamos há mais de 3 anos no mercado com compromisso de qualidade."
  },
  {
    question: "Qual a velocidade do AquaVolt?",
    answer: "O AquaVolt alcança uma velocidade máxima de 52 km/h, equivalente a um jet ski tradicional! Possui potência de 15 kW e autonomia de 70 a 80 minutos com uma única carga. O sistema de resfriamento ativo por imersão em água garante diversão prolongada."
  },
  {
    question: "Precisa de habilitação náutica?",
    answer: "Não! O AquaVolt não exige habilitação náutica. Para pilotar, basta ter mais de 17 anos e usar colete salva-vidas (incluso). O produto acompanha certificado de licença e autorização da Marinha do Brasil para apresentar em caso de fiscalização."
  },
  {
    question: "Como é o carregamento?",
    answer: "A bateria de lítio ternária carrega completamente em apenas 3 a 4 horas, compatível com tomadas 220V e 110V. A bateria possui vida útil de até 800 ciclos de carga e descarga. O AquaVolt pesa apenas 45 kg (casco) + 23 kg (bateria), sendo fácil de transportar."
  },
  {
    question: "Posso cancelar meu pedido?",
    answer: "Sim! Você pode cancelar seu pedido antes do envio sem nenhum custo. Após o envio, você pode recusar o recebimento ou solicitar devolução em até 7 dias. O reembolso é processado em até 48 horas após a confirmação."
  },
  {
    question: "Como entro em contato com a loja?",
    answer: "Você pode nos contatar pelo chat da Shopee, disponível 24 horas! Nossa equipe responde em até 2 horas durante o horário comercial. Também enviamos atualizações do seu pedido por e-mail e WhatsApp automaticamente."
  },
  {
    question: "O produto vem com acessórios?",
    answer: "Sim! O AquaVolt inclui: colete salva-vidas, airbag anticolisão, piso sintético, carregador compatível com 110V/220V e certificado da Marinha do Brasil. Tudo o que você precisa para começar a usar imediatamente!"
  },
  {
    question: "Posso comprar mais de uma unidade?",
    answer: "Por questões de estoque limitado, cada cliente pode adquirir no máximo 2 unidades por pedido. Se precisar de mais, entre em contato conosco pelo chat para verificar disponibilidade especial."
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim! Emitimos nota fiscal eletrônica (NF-e) em todas as compras. A nota é enviada automaticamente para seu e-mail após a confirmação do pagamento. Caso precise de segunda via, basta solicitar pelo chat."
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
      <DialogContent className="sm:max-w-md p-0 gap-0 h-[80vh] max-h-[550px] flex flex-col overflow-hidden">
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
                  className={`rounded-2xl px-3 py-2 ${
                    message.type === "user" 
                      ? "bg-primary text-white rounded-br-md" 
                      : "bg-white text-foreground rounded-bl-md shadow-sm border border-border"
                  }`}
                >
                  <p className="text-[13px] leading-relaxed">{message.text}</p>
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
              <p className="text-[11px] text-muted-foreground text-center mb-2">
                Selecione uma pergunta:
              </p>
              <div className="grid grid-cols-1 gap-1.5">
                {faqData.map((faq, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionClick(faq.question, faq.answer)}
                    className="bg-white border border-primary/30 text-primary text-[11px] px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-sm text-left"
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
