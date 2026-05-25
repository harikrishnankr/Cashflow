import { notFound } from "next/navigation";
import { TransactionEditView } from "@/components/features/transaction";

interface Props {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ type?: string }>;
}

export default async function TransactionEditPage({ params, searchParams }: Props) {
  const { id } = await params;
  const { type } = await searchParams;

  const numId = parseInt(id, 10);
  if (isNaN(numId) || numId <= 0) notFound();

  const transactionType = type === "income" ? "income" : "expense";

  return <TransactionEditView id={numId} type={transactionType} />;
}
