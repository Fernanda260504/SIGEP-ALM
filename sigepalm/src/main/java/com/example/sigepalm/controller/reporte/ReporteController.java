package com.example.sigepalm.controller.reporte;

import com.example.sigepalm.model.permiso.EstadoPermiso;
import com.example.sigepalm.model.permiso.PermisoRepository;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    @Autowired
    private PermisoRepository permisoRepository;

    @GetMapping("/pdf")
    public void generarReportePDF(HttpServletResponse response) throws IOException {

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition", "attachment; filename=reporte_permisos.pdf");

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        long total = permisoRepository.count();
        long aprobadas = permisoRepository.countByEstado(EstadoPermiso.APROBADO);
        long rechazadas = permisoRepository.countByEstado(EstadoPermiso.RECHAZADO);

        document.add(new Paragraph("REPORTE DE PERMISOS"));
        document.add(new Paragraph("----------------------------"));
        document.add(new Paragraph("Total Solicitudes: " + total));
        document.add(new Paragraph("Aprobadas: " + aprobadas));
        document.add(new Paragraph("Rechazadas: " + rechazadas));

        document.close();
    }
}