package com.shopbilling.controller;

import com.shopbilling.service.InvoiceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping("/{saleId}/pdf")
    public ResponseEntity<byte[]> getInvoicePdf(@PathVariable Long saleId) {
        byte[] pdf = invoiceService.generateInvoicePdf(saleId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_PDF);
        headers.setContentDispositionFormData("filename", "invoice-" + saleId + ".pdf");
        
        return ResponseEntity.ok()
                .headers(headers)
                .body(pdf);
    }
}
