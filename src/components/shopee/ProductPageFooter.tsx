import { Link } from "react-router-dom";
import { Mail, Building2, Shield, FileText, RotateCcw } from "lucide-react";

const ProductPageFooter = () => {
  return (
    <footer className="bg-[#1A1A1A] text-white/80 py-6 px-4 mt-4 mb-14">
      {/* Links Section */}
      <div className="flex justify-center gap-6 mb-4 text-sm">
        <Link 
          to="/politica-privacidade" 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <Shield className="w-4 h-4" />
          <span>Privacidade</span>
        </Link>
        <Link 
          to="/termos-condicoes" 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Termos</span>
        </Link>
        <Link 
          to="/politica-reembolso" 
          className="flex items-center gap-1.5 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reembolso</span>
        </Link>
      </div>

      {/* Divider */}
      <div className="border-t border-white/10 my-4" />

      {/* Contact & Legal */}
      <div className="text-center space-y-2 text-xs text-white/60">
        <div className="flex items-center justify-center gap-2">
          <Mail className="w-3.5 h-3.5" />
          <a 
            href="mailto:ajuda@suporte.shoppebr.com.br" 
            className="hover:text-white transition-colors"
          >
            ajuda@suporte.shoppebr.com.br
          </a>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Building2 className="w-3.5 h-3.5" />
          <span>CNPJ: 54.289.446/0001-07</span>
        </div>
      </div>

      {/* Copyright */}
      <p className="text-center text-[10px] text-white/40 mt-4">
        © {new Date().getFullYear()} Todos os direitos reservados
      </p>
    </footer>
  );
};

export default ProductPageFooter;
