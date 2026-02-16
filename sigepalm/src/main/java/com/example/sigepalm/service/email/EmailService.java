package com.example.sigepalm.service.email;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void enviarCorreoRH(String asunto, String mensaje) {

        SimpleMailMessage mail = new SimpleMailMessage();
        mail.setTo("fernanda.bautista.rodriguez@gmail.com"); // cambia por RH real
        mail.setSubject(asunto);
        mail.setText(mensaje);

        mailSender.send(mail);
    }
}
