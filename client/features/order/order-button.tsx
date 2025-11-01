"use client";

import React from "react";
import { OrderDialog } from "./order-dialog";
import { OrderSheet } from "./order-sheet";

interface OrderButtonProps {
  businessId: string;
  useSheet?: boolean; // switch between dialog and sheet
  variant?: "menu" | "service";
}

export const OrderButton: React.FC<OrderButtonProps> = ({
  businessId,
  useSheet = false,
  variant = "menu",
}) => {
  return useSheet ? (
    <OrderSheet businessId={businessId} variant={variant} />
  ) : (
    <OrderDialog businessId={businessId} variant={variant} />
  );
};
