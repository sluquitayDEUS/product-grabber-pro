import { ArrowLeft, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PoliticaPrivacidade = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#EE4D2D] text-white px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h1 className="font-medium">Política de Privacidade</h1>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 text-sm text-foreground/80">
        <section>
          <h2 className="font-bold text-foreground mb-2">1. Informações que Coletamos</h2>
          <p className="mb-2">Coletamos informações que você nos fornece diretamente, incluindo:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Nome completo e dados de contato</li>
            <li>Endereço de entrega</li>
            <li>CPF para emissão de nota fiscal</li>
            <li>Informações de pagamento</li>
            <li>Histórico de compras</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">2. Como Usamos suas Informações</h2>
          <p>Utilizamos suas informações para:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Processar e entregar seus pedidos</li>
            <li>Enviar atualizações sobre seu pedido</li>
            <li>Fornecer suporte ao cliente</li>
            <li>Melhorar nossos serviços</li>
            <li>Cumprir obrigações legais</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">3. Compartilhamento de Dados</h2>
          <p>Seus dados podem ser compartilhados com:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Transportadoras para entrega</li>
            <li>Processadores de pagamento</li>
            <li>Autoridades quando exigido por lei</li>
          </ul>
          <p className="mt-2">Nunca vendemos seus dados pessoais a terceiros.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">4. Segurança dos Dados</h2>
          <p>Implementamos medidas de segurança técnicas e organizacionais para proteger suas informações, incluindo criptografia SSL em todas as transações.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">5. Seus Direitos (LGPD)</h2>
          <p>De acordo com a Lei Geral de Proteção de Dados, você tem direito a:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Acessar seus dados pessoais</li>
            <li>Corrigir dados incompletos ou desatualizados</li>
            <li>Solicitar a exclusão de seus dados</li>
            <li>Revogar consentimento a qualquer momento</li>
            <li>Solicitar portabilidade dos dados</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">6. Cookies</h2>
          <p>Utilizamos cookies para melhorar sua experiência de navegação, lembrar suas preferências e analisar o tráfego do site.</p>
        </section>

        <section>
          <h2 className="font-bold text-foreground mb-2">7. Contato</h2>
          <p>Para questões sobre privacidade, entre em contato:</p>
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

export default PoliticaPrivacidade;
