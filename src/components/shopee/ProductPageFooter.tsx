import { Link } from "react-router-dom";
import { Mail, Building2, MapPin, ChevronUp } from "lucide-react";

const ProductPageFooter = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#222222] text-white pt-4 pb-14 px-4">
      {/* Links de políticas */}
      <div className="flex justify-center items-center gap-3 text-xs mb-4 border-b border-white/20 pb-4">
        <Link to="/politica-privacidade" className="hover:underline text-white/90">
          Privacidade
        </Link>
        <span className="text-white/40">|</span>
        <Link to="/termos-condicoes" className="hover:underline text-white/90">
          Termos
        </Link>
        <span className="text-white/40">|</span>
        <Link to="/politica-reembolso" className="hover:underline text-white/90">
          Reembolso
        </Link>
      </div>

      {/* Informações de contato e empresa */}
      <div className="flex flex-col items-center gap-2 text-[11px] text-white/70">
        <div className="flex items-center gap-1.5">
          <Mail className="w-3.5 h-3.5" />
          <span>ajuda@suporte.shoppebr.com.br</span>
        </div>
        
        <div className="flex items-center gap-1.5">
          <Building2 className="w-3.5 h-3.5" />
          <span>CNPJ: 35.635.824/0001-12</span>
        </div>
        
        <div className="flex items-start gap-1.5 text-center">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
          <span>Av. Brigadeiro Faria Lima, 3732 - 22º e 23º andares, Itaim Bibi, São Paulo (SP), 04538-132</span>
        </div>
      </div>

      {/* Botão de voltar ao topo */}
      <div className="flex justify-center mt-4">
        <button 
          onClick={scrollToTop}
          className="w-8 h-8 rounded-full border border-white/30 flex items-center justify-center hover:bg-white/10 transition-colors"
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="w-5 h-5 text-white/80" />
        </button>
      </div>

      {/* Copyright */}
      <p className="text-center text-[10px] text-white/50 mt-3">
        © 2024 Shopee. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default ProductPageFooter;
