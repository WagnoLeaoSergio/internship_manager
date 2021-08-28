package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.model.Admin;
import com.power222.tuimspfcauppbj.service.AdminService;
import com.power222.tuimspfcauppbj.util.PasswordDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admins")
public class AdminController {

    private final AdminService svc;

    public AdminController(AdminService svc) {
        this.svc = svc;
    }

    @GetMapping
    public Page<Admin> getAllAdmins(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int itemsPerPage) {
        return svc.getAllAdmins(page, itemsPerPage);
    }

    @PostMapping
    public ResponseEntity<Admin> createAdmin(@RequestBody Admin newAdmin) {
        return svc.createAdmin(newAdmin)
                .map(admin -> ResponseEntity.status(HttpStatus.CREATED).body(admin))
                .orElse(ResponseEntity.status(HttpStatus.CONFLICT).build());
    }

    @PutMapping
    @RequestMapping("/toggle/{adminId}")
    public ResponseEntity<Void> disableAdmin(@PathVariable long adminId) {
        return svc.toggleDisabledAdmin(adminId)
                .map(v -> ResponseEntity.ok().<Void>build())
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping
    @RequestMapping("/password")
    public ResponseEntity<Void> changePassword(@RequestBody PasswordDTO dto) {
        return svc.updateUserPassword(dto)
                .map(v -> ResponseEntity.ok().<Void>build())
                .orElse(ResponseEntity.notFound().build());
    }
}
