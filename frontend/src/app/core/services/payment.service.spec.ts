import { TestBed } from '@angular/core/testing';
import { PaymentService, PaymentItem } from './payment.service';

describe('PaymentService', () => {
  let service: PaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('calculateTally', () => {
    it('should correctly sum exact payments', () => {
      const payments: PaymentItem[] = [
        { paymentMethod: 'CASH', amount: 500 },
        { paymentMethod: 'CARD', amount: 300 },
        { paymentMethod: 'UPI', amount: 200 }
      ];
      const tally = service.calculateTally(1000, payments);
      expect(tally.totalPaid).toBe(1000);
      expect(tally.remaining).toBe(0);
      expect(tally.changeDue).toBe(0);
    });

    it('should handle partial payments (underpay)', () => {
      const payments: PaymentItem[] = [
        { paymentMethod: 'CASH', amount: 400 },
        { paymentMethod: 'CARD', amount: 300 }
      ];
      const tally = service.calculateTally(1000, payments);
      expect(tally.totalPaid).toBe(700);
      expect(tally.remaining).toBe(300);
      expect(tally.changeDue).toBe(0);
    });

    it('should track change due from cash payments', () => {
      const payments: PaymentItem[] = [
        { paymentMethod: 'CASH', amount: 500, changeDue: 100 },
        { paymentMethod: 'UPI', amount: 500 }
      ];
      const tally = service.calculateTally(1000, payments);
      expect(tally.totalPaid).toBe(1000);
      expect(tally.remaining).toBe(0);
      expect(tally.changeDue).toBe(100);
    });
  });

  describe('validatePayment', () => {
    it('should reject non-positive amounts', () => {
      const res = service.validatePayment('CASH', 0, 1000);
      expect(res.isValid).toBeFalse();
      expect(res.error).toBe('Amount must be greater than zero.');
    });

    it('should prevent non-cash payments from exceeding remaining balance', () => {
      const res = service.validatePayment('CARD', 600, 500);
      expect(res.isValid).toBeFalse();
      expect(res.error).toBe('Payment amount cannot exceed the remaining balance.');
    });

    it('should allow non-cash payment exactly matching remaining balance', () => {
      const res = service.validatePayment('CARD', 500, 500);
      expect(res.isValid).toBeTrue();
      expect(res.adjustedAmount).toBe(500);
    });

    it('should validate cash payment with change due within remaining limit', () => {
      const res = service.validatePayment('CASH', 400, 1000, 500);
      expect(res.isValid).toBeTrue();
      expect(res.adjustedAmount).toBe(400);
      expect(res.changeDue).toBe(100);
    });

    it('should adjust cash payment exceeding remaining balance, returning change due', () => {
      const res = service.validatePayment('CASH', 1200, 1000, 1200);
      expect(res.isValid).toBeTrue();
      expect(res.adjustedAmount).toBe(1000);
      expect(res.changeDue).toBe(200);
    });

    it('should reject cash payment when tendered is less than amount', () => {
      const res = service.validatePayment('CASH', 500, 1000, 400);
      expect(res.isValid).toBeFalse();
      expect(res.error).toBe('Cash tendered cannot be less than the payment amount.');
    });
  });
});
