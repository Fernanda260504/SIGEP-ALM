package com.example.sigepalm.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final String SECRET = "sigepalm_secret_key_2026_wurth_seguridad";
    private final long EXPIRATION = 1000 * 60 * 60; // 1 hora

    private Key getKey(){
        return Keys.hmacShaKeyFor(SECRET.getBytes());
    }

    // Generar token
    public String generateToken(String correo, String rol){

        return Jwts.builder()
                .setSubject(correo)
                .claim("role", rol)
                .setIssuedAt(new Date())
                .setExpiration(
                        new Date(System.currentTimeMillis() + EXPIRATION)
                )
                .signWith(getKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Obtener correo
    public String extractUsername(String token){
        return getClaims(token).getSubject();
    }

    // Obtener rol
    public String extractRole(String token){
        return getClaims(token).get("role", String.class);
    }

    // Validar token
    public boolean isTokenValid(String token){
        try{
            getClaims(token);
            return true;
        }catch(Exception e){
            return false;
        }
    }

    private Claims getClaims(String token){
        return Jwts.parserBuilder()
                .setSigningKey(getKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}