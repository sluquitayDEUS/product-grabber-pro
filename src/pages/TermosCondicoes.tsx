import { ArrowLeft, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";

const TermosCondicoes = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#EE4D2D] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          <h1 className="font-medium">Termos e Condições</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 text-sm text-foreground/80">
        <section>
          <h2 className="font-bold text-foreground mb-2">1. Aceitação dos Termos</h2>
          <p>Ao acessar e usar este site, você concorda em cumprir e estar vinculado a estes Termos e Condições de Uso. Se você não concordar com qualquer parte destes termos, não deve usar nosso site.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">2. Uso do Site</h2>
          <p>Você concorda em usar este site apenas para fins legais e de maneira que não infrinja os direitos de terceiros ou restrinja o uso do site por outras pessoas.</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Você deve ter 18 anos ou mais para realizar compras</li>
            <li>As informações fornecidas devem ser verdadeiras e atualizadas</li>
            <li>Você é responsável por manter a confidencialidade de sua conta</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">3. Produtos e Preços</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Os preços estão sujeitos a alterações sem aviso prévio</li>
            <li>As imagens são ilustrativas e podem variar do produto real</li>
            <li>Nos reservamos o direito de limitar quantidades</li>
            <li>Promoções têm prazo de validade determinado</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">4. Processo de Compra</h2>
          <p>Ao realizar uma compra:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Você receberá confirmação por e-mail</li>
            <li>O contrato é formado após confirmação do pagamento</li>
            <li>Reservamo-nos o direito de cancelar pedidos por indisponibilidade</li>
            <li>Em caso de cancelamento, o valor será integralmente reembolsado</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">5. Entrega</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Prazos de entrega são estimativas e podem variar</li>
            <li>Não nos responsabilizamos por atrasos causados por terceiros</li>
            <li>O frete é calculado de acordo com o CEP de destino</li>
            <li>É responsabilidade do cliente fornecer endereço correto</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">6. Propriedade Intelectual</h2>
          <p>Todo o conteúdo deste site, incluindo textos, imagens, logos e design, é protegido por direitos autorais e não pode ser reproduzido sem autorização prévia.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">7. Limitação de Responsabilidade</h2>
          <p>Não seremos responsáveis por danos indiretos, incidentais ou consequenciais decorrentes do uso deste site ou da impossibilidade de usá-lo.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">8. Modificações dos Termos</h2>
          <p>Reservamo-nos o direito de modificar estes termos a qualquer momento. As alterações entram em vigor imediatamente após a publicação.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">9. Lei Aplicável</h2>
          <p>Estes termos são regidos pelas leis da República Federativa do Brasil. Qualquer disputa será resolvida no foro da comarca do consumidor.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">10. Contato</h2>
          <p className="font-medium">ajuda@suporte.shoppebr.com.br</p>
          <p className="text-xs text-foreground/60 mt-1">CNPJ: 54.289.446/0001-07</p>
        </section>

        <p className="text-xs text-foreground/50 pt-4 border-t">
          Última atualização: Janeiro de 2026
        </p>
      </div>
    </div>
  );
};

export default TermosCondicoes;
