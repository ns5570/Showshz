package com.showszn.backend.booking;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import java.awt.Color;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Locale;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;
import org.apache.pdfbox.pdmodel.graphics.image.LosslessFactory;
import org.apache.pdfbox.pdmodel.graphics.image.PDImageXObject;
import org.springframework.stereotype.Component;

@Component
public class TicketPdfGenerator {

    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("EEE, d MMM yyyy 'at' h:mm a", Locale.ENGLISH);

    public byte[] generate(
            String bookingReference,
            String title,
            String venueName,
            String screenName,
            Instant startTime,
            BigDecimal totalAmount,
            List<String> seats) throws IOException, WriterException {

        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage(PDRectangle.A5);
            document.addPage(page);

            PDType1Font bold = new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);
            PDType1Font regular = new PDType1Font(Standard14Fonts.FontName.HELVETICA);

            float margin = 40;
            float width = page.getMediaBox().getWidth() - 2 * margin;
            float y = page.getMediaBox().getHeight() - margin;

            BufferedImage qrImage = buildQrImage(bookingReference, 160);
            PDImageXObject qrObject = LosslessFactory.createFromImage(document, qrImage);

            try (PDPageContentStream content = new PDPageContentStream(document, page)) {
                content.setNonStrokingColor(new Color(220, 38, 38));
                content.addRect(0, page.getMediaBox().getHeight() - 8, page.getMediaBox().getWidth(), 8);
                content.fill();

                y -= 20;
                y = writeLine(content, bold, 20, margin, y, "ShowSzn");
                y = writeLine(content, regular, 11, margin, y - 4, "Your e-ticket");

                y -= 20;
                content.moveTo(margin, y);
                content.lineTo(margin + width, y);
                content.setStrokingColor(new Color(220, 220, 220));
                content.stroke();
                y -= 24;

                y = writeLine(content, bold, 16, margin, y, title);
                y = writeLine(content, regular, 11, margin, y - 6, venueName + " - " + screenName);
                y = writeLine(content, regular, 11, margin, y - 4, startTime.atZone(ZoneId.systemDefault()).format(DATE_FORMAT));

                y -= 16;
                String seatList = String.join(", ", seats.isEmpty() ? List.of("N/A") : seats);
                y = writeLine(content, regular, 11, margin, y, "Seat(s): " + seatList);
                y = writeLine(content, regular, 11, margin, y - 2, "Total paid: Rs. " + totalAmount);

                y -= 24;
                content.drawImage(qrObject, margin, y - 160, 160, 160);

                content.setFont(bold, 12);
                content.beginText();
                content.newLineAtOffset(margin + 175, y - 90);
                content.showText("Booking Reference");
                content.endText();

                content.setFont(regular, 14);
                content.beginText();
                content.newLineAtOffset(margin + 175, y - 108);
                content.showText(bookingReference);
                content.endText();

                content.setFont(regular, 9);
                content.beginText();
                content.newLineAtOffset(margin + 175, y - 130);
                content.showText("Show this QR code at the venue entrance.");
                content.endText();
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            document.save(out);
            return out.toByteArray();
        }
    }

    private float writeLine(PDPageContentStream content, PDType1Font font, float size, float x, float y, String text) throws IOException {
        content.setNonStrokingColor(new Color(20, 20, 20));
        content.setFont(font, size);
        content.beginText();
        content.newLineAtOffset(x, y);
        content.showText(text);
        content.endText();
        return y - size - 4;
    }

    private BufferedImage buildQrImage(String value, int size) throws WriterException {
        BitMatrix matrix = new QRCodeWriter().encode(value, BarcodeFormat.QR_CODE, size, size);
        return MatrixToImageWriter.toBufferedImage(matrix);
    }
}
