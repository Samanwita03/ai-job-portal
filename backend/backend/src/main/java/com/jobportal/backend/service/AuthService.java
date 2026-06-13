package com.jobportal.backend.service;

import com.jobportal.backend.dto.*;
import com.jobportal.backend.entity.User;
import com.jobportal.backend.repository.UserRepository;
import com.jobportal.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
    if (userRepository.existsByEmail(request.getEmail())) {
        throw new ResponseStatusException(
            org.springframework.http.HttpStatus.BAD_REQUEST,
            "Email already registered. Please login instead."
        );
    }

    User user = User.builder()
            .fullName(request.getFullName())
            .email(request.getEmail())
            .password(passwordEncoder.encode(request.getPassword()))
            .role(User.Role.valueOf(request.getRole().toUpperCase()))
            .build();

    userRepository.save(user);
    String token = jwtUtil.generateToken(user.getEmail());
    return new AuthResponse(token, user.getRole().name(),
            user.getFullName(), user.getId());
}
    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return new AuthResponse(token, user.getRole().name(),
                user.getFullName(), user.getId());
    }
}