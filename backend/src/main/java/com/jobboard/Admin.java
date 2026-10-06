package com.jobboard;

import jakarta.persistence.*;
import lombok.Data;

@Entity @Data @Table(name = "admins")
public class Admin {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(unique = true) private String username;
    private String password;
}
