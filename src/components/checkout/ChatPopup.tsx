import { useState } from "react";
import { MessageCircle, X, ChevronRight, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChatPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const faqData = [
  {
    question: "Este site é seguro?",
    answer: "Sim! Sua compra é 100% segura. Este produto é vendido e enviado pela Shopee Oficial, que oferece a Garantia Shopee em todas as transações. Seus dados são protegidos com criptografia de ponta a ponta, e você só libera o pagamento após confirmar o recebimento."
  },
  {
    question: "Qual o prazo de entrega?",
    answer: "O prazo de entrega varia de acordo com sua região. Em média, entregas para capitais levam de 3 a 7 dias úteis, enquanto para outras cidades pode levar de 7 a 15 dias úteis. Após o envio pela Shopee Oficial, você receberá o código de rastreamento."
  },
  {
    question: "O produto tem garantia?",
    answer: "Sim! O produto possui 90 dias de garantia contra defeitos de fabricação pela Shopee Oficial. Além disso, você tem 7 dias após o recebimento para solicitar a devolução, conforme o Código de Defesa do Consumidor."
  },
  {
    question: "Como funciona o Pix?",
    answer: "Ao escolher Pix como forma de pagamento, você receberá um QR Code para escanear ou um código para copiar e colar. O pagamento é processado instantaneamente e seu pedido é confirmado em segundos. Com Pix, você ainda ganha 12% de desconto!"
  },
  {
    question: "Posso parcelar minha compra?",
    answer: "Sim! Aceitamos cartões de crédito com parcelamento em até 12x. As parcelas são calculadas automaticamente no checkout, e você pode escolher a quantidade que melhor se encaixa no seu orçamento."
  },
  {
    question: "O produto é original?",
    answer: "Absolutamente! A Shopee Oficial trabalha apenas com produtos originais de alta qualidade. Todos os produtos passam por rigoroso controle de qualidade antes do envio."
  },
  {
    question: "Como faço para trocar ou devolver?",
    answer: "É muito simples! Entre em contato pelo chat da Shopee Oficial em até 7 dias após o recebimento. Nossa equipe irá gerar uma etiqueta de devolução gratuita. Após recebermos o produto, processamos a troca ou reembolso em até 48 horas."
  },
  {
    question: "Vocês emitem nota fiscal?",
    answer: "Sim! A Shopee Oficial emite nota fiscal eletrônica (NF-e) em todos os pedidos. A nota é enviada automaticamente para seu e-mail após a confirmação do pagamento."
  },
  {
    question: "O frete é grátis mesmo?",
    answer: "Sim! A Shopee Oficial oferece frete grátis para todo o Brasil! O frete é enviado pela Transportadora Shopee, e você pode acompanhar todo o trajeto pelo código de rastreamento."
  },
  {
    question: "Posso retirar pessoalmente?",
    answer: "No momento, a Shopee Oficial trabalha apenas com entregas para atender clientes de todo o Brasil com a mesma qualidade e agilidade. Frete grátis e prazo super rápido!"
  }
];

const ChatPopup = ({ open, onOpenChange }: ChatPopupProps) => {
  const [selectedQuestion, setSelectedQuestion] = useState<number | null>(null);

  const handleClose = () => {
    setSelectedQuestion(null);
    onOpenChange(false);
  };

  const handleBack = () => {
    setSelectedQuestion(null);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[80vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-4 border-b border-border bg-primary text-primary-foreground">
          <div className="flex items-center gap-3">
            {selectedQuestion !== null && (
              <button onClick={handleBack} className="p-1">
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <MessageCircle className="w-5 h-5" />
            <DialogTitle className="text-primary-foreground">
              {selectedQuestion !== null ? "Resposta" : "Central de Ajuda"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
          {selectedQuestion === null ? (
            <div className="p-4">
              <p className="text-sm text-muted-foreground mb-4">
                Olá! Como posso ajudar? Selecione uma pergunta abaixo:
              </p>
              <div className="space-y-2">
                {faqData.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestion(index)}
                    className="w-full flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors text-left"
                  >
                    <span className="text-sm text-foreground">{item.question}</span>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="bg-muted/30 rounded-lg p-3 mb-4">
                <p className="text-sm font-medium text-foreground">
                  {faqData[selectedQuestion].question}
                </p>
              </div>
              <div className="bg-primary/10 rounded-lg p-4">
                <p className="text-sm text-foreground leading-relaxed">
                  {faqData[selectedQuestion].answer}
                </p>
              </div>
              <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <p className="text-xs text-green-700 dark:text-green-400 text-center">
                  ✅ Atendimento disponível 24h pelo chat da Shopee
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChatPopup;
