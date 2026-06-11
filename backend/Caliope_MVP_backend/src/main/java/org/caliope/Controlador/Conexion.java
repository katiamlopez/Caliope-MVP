package org.caliope.Controlador;

import java.sql.Connection;
import java.sql.DriverManager;

public class Conexion {

    private static final String URL =
            "jdbc:mysql://192.168.0.8/caliope";

    private static final String USER =
            "caliope";

    private static final String PASS =
            "root";

    public static Connection conectar() {

        try {

            return DriverManager.getConnection(
                    URL,
                    USER,
                    PASS
            );

        } catch (Exception e) {

            e.printStackTrace();

            return null;
        }
    }
}