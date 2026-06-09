package org.caliope;

import com.google.gson.Gson;
import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpExchange;

import org.caliope.Controlador.UsuarioDAO;
import org.caliope.Modelo.Usuario;

import java.io.IOException;
import java.io.InputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;

public class Main {

    public static void main(String[] args) throws Exception {

        HttpServer server =
                HttpServer.create(
                        new InetSocketAddress(8080),
                        0
                );

        server.createContext("/registro", Main::registrar);

        server.start();

        System.out.println("Servidor iniciado en puerto 8080");
    }

    private static void registrar(HttpExchange exchange)
            throws IOException {

        if(exchange.getRequestMethod().equals("OPTIONS")){

            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Origin",
                    "*"
            );

            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Methods",
                    "POST, OPTIONS"
            );

            exchange.getResponseHeaders().add(
                    "Access-Control-Allow-Headers",
                    "Content-Type"
            );

            exchange.sendResponseHeaders(204, -1);
            return;
        }

        exchange.getResponseHeaders().add(
                "Access-Control-Allow-Origin",
                "*"
        );

        if(exchange.getRequestMethod().equals("POST")){

            InputStream is = exchange.getRequestBody();

            String json =
                    new String(
                            is.readAllBytes(),
                            StandardCharsets.UTF_8
                    );

            Gson gson = new Gson();

            Usuario usuario =
                    gson.fromJson(
                            json,
                            Usuario.class
                    );

            UsuarioDAO dao =
                    new UsuarioDAO();

            boolean resultado =
                    dao.registrarUsuario(
                            usuario
                    );

            String respuesta =
                    resultado
                            ? "Usuario registrado"
                            : "Error al registrar";

            exchange.sendResponseHeaders(
                    200,
                    respuesta.length()
            );

            exchange.getResponseBody().write(
                    respuesta.getBytes()
            );

            exchange.close();
        }
    }
}