import PaymentPage from "./PaymentPage";
import React from "react";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params; // Unwrap the Promise here
  return <PaymentPage id={id} />;
}
