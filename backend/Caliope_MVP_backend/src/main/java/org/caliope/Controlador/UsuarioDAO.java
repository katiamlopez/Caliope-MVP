package org.caliope.Controlador;

import org.caliope.Modelo.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UsuarioDAO {

    public boolean registrarUsuario(Usuario usuario){

        try{

            Connection con = Conexion.conectar();

            String sql =
                    """
                    INSERT INTO usuarios
                    (
                        nombreU,
                        apellidoU,
                        correo,
                        nickname,
                        fechaNacimiento,
                        pronombre,
                        password
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                    """;

            PreparedStatement ps =
                    con.prepareStatement(sql);

            String fechaNacimiento =
                    usuario.getAnio() + "-"
                            + obtenerNumeroMes(usuario.getMes()) + "-"
                            + usuario.getDia();

            ps.setString(1, usuario.getNombreU());
            ps.setString(2, usuario.getApellidoU());
            ps.setString(3, usuario.getCorreo());
            ps.setString(4, usuario.getNickname());
            ps.setString(5, fechaNacimiento);
            ps.setString(6, usuario.getPronombre());
            ps.setString(7, usuario.getPassword());

            return ps.executeUpdate() > 0;

        }catch(Exception e){

            e.printStackTrace();
            return false;
        }
    }

    private String obtenerNumeroMes(String mes){

        return switch(mes){

            case "Enero" -> "01";
            case "Febrero" -> "02";
            case "Marzo" -> "03";
            case "Abril" -> "04";
            case "Mayo" -> "05";
            case "Junio" -> "06";
            case "Julio" -> "07";
            case "Agosto" -> "08";
            case "Septiembre" -> "09";
            case "Octubre" -> "10";
            case "Noviembre" -> "11";
            case "Diciembre" -> "12";

            default -> "01";
        };
    }
}