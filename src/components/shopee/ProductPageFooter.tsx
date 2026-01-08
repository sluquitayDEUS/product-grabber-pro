import { Link } from "react-router-dom";
import { Mail, Building2 } from "lucide-react";

const ProductPageFooter = () => {
  return (
    <footer className="bg-[#EE4D2D] text-white py-3 px-4 mb-14">
      {/* Links */}
      <div className="flex justify-center gap-4 text-xs mb-2">
        <Link to="/politica-privacidade" className="hover:underline">
          Privacidade
        </Link>
        <span className="opacity-50">|</span>
        <Link to="/termos-condicoes" className="hover:underline">
          Termos
        </Link>
        <span className="opacity-50">|</span>
        <Link to="/politica-reembolso" className="hover:underline">
          Reembolso
        </Link>
      </div>

      {/* Contact & Legal */}
      <div className="flex flex-col items-center gap-0.5 text-[10px] text-white/80">
        <div className="flex items-center gap-1">
          <Mail className="w-3 h-3" />
          <span>ajuda@suporte.shoppebr.com.br</span>
        </div>
        <div className="flex items-center gap-1">
          <Building2 className="w-3 h-3" />
          <span>CNPJ: 54.289.446/0001-07</span>
        </div>
      </div>
    </footer>
  );
};

export default ProductPageFooter;
