package org.generation.caliope.dto;

import java.time.LocalDate;

public record UsersRequest(Long id, String firstName, String lastName, String user_name, String email,
                           LocalDate birthday, String bio, String picture_avatar, String password,
                           String created_at ) {
}
