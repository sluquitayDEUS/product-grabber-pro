import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface AbandonedCartRequest {
  type: "credit_card_attempt" | "checkout_abandoned";
  customer: {
    name: string;
    email: string;
    document: string;
    phone?: string;
  };
  shipping: {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipcode: string;
  };
  product: {
    name: string;
    quantity: number;
    price: number;
  };
  totalAmount: number;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: AbandonedCartRequest = await req.json();
    
    const typeLabel = data.type === "credit_card_attempt" 
      ? "🔴 TENTATIVA CARTÃO DE CRÉDITO" 
      : "🟡 CARRINHO ABANDONADO";

    const phoneFormatted = data.customer.phone || "Não informado";
    const whatsappLink = data.customer.phone 
      ? `https://wa.me/55${data.customer.phone.replace(/\D/g, '')}` 
      : "Telefone não informado";

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #ee4d2d; border-bottom: 2px solid #ee4d2d; padding-bottom: 10px;">
          ${typeLabel}
        </h1>
        
        <h2 style="color: #333; margin-top: 25px;">📱 Dados do Cliente</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Nome:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.customer.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Email:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.customer.email}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>CPF:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.customer.document}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Telefone:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${phoneFormatted}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>WhatsApp:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">
              <a href="${whatsappLink}" style="color: #25D366; text-decoration: none;">
                ${data.customer.phone ? "Clique para abrir conversa" : "Não disponível"}
              </a>
            </td>
          </tr>
        </table>

        <h2 style="color: #333;">📍 Endereço de Entrega</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Rua:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.shipping.street}, ${data.shipping.number}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Complemento:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.shipping.complement || "Não informado"}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Bairro:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.shipping.neighborhood}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Cidade/Estado:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.shipping.city} - ${data.shipping.state}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>CEP:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.shipping.zipcode}</td>
          </tr>
        </table>

        <h2 style="color: #333;">🛒 Produto</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Produto:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.product.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Quantidade:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">${data.product.quantity}</td>
          </tr>
          <tr style="background: #f9f9f9;">
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Preço Unitário:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd;">R$ ${data.product.price.toFixed(2).replace('.', ',')}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #ddd;"><strong>Total:</strong></td>
            <td style="padding: 10px; border: 1px solid #ddd; color: #ee4d2d; font-weight: bold;">
              R$ ${(data.totalAmount / 100).toFixed(2).replace('.', ',')}
            </td>
          </tr>
        </table>

        <p style="color: #666; font-size: 12px; text-align: center; margin-top: 30px;">
          Email enviado automaticamente pelo sistema de recuperação de carrinho abandonado.
        </p>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "AquaVolt <onboarding@resend.dev>",
        to: ["pablo2018rr@gmail.com"],
        subject: `${typeLabel} - ${data.customer.name}`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();

    console.log("Abandoned cart email sent:", emailResult);

    return new Response(JSON.stringify({ success: true, emailResult }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error sending abandoned cart email:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
