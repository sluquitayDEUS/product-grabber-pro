import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { 
  Lock, 
  LogOut, 
  Phone, 
  Mail, 
  MapPin, 
  ShoppingCart, 
  CreditCard, 
  AlertCircle,
  CheckCircle,
  Trash2,
  MessageCircle,
  Loader2,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AbandonedCart {
  id: string;
  type: string;
  customer_name: string;
  customer_email: string;
  customer_document: string;
  customer_phone: string | null;
  shipping_street: string;
  shipping_number: string;
  shipping_complement: string | null;
  shipping_neighborhood: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zipcode: string;
  product_name: string;
  product_quantity: number;
  product_price: number;
  total_amount: number;
  contacted: boolean;
  notes: string | null;
  created_at: string;
}

const AdminPanel = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [sessionToken, setSessionToken] = useState<string | null>(null);
  const [carts, setCarts] = useState<AbandonedCart[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCart, setSelectedCart] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("admin_session");
    if (token) {
      setSessionToken(token);
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("admin-api", {
        body: { password },
        headers: { "Content-Type": "application/json" },
      });

      // Handle the query parameter manually
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erro ao fazer login");
      }

      localStorage.setItem("admin_session", result.sessionToken);
      setSessionToken(result.sessionToken);
      setIsAuthenticated(true);
      setPassword("");
      toast({ title: "Login realizado com sucesso!" });
    } catch (error) {
      toast({
        title: "Erro",
        description: error instanceof Error ? error.message : "Senha incorreta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCarts = useCallback(async () => {
    if (!sessionToken) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=list`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          handleLogout();
          return;
        }
        throw new Error(result.error);
      }

      setCarts(result.carts || []);
    } catch (error) {
      toast({
        title: "Erro ao carregar dados",
        description: error instanceof Error ? error.message : "Tente novamente",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [sessionToken, toast]);

  useEffect(() => {
    if (isAuthenticated && sessionToken) {
      fetchCarts();
    }
  }, [isAuthenticated, sessionToken, fetchCarts]);

  const handleLogout = () => {
    localStorage.removeItem("admin_session");
    setSessionToken(null);
    setIsAuthenticated(false);
    setCarts([]);
  };

  const markAsContacted = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=contact`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id, notes }),
        }
      );

      if (!response.ok) throw new Error("Erro ao atualizar");

      setCarts(carts.map(c => c.id === id ? { ...c, contacted: true, notes } : c));
      setSelectedCart(null);
      setNotes("");
      toast({ title: "Marcado como contatado!" });
    } catch (error) {
      toast({ title: "Erro", variant: "destructive" });
    }
  };

  const deleteCart = async (id: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/admin-api?action=delete`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${sessionToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id }),
        }
      );

      if (!response.ok) throw new Error("Erro ao deletar");

      setCarts(carts.filter(c => c.id !== id));
      toast({ title: "Removido com sucesso!" });
    } catch (error) {
      toast({ title: "Erro ao remover", variant: "destructive" });
    }
  };

  const openWhatsApp = (phone: string, name: string) => {
    const cleanPhone = phone.replace(/\D/g, "");
    const message = encodeURIComponent(
      `Olá ${name}! Vi que você se interessou pelo Aquavolt - Kart Aquático. Posso te ajudar a finalizar sua compra?`
    );
    window.open(`https://wa.me/55${cleanPhone}?text=${message}`, "_blank");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-primary mb-4" />
            <CardTitle>Painel Admin</CardTitle>
            <p className="text-sm text-muted-foreground">Carrinhos Abandonados</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              type="password"
              placeholder="Senha de acesso"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <Button 
              onClick={handleLogin} 
              className="w-full" 
              disabled={isLoading || !password}
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Entrar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const pendingCarts = carts.filter(c => !c.contacted);
  const contactedCarts = carts.filter(c => c.contacted);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Carrinhos Abandonados</h1>
            <p className="text-sm text-gray-500">
              {pendingCarts.length} pendentes • {contactedCarts.length} contatados
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={fetchCarts} disabled={isLoading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
              Atualizar
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{carts.length}</p>
                  <p className="text-xs text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{pendingCarts.length}</p>
                  <p className="text-xs text-muted-foreground">Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {carts.filter(c => c.type === "credit_card_attempt").length}
                  </p>
                  <p className="text-xs text-muted-foreground">Cartão</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{contactedCarts.length}</p>
                  <p className="text-xs text-muted-foreground">Contatados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Cart List */}
        {isLoading && carts.length === 0 ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
            <p className="mt-2 text-muted-foreground">Carregando...</p>
          </div>
        ) : carts.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <ShoppingCart className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">Nenhum carrinho abandonado ainda</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {carts.map((cart) => (
              <Card 
                key={cart.id} 
                className={`${cart.contacted ? "opacity-60" : ""} ${
                  cart.type === "credit_card_attempt" ? "border-l-4 border-l-red-500" : "border-l-4 border-l-yellow-500"
                }`}
              >
                <CardContent className="pt-4">
                  <div className="flex flex-col md:flex-row md:items-start gap-4">
                    {/* Customer Info */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold text-lg">{cart.customer_name}</h3>
                        <Badge variant={cart.type === "credit_card_attempt" ? "destructive" : "secondary"}>
                          {cart.type === "credit_card_attempt" ? "Cartão" : "Abandonado"}
                        </Badge>
                        {cart.contacted && (
                          <Badge variant="outline" className="text-green-600 border-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Contatado
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="w-4 h-4" />
                          {cart.customer_email}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4" />
                          {cart.customer_phone || "Não informado"}
                        </div>
                        <div className="flex items-center gap-2 text-gray-600 md:col-span-2">
                          <MapPin className="w-4 h-4" />
                          {cart.shipping_street}, {cart.shipping_number} - {cart.shipping_neighborhood}, {cart.shipping_city}/{cart.shipping_state}
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-500">
                          CPF: {cart.customer_document}
                        </span>
                        <span className="text-gray-500">
                          CEP: {cart.shipping_zipcode}
                        </span>
                      </div>

                      <div className="pt-2 border-t">
                        <p className="text-sm">
                          <strong>{cart.product_name}</strong> × {cart.product_quantity}
                        </p>
                        <p className="text-lg font-bold text-primary">
                          R$ {(cart.total_amount / 100).toFixed(2).replace(".", ",")}
                        </p>
                      </div>

                      <p className="text-xs text-gray-400">
                        {new Date(cart.created_at).toLocaleString("pt-BR")}
                      </p>

                      {cart.notes && (
                        <p className="text-sm bg-gray-100 p-2 rounded">
                          <strong>Notas:</strong> {cart.notes}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {cart.customer_phone && (
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={() => openWhatsApp(cart.customer_phone!, cart.customer_name)}
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          WhatsApp
                        </Button>
                      )}

                      {!cart.contacted && (
                        <>
                          {selectedCart === cart.id ? (
                            <div className="space-y-2">
                              <Textarea
                                placeholder="Adicionar notas..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="text-sm"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => setSelectedCart(null)}
                                >
                                  Cancelar
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => markAsContacted(cart.id)}
                                >
                                  Salvar
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedCart(cart.id)}
                            >
                              <CheckCircle className="w-4 h-4 mr-2" />
                              Marcar contatado
                            </Button>
                          )}
                        </>
                      )}

                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteCart(cart.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Remover
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
