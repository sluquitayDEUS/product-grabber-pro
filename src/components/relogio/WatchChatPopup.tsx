import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import shopeeLogo from "@/assets/shopee-logo.webp";
import VerifiedBadge from "@/components/ui/verified-badge";

interface WatchChatPopupProps {
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
    answer: "Sim, 100% seguro! Este produto é vendido e enviado pela Shopee Oficial, que oferece o programa Garantia Shopee. Seu pagamento só é liberado após você confirmar o recebimento. Utilizamos criptografia SSL e somos a loja oficial da Shopee."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo é de 3 a 9 dias úteis com Frete Grátis ou 3 a 5 dias úteis com Frete Express. Enviamos para todo o Brasil com rastreio completo!"
  },
  {
    question: "Quais formas de pagamento?",
    answer: "Aceitamos PIX e Cartão de Crédito (em até 12x de R$ 18,29). No PIX, oferecemos até 12% de desconto! O pagamento via PIX é instantâneo e o pedido é processado imediatamente."
  },
  {
    question: "O relógio tem garantia?",
    answer: "Sim! O Relógio Imperium possui garantia de 2 anos contra perda e roubo, além de acompanhar Cartão de Garantia e Certificado de Autenticidade. Você também tem 7 dias após o recebimento para solicitar devolução."
  },
  {
    question: "O relógio é à prova d'água?",
    answer: "Sim! O Relógio Imperium possui resistência à água de até 30 metros, perfeito para uso no dia a dia, banhos e aventuras aquáticas leves. Vidro de cristal de safira garante proteção máxima."
  },
  {
    question: "Qual o material do relógio?",
    answer: "O Relógio Imperium é fabricado com Aço 904L de alta densidade, pulseira de Titânio (leve e resistente), vidro de Cristal de Safira e movimento Automático com máquina base ETA2840 suíça, garantindo precisão e durabilidade."
  },
  {
    question: "O que vem na caixa?",
    answer: "O pacote inclui: Relógio Imperium, Caixa Personalizada elegante (BRINDE), Cartão de Garantia de 2 anos, Ajustador de Pulseira (BRINDE), Certificado de Autenticidade e uma Carteira de Couro de brinde!"
  },
  {
    question: "Qual o tamanho do relógio?",
    answer: "O Relógio Imperium possui diâmetro de 41mm, um tamanho ideal que se destaca no pulso sem ser exagerado. A pulseira de titânio é ajustável com o ajustador incluso no pacote."
  },
  {
    question: "O movimento é automático?",
    answer: "Sim! O Relógio Imperium utiliza movimento Automático com Máquina Base ETA2840 suíça, oferecendo precisão e confiabilidade excepcionais. Não necessita de bateria — funciona com o movimento natural do pulso."
  },
  {
    question: "Como rastreio meu pedido?",
    answer: "Após o pedido sair para entrega, você receberá o código de rastreio por e-mail e WhatsApp. O produto é enviado via Transportadora Shopee, garantindo segurança e rapidez."
  },
  {
    question: "A loja é confiável?",
    answer: "Somos a Shopee Oficial, a loja verificada da própria plataforma! Temos mais de 127 mil pedidos entregues, 98% de avaliações positivas e mais de 15 milhões de seguidores."
  },
  {
    question: "Posso cancelar meu pedido?",
    answer: "Sim! Você pode cancelar antes do envio sem custo. Após o envio, pode recusar o recebimento ou solicitar devolução em até 7 dias. O reembolso é processado em até 48 horas."
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim! Emitimos nota fiscal eletrônica (NF-e) em todas as compras. A nota é enviada automaticamente para seu e-mail após a confirmação do pagamento."
  },
];

const WatchChatPopup = ({ open, onOpenChange }: WatchChatPopupProps) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      type: "bot",
      text: "Olá! 👋 Bem-vindo à Shopee Oficial! Como posso ajudar com o Relógio Imperium? Selecione uma das opções abaixo."
    }
  ]);
  const [showQuestions, setShowQuestions] = useState(true);

  const handleQuestionClick = (question: string, answer: string) => {
    const userMessage: Message = { id: messages.length, type: "user", text: question };
    const botMessage: Message = { id: messages.length + 1, type: "bot", text: answer };
    setMessages(prev => [...prev, userMessage, botMessage]);
    setShowQuestions(false);
    setTimeout(() => setShowQuestions(true), 500);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md p-0 gap-0 h-[80vh] max-h-[550px] flex flex-col overflow-hidden">
        <div className="bg-primary p-4 flex items-center gap-3">
          <div className="relative">
            <img src={shopeeLogo} alt="Shopee Oficial" className="w-10 h-10 rounded-full object-cover border-2 border-white bg-white p-1" />
            <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex-1">
            <h3 className="text-white font-medium text-sm flex items-center gap-1">
              Shopee Oficial
              <VerifiedBadge size="sm" />
            </h3>
            <p className="text-white/80 text-xs flex items-center gap-1">
              <span className="w-2 h-2 bg-green-400 rounded-full"></span>
              Online agora
            </p>
          </div>
          <button onClick={() => onOpenChange(false)} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] ${message.type === "user" ? "order-1" : "order-2"}`}>
                {message.type === "bot" && (
                  <div className="flex items-center gap-2 mb-1">
                    <img src={shopeeLogo} alt="Shopee Oficial" className="w-6 h-6 rounded-full object-cover bg-white p-0.5" />
                    <span className="text-xs text-muted-foreground">Resposta Automática - Shopee Oficial</span>
                  </div>
                )}
                <div className={`rounded-2xl px-3 py-2 ${message.type === "user" ? "bg-primary text-white rounded-br-md" : "bg-white text-foreground rounded-bl-md shadow-sm border border-border"}`}>
                  <p className="text-[13px] leading-relaxed">{message.text}</p>
                </div>
                {message.type === "user" && (
                  <p className="text-[10px] text-muted-foreground text-right mt-1">Você</p>
                )}
              </div>
            </div>
          ))}

          {showQuestions && (
            <div className="space-y-2 pt-2">
              <p className="text-[11px] text-muted-foreground text-center mb-2">Selecione uma pergunta:</p>
              <div className="grid grid-cols-1 gap-1.5">
                {faqData.map((faq, index) => (
                  <button key={index} onClick={() => handleQuestionClick(faq.question, faq.answer)}
                    className="bg-white border border-primary/30 text-primary text-[11px] px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-colors shadow-sm text-left">
                    {faq.question}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="p-3 border-t border-border bg-white">
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center">
              <input type="text" placeholder="Selecione uma pergunta acima..." className="bg-transparent text-sm w-full outline-none text-muted-foreground" disabled />
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

export default WatchChatPopup;
