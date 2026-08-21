package com.shopbilling.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.shopbilling.entity.Sale;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.SaleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final SaleRepository saleRepository;

    public byte[] generateInvoicePdf(Long saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new EntityNotFoundException("Sale not found"));

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        document.add(new Paragraph("INVOICE").setBold().setFontSize(20));
        document.add(new Paragraph("Invoice Number: " + sale.getSaleNumber()));
        document.add(new Paragraph("Date: " + sale.getSaleDate()));
        
        if (sale.getCustomer() != null) {
            document.add(new Paragraph("Customer: " + sale.getCustomer().getName()));
        }

        document.add(new Paragraph("\n------------------------------------------------------------\n"));

        sale.getItems().forEach(item -> {
            document.add(new Paragraph(
                item.getProduct().getName() + " x " + item.getQuantity() + 
                " | Price: Rs. " + item.getSellingPrice() + 
                " | Total: Rs. " + item.getTotal()
            ));
        });

        document.add(new Paragraph("\n------------------------------------------------------------\n"));
        document.add(new Paragraph("Subtotal: Rs. " + sale.getSubtotal()));
        document.add(new Paragraph("Discount: Rs. " + sale.getDiscount()));
        document.add(new Paragraph("Tax: Rs. " + sale.getTax()));
        document.add(new Paragraph("Grand Total: Rs. " + sale.getGrandTotal()).setBold());

        document.close();
        return out.toByteArray();
    }
}
