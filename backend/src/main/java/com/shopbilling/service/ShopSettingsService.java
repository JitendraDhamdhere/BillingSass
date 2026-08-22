package com.shopbilling.service;

import com.shopbilling.dto.request.ChangePasswordRequest;
import com.shopbilling.dto.request.ShopSettingsRequest;
import com.shopbilling.dto.response.ShopSettingsResponse;
import com.shopbilling.entity.ShopSettings;
import com.shopbilling.entity.User;
import com.shopbilling.exception.EntityNotFoundException;
import com.shopbilling.repository.ShopSettingsRepository;
import com.shopbilling.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ShopSettingsService {
    private final ShopSettingsRepository repository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public ShopSettingsResponse getSettings() {
        ShopSettings settings = repository.findById(1L).orElseGet(() -> {
            ShopSettings ds = new ShopSettings();
            ds.setId(1L);
            ds.setShopName("ShopBilling");
            ds.setOwnerName("Administrator");
            ds.setInvoicePrefix("INV-");
            ds.setReceiptPrefix("REC-");
            ds.setShowLogo(true);
            ds.setShowQr(true);
            ds.setShowGst(true);
            ds.setShowAddress(true);
            ds.setShowMobile(true);
            return repository.save(ds);
        });

        ShopSettingsResponse response = new ShopSettingsResponse();
        BeanUtils.copyProperties(settings, response);

        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();
            userRepository.findByUsername(username).ifPresent(user -> {
                response.setAdminName(user.getFullName());
                response.setAdminMobile(user.getMobile());
                response.setAdminEmail(user.getEmail());
                response.setAdminUsername(user.getUsername());
                response.setProfileImage(settings.getProfileImage());
            });
        }
        return response;
    }

    @Transactional
    public ShopSettingsResponse updateSettings(ShopSettingsRequest request) {
        ShopSettings settings = repository.findById(1L)
            .orElseThrow(() -> new EntityNotFoundException("Settings not found"));
        
        settings.setShopName(request.getShopName());
        settings.setOwnerName(request.getOwnerName());
        settings.setGstNumber(request.getGstNumber());
        settings.setPanNumber(request.getPanNumber());
        settings.setRegistrationNumber(request.getRegistrationNumber());
        settings.setBusinessType(request.getBusinessType());

        settings.setMobile(request.getAdminMobile());
        settings.setEmail(request.getAdminEmail());

        settings.setAddressLine1(request.getAddressLine1());
        settings.setAddressLine2(request.getAddressLine2());
        settings.setCity(request.getCity());
        settings.setState(request.getState());
        settings.setCountry(request.getCountry());
        settings.setPincode(request.getPincode());

        settings.setUpiId(request.getUpiId());
        settings.setUpiMerchantName(request.getUpiMerchantName());
        settings.setBankName(request.getBankName());
        settings.setAccountHolderName(request.getAccountHolderName());
        settings.setAccountNumber(request.getAccountNumber());
        settings.setIfscCode(request.getIfscCode());

        settings.setInvoicePrefix(request.getInvoicePrefix());
        settings.setReceiptPrefix(request.getReceiptPrefix());
        settings.setFooterMessage(request.getFooterMessage());
        settings.setTermsConditions(request.getTermsConditions());
        settings.setThankYouMessage(request.getThankYouMessage());

        settings.setShowLogo(request.getShowLogo());
        settings.setShowQr(request.getShowQr());
        settings.setShowGst(request.getShowGst());
        settings.setShowAddress(request.getShowAddress());
        settings.setShowMobile(request.getShowMobile());

        repository.save(settings);

        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            String username = auth.getName();
            User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("User not found"));
            
            user.setFullName(request.getAdminName());
            user.setMobile(request.getAdminMobile());
            user.setEmail(request.getAdminEmail());
            
            if (!user.getUsername().equals(request.getAdminUsername())) {
                if (userRepository.findByUsername(request.getAdminUsername()).isPresent()) {
                    throw new IllegalArgumentException("Username already exists");
                }
                user.setUsername(request.getAdminUsername());
            }
            userRepository.save(user);
        }

        return getSettings();
    }

    @Transactional
    public void updateLogo(String base64Logo) {
        ShopSettings settings = repository.findById(1L)
            .orElseThrow(() -> new EntityNotFoundException("Settings not found"));
        settings.setShopLogo(base64Logo);
        repository.save(settings);
    }

    @Transactional
    public void updateProfileImage(String base64Image) {
        ShopSettings settings = repository.findById(1L)
            .orElseThrow(() -> new EntityNotFoundException("Settings not found"));
        settings.setProfileImage(base64Image);
        repository.save(settings);
    }

    @Transactional
    public void changePassword(ChangePasswordRequest request) {
        org.springframework.security.core.Authentication auth = 
            org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getName())) {
            throw new EntityNotFoundException("User not authenticated");
        }
        String username = auth.getName();
        User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new EntityNotFoundException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Current password does not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
