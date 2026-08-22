package com.shopbilling.controller;

import com.shopbilling.dto.request.ChangePasswordRequest;
import com.shopbilling.dto.request.ShopSettingsRequest;
import com.shopbilling.dto.response.ApiResponse;
import com.shopbilling.dto.response.ShopSettingsResponse;
import com.shopbilling.service.ShopSettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Base64;

@RestController
@RequestMapping("/api/shop-settings")
@RequiredArgsConstructor
public class ShopSettingsController {
    private final ShopSettingsService service;

    @GetMapping
    public ResponseEntity<ApiResponse<ShopSettingsResponse>> getSettings() {
        return ResponseEntity.ok(ApiResponse.success("Settings fetched successfully", service.getSettings()));
    }

    @PutMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ShopSettingsResponse>> updateSettings(@Valid @RequestBody ShopSettingsRequest request) {
        return ResponseEntity.ok(ApiResponse.success("Settings updated successfully", service.updateSettings(request)));
    }

    @PostMapping("/upload-logo")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadLogo(@RequestParam("file") MultipartFile file) throws IOException {
        String base64Image = "data:" + file.getContentType() + ";base64," + Base64.getEncoder().encodeToString(file.getBytes());
        service.updateLogo(base64Image);
        return ResponseEntity.ok(ApiResponse.success("Logo uploaded successfully", base64Image));
    }

    @PostMapping("/upload-profile-image")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> uploadProfileImage(@RequestParam("file") MultipartFile file) throws IOException {
        String base64Image = "data:" + file.getContentType() + ";base64," + Base64.getEncoder().encodeToString(file.getBytes());
        service.updateProfileImage(base64Image);
        return ResponseEntity.ok(ApiResponse.success("Profile image uploaded successfully", base64Image));
    }

    @PostMapping("/change-password")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        service.changePassword(request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }
}
