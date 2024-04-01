import { TransactionType } from "./transaction-type.enum";

export interface FinancialTransaction {

  _id?: string;

  type: TransactionType;

  amount: number;

  currency: string;

  concept: string;

  date: string;

  category?: string;

  location?: string;

  notes?: string;

}
