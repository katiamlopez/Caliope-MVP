package org.caliope.Controlador;

import org.caliope.Modelo.Usuario;

import java.sql.Connection;
import java.sql.PreparedStatement;

public class UsuarioDAO {

    public boolean registrarUsuario(Usuario usuario){

        try{

            Connection con = Conexion.conectar();

            String sql =
                    "INSERT INTO usuarios(nameUser, correo, password) VALUES (?, ?, ?)";

            PreparedStatement ps = con.prepareStatement(sql);

            ps.setString(1, usuario.getNameUser());
            ps.setString(2, usuario.getCorreo());
            ps.setString(3, usuario.getPassword());

            return ps.executeUpdate() > 0;

        }catch(Exception e){

            e.printStackTrace();
            return false;
        }
    }
}