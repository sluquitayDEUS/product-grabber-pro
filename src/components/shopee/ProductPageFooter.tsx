import { Link } from "react-router-dom";
import { Mail, Building2, MapPin, CreditCard } from "lucide-react";
import seloReclameAqui from "@/assets/selo-reclame-aqui.png";
import seloSiteSeguro from "@/assets/selo-site-seguro.png";

const ProductPageFooter = () => {
  return (
    <footer className="bg-[#222222] text-white pt-4 pb-16 px-4">
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
      <div className="flex flex-col items-center gap-2 text-[11px] text-white/70 mb-4">
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

      {/* Formas de pagamento */}
      <div className="border-t border-white/20 pt-4 mb-4">
        <p className="text-center text-[10px] text-white/60 mb-2">Formas de pagamento</p>
        <div className="flex justify-center items-center gap-2">
          {/* Pix */}
          <div className="bg-white rounded px-2 py-1 flex items-center gap-1">
            <svg viewBox="0 0 512 512" className="w-5 h-5">
              <path fill="#32BCAD" d="M112.57 391.19c20.056 0 38.928-7.808 53.12-22l76.693-76.692c5.385-5.404 14.765-5.384 20.15 0l76.989 76.989c14.191 14.191 33.063 22 53.119 22h15.098l-97.138-97.139c-30.326-30.344-79.705-30.344-110.03 0l-97.139 97.139h9.138z"/>
              <path fill="#32BCAD" d="M401.051 228.776l-97.139 97.139c-14.191 14.191-33.063 22-53.119 22-20.056 0-38.928-7.808-53.12-22l-76.693-76.693c-5.385-5.404-14.765-5.404-20.15 0l-76.989 76.99c-14.191 14.19-33.063 21.999-53.119 21.999h-15.098l97.138 97.14c30.326 30.343 79.705 30.343 110.03 0l97.139-97.14 97.14 97.14c30.325 30.343 79.704 30.343 110.029 0l97.14-97.14-15.099.001c-20.055 0-38.927-7.809-53.119-22l-76.99-76.99c-5.404-5.384-14.765-5.384-20.15 0l-76.693 76.693c-14.191 14.192-33.063 22-53.119 22s-38.928-7.808-53.12-22l-97.138-97.14z"/>
              <path fill="#32BCAD" d="M391.628 120.81c-14.192-14.192-33.064-22-53.12-22h-9.138l97.139 97.139c30.326 30.344 30.326 79.705 0 110.03l-97.139 97.139h15.098c20.056 0 38.928-7.808 53.119-22l76.99-76.989c5.385-5.385 14.746-5.385 20.15 0l76.693 76.692c14.192 14.192 33.064 22 53.12 22h9.138l-97.139-97.139c-30.326-30.344-30.326-79.705 0-110.03l97.139-97.139h-15.098c-20.056 0-38.928 7.808-53.119 22l-76.99 76.989c-5.404 5.404-14.765 5.404-20.15 0l-76.693-76.692z"/>
            </svg>
            <span className="text-[10px] text-gray-700 font-medium">Pix</span>
          </div>
          {/* Visa */}
          <div className="bg-white rounded px-2 py-1">
            <svg viewBox="0 0 48 48" className="w-6 h-4">
              <path fill="#1565C0" d="M15.186 19l-2.626 7.832c0 0-1.218-6.039-1.446-7.08-.276-1.219-1.106-1.752-2.072-1.752H2.127l-.088.416c0 0 2.346.489 4.575 2.118 2.155 1.576 3.476 4.298 3.476 4.298L15.186 19zM17.689 30l2.798-11h-3.397l-2.798 11H17.689zM28.993 18.789c-1.06 0-1.88.312-2.461.66l.362-1.723h-3.335L21.21 30h3.564l.901-4.279c.373-1.771 1.364-2.88 2.572-2.88.816 0 1.132.545 1.132 1.32 0 .362-.055.797-.165 1.254L28.18 30h3.564l1.135-5.407c.165-.797.276-1.749.276-2.402 0-2.072-1.06-3.402-3.162-3.402zM39.616 19c-2.017 0-3.586.912-4.619 2.346l3.002 0c.627-.962 1.749-1.346 2.909-1.346 1.408 0 2.017.527 2.017 1.397 0 .294-.055.599-.11.892l-.22 1.049h-1.804c-3.751 0-6.098 1.683-6.098 4.564 0 1.903 1.342 3.098 3.476 3.098 1.452 0 2.609-.645 3.291-1.529l-.193.922h3.227l1.254-5.957c.11-.527.165-1.022.165-1.474C45.913 20.495 43.532 19 39.616 19zM40.045 27.16c-.055.252-.165.505-.276.712-.527.962-1.408 1.485-2.461 1.485-.904 0-1.485-.437-1.485-1.21 0-1.199.96-1.972 2.909-1.972h1.528L40.045 27.16z"/>
            </svg>
          </div>
          {/* Mastercard */}
          <div className="bg-white rounded px-2 py-1">
            <svg viewBox="0 0 48 48" className="w-6 h-4">
              <circle cx="16" cy="24" r="12" fill="#EB001B"/>
              <circle cx="32" cy="24" r="12" fill="#F79E1B"/>
              <path fill="#FF5F00" d="M24 14.5c3.037 2.46 4.982 6.193 4.982 10.5s-1.945 8.04-4.982 10.5c-3.037-2.46-4.982-6.193-4.982-10.5s1.945-8.04 4.982-10.5z"/>
            </svg>
          </div>
          {/* Elo */}
          <div className="bg-white rounded px-2 py-1 flex items-center">
            <span className="text-[10px] font-bold text-black">elo</span>
          </div>
          {/* Cartão genérico */}
          <div className="bg-white rounded px-2 py-1 flex items-center">
            <CreditCard className="w-4 h-4 text-gray-600" />
          </div>
        </div>
      </div>

      {/* Selos de confiança */}
      <div className="flex justify-center items-center gap-3 mb-4">
        <img 
          src={seloReclameAqui} 
          alt="Selo Reclame Aqui" 
          className="h-10 object-contain"
        />
        <img 
          src={seloSiteSeguro} 
          alt="Site Seguro" 
          className="h-10 object-contain"
        />
      </div>

      {/* Copyright */}
      <p className="text-center text-[10px] text-white/50 mt-3">
        © 2024 Shopee. Todos os direitos reservados.
      </p>
    </footer>
  );
};

export default ProductPageFooter;
