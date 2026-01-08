import { ArrowLeft, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaReembolso = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#EE4D2D] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <RotateCcw className="w-5 h-5" />
          <h1 className="font-medium">Política de Reembolso</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 text-sm text-foreground/80">
        <section>
          <h2 className="font-bold text-foreground mb-2">1. Direito de Arrependimento</h2>
          <p>De acordo com o Código de Defesa do Consumidor (Art. 49), você pode desistir da compra em até <strong>7 dias corridos</strong> após o recebimento do produto, sem necessidade de justificativa.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">2. Condições para Devolução</h2>
          <p>Para exercer o direito de devolução, o produto deve estar:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Em sua embalagem original</li>
            <li>Sem sinais de uso</li>
            <li>Com todos os acessórios e manuais</li>
            <li>Acompanhado da nota fiscal</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">3. Como Solicitar Reembolso</h2>
          <p>Para iniciar o processo de reembolso:</p>
          <ol className="list-decimal pl-5 space-y-2 mt-2">
            <li>Entre em contato pelo e-mail <strong>ajuda@suporte.shoppebr.com.br</strong></li>
            <li>Informe o número do pedido e motivo da devolução</li>
            <li>Aguarde as instruções para envio do produto</li>
            <li>Envie o produto conforme orientações recebidas</li>
          </ol>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">4. Prazo para Reembolso</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Cartão de crédito:</strong> até 2 faturas subsequentes</li>
            <li><strong>PIX:</strong> até 7 dias úteis após recebimento do produto</li>
            <li><strong>Boleto:</strong> até 10 dias úteis após recebimento do produto</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">5. Custos de Devolução</h2>
          <p>Em caso de arrependimento dentro do prazo legal de 7 dias, os custos de envio para devolução serão por nossa conta.</p>
          <p className="mt-2">Para devoluções fora deste prazo ou por outros motivos, o frete pode ser cobrado do cliente.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">6. Produtos com Defeito</h2>
          <p>Se o produto apresentar defeito:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Até 7 dias:</strong> troca imediata ou reembolso integral</li>
            <li><strong>Até 30 dias:</strong> análise técnica e possível troca/reparo</li>
            <li><strong>Após 30 dias:</strong> sujeito à garantia do fabricante</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">7. Produtos Não Reembolsáveis</h2>
          <p>Não aceitamos devolução de:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Produtos personalizados</li>
            <li>Itens de higiene pessoal usados</li>
            <li>Produtos danificados por mau uso</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">8. Troca por Outro Produto</h2>
          <p>Se preferir trocar por outro produto de valor diferente:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Valor maior: você paga a diferença</li>
            <li>Valor menor: reembolsamos a diferença</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">9. Contato</h2>
          <p>Dúvidas sobre reembolso? Fale conosco:</p>
          <p className="mt-2 font-medium">ajuda@suporte.shoppebr.com.br</p>
          <p className="text-xs text-foreground/60 mt-1">CNPJ: 54.289.446/0001-07</p>
        </section>

        <p className="text-xs text-foreground/50 pt-4 border-t">
          Última atualização: Janeiro de 2026
        </p>
      </div>
    </div>
  );
};

export default PoliticaReembolso;
