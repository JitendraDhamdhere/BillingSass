package com.shopbilling.service;

import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Table;
import com.itextpdf.layout.element.Cell;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.HorizontalAlignment;
import com.itextpdf.layout.properties.UnitValue;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.layout.borders.Border;
import com.itextpdf.layout.borders.SolidBorder;
import com.shopbilling.entity.Sale;
import com.shopbilling.entity.ShopSettings;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.SaleRepository;
import com.shopbilling.repository.ShopSettingsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URL;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class InvoiceService {

    private final SaleRepository saleRepository;
    private final ShopSettingsRepository shopSettingsRepository;

    public byte[] generateInvoicePdf(Long saleId) {
        Sale sale = saleRepository.findById(saleId)
                .orElseThrow(() -> new EntityNotFoundException("Sale not found"));

        ShopSettings settings = shopSettingsRepository.findById(1L).orElse(null);

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        PdfWriter writer = new PdfWriter(out);
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);
        document.setMargins(30, 36, 30, 36);

        // Styling Colors
        DeviceRgb primaryColor = new DeviceRgb(30, 58, 138); // Dark Blue (#1e3a8a)
        DeviceRgb headerBg = new DeviceRgb(243, 244, 246); // Light Gray (#f3f4f6)
        DeviceRgb borderGray = new DeviceRgb(229, 231, 235); // Border Color (#e5e7eb)

        // 1. HEADER SECTION (Shop Info & Logo)
        float[] headerWidths = {350f, 150f};
        Table headerTable = new Table(headerWidths);
        headerTable.setWidth(UnitValue.createPercentValue(100));
        
        Cell infoCell = new Cell().setBorder(Border.NO_BORDER);
        if (settings != null) {
            infoCell.add(new Paragraph(settings.getShopName()).setBold().setFontSize(20).setFontColor(primaryColor));
            if (settings.getOwnerName() != null && !settings.getOwnerName().isEmpty()) {
                infoCell.add(new Paragraph("Proprietor: " + settings.getOwnerName()).setFontSize(9).setMarginBottom(2));
            }
            if (Boolean.TRUE.equals(settings.getShowAddress())) {
                StringBuilder address = new StringBuilder();
                if (settings.getAddressLine1() != null) address.append(settings.getAddressLine1()).append(", ");
                if (settings.getAddressLine2() != null) address.append(settings.getAddressLine2()).append("\n");
                if (settings.getCity() != null) address.append(settings.getCity()).append(", ");
                if (settings.getState() != null) address.append(settings.getState()).append(" - ");
                if (settings.getPincode() != null) address.append(settings.getPincode());
                infoCell.add(new Paragraph(address.toString()).setFontSize(9).setMarginBottom(2));
            }
            StringBuilder contact = new StringBuilder();
            if (Boolean.TRUE.equals(settings.getShowMobile()) && settings.getMobile() != null) {
                contact.append("Phone: ").append(settings.getMobile());
            }
            if (settings.getEmail() != null) {
                if (contact.length() > 0) contact.append(" | ");
                contact.append("Email: ").append(settings.getEmail());
            }
            if (contact.length() > 0) {
                infoCell.add(new Paragraph(contact.toString()).setFontSize(9).setMarginBottom(2));
            }
            if (Boolean.TRUE.equals(settings.getShowGst()) && settings.getGstNumber() != null && !settings.getGstNumber().isEmpty()) {
                infoCell.add(new Paragraph("GSTIN: " + settings.getGstNumber()).setBold().setFontSize(9).setFontColor(primaryColor));
            }
        } else {
            infoCell.add(new Paragraph("ShopBilling").setBold().setFontSize(20).setFontColor(primaryColor));
        }
        headerTable.addCell(infoCell);

        Cell logoCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
        if (settings != null && Boolean.TRUE.equals(settings.getShowLogo()) && settings.getShopLogo() != null && !settings.getShopLogo().isEmpty()) {
            try {
                String base64Data = settings.getShopLogo();
                if (base64Data.contains(",")) {
                    base64Data = base64Data.split(",")[1];
                }
                byte[] imageBytes = Base64.getDecoder().decode(base64Data);
                com.itextpdf.io.image.ImageData imageData = com.itextpdf.io.image.ImageDataFactory.create(imageBytes);
                com.itextpdf.layout.element.Image logo = new com.itextpdf.layout.element.Image(imageData);
                logo.setWidth(60);
                logo.setHeight(60);
                logo.setHorizontalAlignment(HorizontalAlignment.RIGHT);
                logoCell.add(logo);
            } catch (Exception e) {
                System.err.println("Error adding logo to PDF: " + e.getMessage());
            }
        }
        headerTable.addCell(logoCell);
        document.add(headerTable);

        // Divider Line
        Table lineTable = new Table(1);
        lineTable.setWidth(UnitValue.createPercentValue(100));
        lineTable.setBorder(new SolidBorder(primaryColor, 1f));
        document.add(new Paragraph("\n").setFontSize(5));
        document.add(lineTable);
        document.add(new Paragraph("\n").setFontSize(5));

        // 2. METADATA SECTION (Bill To & Invoice Info)
        float[] metaWidths = {250f, 250f};
        Table metaTable = new Table(metaWidths);
        metaTable.setWidth(UnitValue.createPercentValue(100));
        metaTable.setMarginBottom(15);

        // Bill To
        Cell billToCell = new Cell().setBorder(Border.NO_BORDER);
        billToCell.add(new Paragraph("BILL TO").setBold().setFontSize(10).setFontColor(new DeviceRgb(107, 114, 128)));
        if (sale.getCustomer() != null) {
            billToCell.add(new Paragraph(sale.getCustomer().getName()).setBold().setFontSize(11));
            if (sale.getCustomer().getMobile() != null) {
                billToCell.add(new Paragraph("Mobile: " + sale.getCustomer().getMobile()).setFontSize(9));
            }
            if (sale.getCustomer().getEmail() != null) {
                billToCell.add(new Paragraph("Email: " + sale.getCustomer().getEmail()).setFontSize(9));
            }
        } else {
            billToCell.add(new Paragraph("Walk-in Customer").setBold().setFontSize(11));
        }
        metaTable.addCell(billToCell);

        // Invoice info
        Cell invInfoCell = new Cell().setBorder(Border.NO_BORDER).setTextAlignment(TextAlignment.RIGHT);
        invInfoCell.add(new Paragraph("TAX INVOICE").setBold().setFontSize(12).setFontColor(primaryColor));
        String invoicePrefix = (settings != null && settings.getInvoicePrefix() != null) ? settings.getInvoicePrefix() : "INV-";
        invInfoCell.add(new Paragraph("Invoice No: " + invoicePrefix + sale.getSaleNumber()).setFontSize(10).setBold());
        if (sale.getSaleDate() != null) {
            invInfoCell.add(new Paragraph("Date: " + sale.getSaleDate().format(java.time.format.DateTimeFormatter.ofPattern("dd-MMM-yyyy HH:mm"))).setFontSize(9));
        }
        invInfoCell.add(new Paragraph("Status: PAID").setBold().setFontSize(9).setFontColor(new DeviceRgb(16, 185, 129)));
        metaTable.addCell(invInfoCell);

        metaTable.addCell(invInfoCell);
        document.add(metaTable);

        // 3. PRODUCTS TABLE
        float[] itemWidths = {40f, 240f, 60f, 80f, 80f};
        Table itemTable = new Table(itemWidths);
        itemTable.setWidth(UnitValue.createPercentValue(100));
        itemTable.setMarginBottom(20);

        // Table Header
        String[] headers = {"S.No.", "Item Description", "Qty", "Price (Rs.)", "Total (Rs.)"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = new Cell().add(new Paragraph(headers[i]).setBold().setFontColor(ColorConstants.BLACK).setFontSize(9));
            cell.setBackgroundColor(headerBg);
            cell.setPadding(6);
            cell.setBorder(new SolidBorder(borderGray, 1f));
            if (i >= 2) {
                cell.setTextAlignment(TextAlignment.RIGHT);
            }
            itemTable.addHeaderCell(cell);
        }

        // Table Body
        final int[] index = {1};
        sale.getItems().forEach(item -> {
            Cell cellNo = new Cell().add(new Paragraph(String.valueOf(index[0]++)).setFontSize(9))
                .setPadding(6).setBorder(new SolidBorder(borderGray, 0.5f));
            itemTable.addCell(cellNo);

            Cell cellName = new Cell().add(new Paragraph(item.getProduct().getName()).setFontSize(9))
                .setPadding(6).setBorder(new SolidBorder(borderGray, 0.5f));
            itemTable.addCell(cellName);

            Cell cellQty = new Cell().add(new Paragraph(String.valueOf(item.getQuantity())).setFontSize(9))
                .setPadding(6).setBorder(new SolidBorder(borderGray, 0.5f)).setTextAlignment(TextAlignment.RIGHT);
            itemTable.addCell(cellQty);

            Cell cellPrice = new Cell().add(new Paragraph(String.format("%.2f", item.getSellingPrice())).setFontSize(9))
                .setPadding(6).setBorder(new SolidBorder(borderGray, 0.5f)).setTextAlignment(TextAlignment.RIGHT);
            itemTable.addCell(cellPrice);

            Cell cellTotal = new Cell().add(new Paragraph(String.format("%.2f", item.getTotal())).setFontSize(9))
                .setPadding(6).setBorder(new SolidBorder(borderGray, 0.5f)).setTextAlignment(TextAlignment.RIGHT);
            itemTable.addCell(cellTotal);
        });

        document.add(itemTable);

        // 4. FOOTER & TOTALS SECTION
        float[] footerWidths = {280f, 220f};
        Table footerTable = new Table(footerWidths);
        footerTable.setWidth(UnitValue.createPercentValue(100));

        // Left Side: Payment QR Code
        Cell leftCell = new Cell().setBorder(Border.NO_BORDER);
        if (settings != null) {
            if (Boolean.TRUE.equals(settings.getShowQr()) && settings.getUpiId() != null && !settings.getUpiId().isEmpty()) {
                try {
                    String upiUrl = "upi://pay?pa=" + settings.getUpiId() + "&pn=" + URLEncoder.encode(settings.getUpiMerchantName() != null ? settings.getUpiMerchantName() : settings.getShopName(), StandardCharsets.UTF_8.toString());
                    String qrChartUrl = "https://chart.googleapis.com/chart?chs=120x120&cht=qr&chl=" + URLEncoder.encode(upiUrl, StandardCharsets.UTF_8.toString());
                    com.itextpdf.io.image.ImageData qrImageData = com.itextpdf.io.image.ImageDataFactory.create(new URL(qrChartUrl));
                    com.itextpdf.layout.element.Image qrImage = new com.itextpdf.layout.element.Image(qrImageData);
                    qrImage.setWidth(85);
                    qrImage.setHeight(85);
                    
                    leftCell.add(new Paragraph("Scan to Pay via UPI:").setBold().setFontSize(9).setFontColor(primaryColor));
                    leftCell.add(qrImage);
                    if (settings.getBankName() != null && !settings.getBankName().isEmpty()) {
                        leftCell.add(new Paragraph("Bank: " + settings.getBankName() + "\nA/C: " + settings.getAccountNumber() + " | IFSC: " + settings.getIfscCode()).setFontSize(8).setMarginTop(4));
                    }
                } catch (Exception e) {
                    System.err.println("Error adding QR code to PDF: " + e.getMessage());
                }
            }
        }
        footerTable.addCell(leftCell);

        // Right Side: Billing Breakdown
        Cell rightCell = new Cell().setBorder(Border.NO_BORDER);
        Table summaryTable = new Table(new float[]{110f, 110f});
        summaryTable.setWidth(UnitValue.createPercentValue(100));
        
        addSummaryRow(summaryTable, "Subtotal:", String.format("Rs. %.2f", sale.getSubtotal()), borderGray, false);
        if (sale.getDiscount().doubleValue() > 0) {
            addSummaryRow(summaryTable, "Discount:", String.format("- Rs. %.2f", sale.getDiscount()), borderGray, false);
        }
        addSummaryRow(summaryTable, "GST / Tax:", String.format("Rs. %.2f", sale.getTax()), borderGray, false);
        
        Cell labelCell = new Cell().add(new Paragraph("Grand Total:").setBold().setFontSize(11).setFontColor(primaryColor))
            .setBorder(new SolidBorder(borderGray, 1f)).setBackgroundColor(headerBg).setPadding(6);
        Cell valueCell = new Cell().add(new Paragraph(String.format("Rs. %.2f", sale.getGrandTotal())).setBold().setFontSize(11).setFontColor(primaryColor))
            .setBorder(new SolidBorder(borderGray, 1f)).setBackgroundColor(headerBg).setPadding(6).setTextAlignment(TextAlignment.RIGHT);
        summaryTable.addCell(labelCell);
        summaryTable.addCell(valueCell);
        
        rightCell.add(summaryTable);
        footerTable.addCell(rightCell);
        document.add(footerTable);

        // Spacing & Static messages
        if (settings != null) {
            document.add(new Paragraph("\n").setFontSize(10));
            if (settings.getThankYouMessage() != null && !settings.getThankYouMessage().isEmpty()) {
                document.add(new Paragraph(settings.getThankYouMessage()).setFontSize(10).setItalic().setTextAlignment(TextAlignment.CENTER).setMarginTop(10));
            }
            if (settings.getTermsConditions() != null && !settings.getTermsConditions().isEmpty()) {
                document.add(new Paragraph("Terms & Conditions:").setBold().setFontSize(8).setMarginTop(15));
                document.add(new Paragraph(settings.getTermsConditions()).setFontSize(7).setFontColor(new DeviceRgb(107, 114, 128)));
            }
            if (settings.getFooterMessage() != null && !settings.getFooterMessage().isEmpty()) {
                document.add(new Paragraph(settings.getFooterMessage()).setFontSize(7).setFontColor(new DeviceRgb(107, 114, 128)).setTextAlignment(TextAlignment.CENTER).setMarginTop(10));
            }
        }

        document.close();
        return out.toByteArray();
    }

    private void addSummaryRow(Table table, String label, String value, DeviceRgb borderGray, boolean isBold) {
        Cell labelCell = new Cell().add(new Paragraph(label).setFontSize(9))
            .setBorder(new SolidBorder(borderGray, 0.5f)).setPadding(4);
        Cell valueCell = new Cell().add(new Paragraph(value).setFontSize(9))
            .setBorder(new SolidBorder(borderGray, 0.5f)).setPadding(4).setTextAlignment(TextAlignment.RIGHT);
        if (isBold) {
            labelCell.setBold();
            valueCell.setBold();
        }
        table.addCell(labelCell);
        table.addCell(valueCell);
    }
}
