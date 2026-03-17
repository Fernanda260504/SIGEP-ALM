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
import java.util.*;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {

    @Autowired
    private PermisoRepository permisoRepository;

    // 🔹 Estadísticas generales
    @GetMapping("/stats")
    public Map<String,Object> stats(){

        Map<String,Object> data = new HashMap<>();

        long total = permisoRepository.count();
        long aprobadas = permisoRepository.countByEstado(EstadoPermiso.APROBADO);
        long rechazadas = permisoRepository.countByEstado(EstadoPermiso.RECHAZADO);
        long pendientes = permisoRepository.countByEstado(EstadoPermiso.PENDIENTE);

        double tasa = total > 0 ? ((double)aprobadas/total)*100 : 0;

        data.put("totalRequests",total);
        data.put("approved",aprobadas);
        data.put("rejected",rechazadas);
        data.put("pending",pendientes);
        data.put("approvalRate",Math.round(tasa));

        return data;
    }


    // 🔹 Dashboard completo
    @GetMapping("/dashboard")
    public Map<String,Object> dashboard(){

        Map<String,Object> data = new HashMap<>();

        List<Map<String,Object>> monthlyData = new ArrayList<>();

        List<Object[]> solicitudes = permisoRepository.countPermisosPorMes();
        List<Object[]> aprobadas = permisoRepository.countAprobadasPorMes();
        List<Object[]> rechazadas = permisoRepository.countRechazadasPorMes();

        String[] meses = {"","Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"};

        for(int i=1;i<=12;i++){

            Map<String,Object> mes = new HashMap<>();

            mes.put("month",meses[i]);
            mes.put("requests",obtenerValor(solicitudes,i));
            mes.put("approved",obtenerValor(aprobadas,i));
            mes.put("rejected",obtenerValor(rechazadas,i));

            monthlyData.add(mes);
        }

        data.put("monthlyData",monthlyData);


        // 🔹 Motivos más usados
        List<Map<String,Object>> reasons = new ArrayList<>();

        long total = permisoRepository.count();

        for(Object[] row : permisoRepository.motivosMasUsados()){

            Map<String,Object> reason = new HashMap<>();

            long cantidad = ((Number)row[1]).longValue();

            reason.put("reason",row[0]);
            reason.put("count",cantidad);
            reason.put("percentage",Math.round((cantidad*100.0)/total));

            reasons.add(reason);
        }

        data.put("topReasons",reasons);

        return data;
    }


    private int obtenerValor(List<Object[]> lista,int mes){

        for(Object[] row : lista){

            int m = ((Number)row[0]).intValue();

            if(m==mes){
                return ((Number)row[1]).intValue();
            }
        }

        return 0;
    }


    // 🔹 PDF
    @GetMapping("/pdf")
    public void generarPDF(HttpServletResponse response) throws IOException{

        response.setContentType("application/pdf");
        response.setHeader("Content-Disposition","attachment; filename=reporte_permisos.pdf");

        PdfWriter writer = new PdfWriter(response.getOutputStream());
        PdfDocument pdf = new PdfDocument(writer);
        Document document = new Document(pdf);

        long total = permisoRepository.count();
        long aprobadas = permisoRepository.countByEstado(EstadoPermiso.APROBADO);
        long rechazadas = permisoRepository.countByEstado(EstadoPermiso.RECHAZADO);

        document.add(new Paragraph("REPORTE DE PERMISOS"));
        document.add(new Paragraph("Total solicitudes: "+total));
        document.add(new Paragraph("Aprobadas: "+aprobadas));
        document.add(new Paragraph("Rechazadas: "+rechazadas));

        document.close();
    }
}