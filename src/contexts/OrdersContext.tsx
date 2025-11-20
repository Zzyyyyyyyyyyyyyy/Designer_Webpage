import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled" | "refunded";

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_snapshot: {
    name: string;
    image: string;
    description?: string;
  };
  size: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  tax: number;
  shipping_fee: number;
  total: number;
  shipping_address: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  billing_address?: {
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  payment_method?: string;
  payment_id?: string;
  created_at: string;
  updated_at: string;
  shipped_at?: string;
  delivered_at?: string;
  items?: OrderItem[];
}

interface OrdersContextType {
  getOrders: () => Promise<Order[]>;
  getOrder: (orderId: string) => Promise<Order | null>;
  createOrder: (order: {
    items: Array<{
      product_id: string;
      size: string;
      quantity: number;
      unit_price: number;
    }>;
    shipping_address: Order["shipping_address"];
    billing_address?: Order["billing_address"];
    payment_method: string;
  }) => Promise<string | null>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  loading: boolean;
}

const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const getOrders = useCallback(async (): Promise<Order[]> => {
    if (!user) return [];

    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          *
        )
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    setLoading(false);

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    return (data || []).map((order: any) => ({
      id: order.id,
      user_id: order.user_id,
      status: order.status as OrderStatus,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      shipping_fee: parseFloat(order.shipping_fee),
      total: parseFloat(order.total),
      shipping_address: order.shipping_address,
      billing_address: order.billing_address,
      payment_method: order.payment_method,
      payment_id: order.payment_id,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      items: order.order_items
        ? order.order_items.map((item: any) => ({
            id: item.id,
            order_id: item.order_id,
            product_id: item.product_id,
            product_snapshot: item.product_snapshot,
            size: item.size,
            quantity: item.quantity,
            unit_price: parseFloat(item.unit_price),
            total_price: parseFloat(item.total_price),
            created_at: item.created_at,
          }))
        : [],
    }));
  }, [user]);

  const getOrder = useCallback(
    async (orderId: string): Promise<Order | null> => {
      if (!user) return null;

      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select(
          `
        *,
        order_items (
          *
        )
      `
        )
        .eq("id", orderId)
        .eq("user_id", user.id)
        .single();

      setLoading(false);

      if (error) {
        if (error.code === "PGRST116") return null;
        console.error("Error fetching order:", error);
        return null;
      }

      return {
        id: data.id,
        user_id: data.user_id,
        status: data.status as OrderStatus,
        subtotal: parseFloat(data.subtotal),
        tax: parseFloat(data.tax),
        shipping_fee: parseFloat(data.shipping_fee),
        total: parseFloat(data.total),
        shipping_address: data.shipping_address,
        billing_address: data.billing_address,
        payment_method: data.payment_method,
        payment_id: data.payment_id,
        created_at: data.created_at,
        updated_at: data.updated_at,
        shipped_at: data.shipped_at,
        delivered_at: data.delivered_at,
        items: data.order_items
          ? data.order_items.map((item: any) => ({
              id: item.id,
              order_id: item.order_id,
              product_id: item.product_id,
              product_snapshot: item.product_snapshot,
              size: item.size,
              quantity: item.quantity,
              unit_price: parseFloat(item.unit_price),
              total_price: parseFloat(item.total_price),
              created_at: item.created_at,
            }))
          : [],
      };
    },
    [user]
  );

  const createOrder = useCallback(
    async (order: {
      items: Array<{
        product_id: string;
        size: string;
        quantity: number;
        unit_price: number;
      }>;
      shipping_address: Order["shipping_address"];
      billing_address?: Order["billing_address"];
      payment_method: string;
    }): Promise<string | null> => {
      if (!user) {
        console.error("Must be authenticated to create orders");
        return null;
      }

      setLoading(true);

      // Calculate totals
      const subtotal = order.items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
      const tax = subtotal * 0.08; // 8% tax
      const shipping_fee = 10; // Fixed shipping fee
      const total = subtotal + tax + shipping_fee;

      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          status: "pending",
          subtotal,
          tax,
          shipping_fee,
          total,
          shipping_address: order.shipping_address,
          billing_address: order.billing_address || order.shipping_address,
          payment_method: order.payment_method,
        })
        .select()
        .single();

      if (orderError) {
        console.error("Error creating order:", orderError);
        setLoading(false);
        return null;
      }

      // Fetch product details and create order items
      const orderItemsPromises = order.items.map(async (item) => {
        // Get product snapshot
        const { data: product } = await supabase.from("posts").select("caption, images").eq("id", item.product_id).single();

        return {
          order_id: orderData.id,
          product_id: item.product_id,
          product_snapshot: {
            name: product?.caption || "Unknown Product",
            image: product?.images?.[0] || "",
            description: "",
          },
          size: item.size,
          quantity: item.quantity,
          unit_price: item.unit_price,
          total_price: item.unit_price * item.quantity,
        };
      });

      const orderItems = await Promise.all(orderItemsPromises);

      // Insert order items
      const { error: itemsError } = await supabase.from("order_items").insert(orderItems);

      setLoading(false);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Rollback order creation
        await supabase.from("orders").delete().eq("id", orderData.id);
        return null;
      }

      return orderData.id;
    },
    [user]
  );

  const updateOrderStatus = useCallback(
    async (orderId: string, status: OrderStatus) => {
      if (!user) return;

      setLoading(true);
      const updates: Record<string, unknown> = {
        status,
        updated_at: new Date().toISOString(),
      };

      if (status === "shipped") {
        updates.shipped_at = new Date().toISOString();
      } else if (status === "delivered") {
        updates.delivered_at = new Date().toISOString();
      }

      const { error } = await supabase.from("orders").update(updates).eq("id", orderId).eq("user_id", user.id);

      setLoading(false);

      if (error) {
        console.error("Error updating order status:", error);
        throw error;
      }
    },
    [user]
  );

  const cancelOrder = useCallback(
    async (orderId: string) => {
      if (!user) return;

      await updateOrderStatus(orderId, "cancelled");
    },
    [user, updateOrderStatus]
  );

  const value: OrdersContextType = {
    getOrders,
    getOrder,
    createOrder,
    updateOrderStatus,
    cancelOrder,
    loading,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
}

export function useOrders() {
  const context = useContext(OrdersContext);
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrdersProvider");
  }
  return context;
}
