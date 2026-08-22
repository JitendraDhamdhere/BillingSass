import { Injectable } from '@angular/core';

export interface PaymentItem {
  paymentMethod: 'CASH' | 'UPI' | 'CARD';
  amount: number;         // Amount applied to the bill
  reference?: string;     // Reference code, terminal ref, or transaction ID
  cashTendered?: number;  // Tendered amount for Cash
  changeDue?: number;     // Change due for Cash
}

export interface PaymentTally {
  totalPaid: number;      // Sum of amounts applied to the bill
  remaining: number;      // Total bill - totalPaid (capped at 0)
  changeDue: number;      // Change due to customer from Cash payment(s)
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  /**
   * Calculates the current tally of payments against the total bill amount.
   */
  calculateTally(totalAmount: number, payments: PaymentItem[]): PaymentTally {
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    const changeDue = payments.reduce((sum, p) => sum + (p.changeDue || 0), 0);
    const remaining = Math.max(0, totalAmount - totalPaid);

    return {
      totalPaid: parseFloat(totalPaid.toFixed(2)),
      remaining: parseFloat(remaining.toFixed(2)),
      changeDue: parseFloat(changeDue.toFixed(2))
    };
  }

  /**
   * Validates a single payment input.
   * Prevents entering an amount greater than the remaining balance for non-cash methods.
   * For cash, calculates the change due if tendered is more than amount.
   */
  validatePayment(
    method: 'CASH' | 'UPI' | 'CARD',
    amount: number,
    remaining: number,
    cashTendered?: number
  ): { isValid: boolean; error?: string; adjustedAmount?: number; changeDue?: number } {
    if (amount <= 0) {
      return { isValid: false, error: 'Amount must be greater than zero.' };
    }

    if (method !== 'CASH' && amount > remaining) {
      return { isValid: false, error: 'Payment amount cannot exceed the remaining balance.' };
    }

    if (method === 'CASH') {
      const tendered = cashTendered !== undefined && cashTendered !== null ? cashTendered : amount;
      if (tendered < amount) {
        return { isValid: false, error: 'Cash tendered cannot be less than the payment amount.' };
      }

      // If Cash is used and the amount exceeds remaining, it's allowed.
      // The amount APPLIED to the bill is capped at the remaining balance,
      // and the excess becomes change due.
      if (amount > remaining) {
        return {
          isValid: true,
          adjustedAmount: remaining,
          changeDue: parseFloat((amount - remaining).toFixed(2))
        };
      }

      return {
        isValid: true,
        adjustedAmount: amount,
        changeDue: parseFloat((tendered - amount).toFixed(2))
      };
    }

    return {
      isValid: true,
      adjustedAmount: amount,
      changeDue: 0
    };
  }
}
