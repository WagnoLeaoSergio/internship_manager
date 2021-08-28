package com.power222.tuimspfcauppbj.controller;

import com.power222.tuimspfcauppbj.service.AuthenticationService;
import com.power222.tuimspfcauppbj.util.AuthenticationDTO;
import com.power222.tuimspfcauppbj.util.PasswordDTO;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthenticationController {
    private final AuthenticationService authSvc;

    public AuthenticationController(AuthenticationService authSvc) {
        this.authSvc = authSvc;
    }

    @GetMapping("/user")
    public AuthenticationDTO getCurrentUser() {
        return AuthenticationDTO.fromUser(authSvc.getCurrentUser());
    }

    @PutMapping("/password")
    @ApiResponses({
            @ApiResponse(code = 409, message = "Old and new passwords are identical"),
            @ApiResponse(code = 401, message = "Old password is wrong"),
            @ApiResponse(code = 404, message = "User does not exist")
    })
    public ResponseEntity<Void> updateUserPassword(@RequestBody PasswordDTO dto) {
        var changePass = authSvc.updateUserPassword(dto);

        switch (changePass) {
            case SUCCESS:
                return ResponseEntity.ok().build();
            case OLD_AND_NEW_EQUAL:
                return ResponseEntity.status(HttpStatus.CONFLICT).build();
            case OLD_WRONG:
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            case USER_NOT_FOUND:
            default:
                return ResponseEntity.notFound().build();
        }
    }


}
