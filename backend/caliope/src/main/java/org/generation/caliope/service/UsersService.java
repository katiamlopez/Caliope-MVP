package org.generation.caliope.service;

import org.generation.caliope.model.Users;
import org.generation.caliope.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    private final UsersRepository usersRepository;

    @Autowired
    public UsersService(UsersRepository usersRepository) {
        this.usersRepository = usersRepository;
    }

    public List<Users> getAllUsers() {
        return usersRepository.findAll();
    }

    public Users getUserById(Long id) {
        return usersRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User not found!")
        );
    }

    public Users createUsers(Users users) {
        return usersRepository.save(users);
    }

    public Users deleteUserById(Long id) {
        Users tmp = usersRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User not found!")
        );
        usersRepository.delete(tmp);
        return tmp;
    }

    public Users updateUsersById(Long id, Users updatedUsers) {
        Users savedUsers = usersRepository.findById(id).orElseThrow(
                () -> new IllegalArgumentException("User not found!")
        );
        if (updatedUsers.getFirstName() != null) savedUsers.setFirstName(updatedUsers.getFirstName());
        if (updatedUsers.getLastName() != null) savedUsers.setLastName(updatedUsers.getLastName());
        if (updatedUsers.getUser_name() != null) savedUsers.setUser_name(updatedUsers.getUser_name());
        if (updatedUsers.getEmail() != null) savedUsers.setEmail(updatedUsers.getEmail());
        if (updatedUsers.getBirthday() != null) savedUsers.setBirthday(updatedUsers.getBirthday());
        if (updatedUsers.getBio() != null) savedUsers.setBio(updatedUsers.getBio());
        if (updatedUsers.getPicture_avatar() != null) savedUsers.setPicture_avatar(updatedUsers.getPicture_avatar());
        if (updatedUsers.getPassword() != null) savedUsers.setPassword(updatedUsers.getPassword());
        if (updatedUsers.getCreated_at() != null) savedUsers.setCreated_at(updatedUsers.getCreated_at());

        return usersRepository.save(savedUsers);
    }


}
