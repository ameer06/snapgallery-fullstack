package com.snapgallery.user;

import com.snapgallery.auth.RegisterRequest;
import com.snapgallery.common.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/team")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
public class TeamController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<UserDto>>> getTeamMembers() {
        List<UserDto> members = userService.getAllTeamMembers();
        return ResponseEntity.ok(ApiResponse.success(members));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UserDto>> createTeamMember(@Valid @RequestBody RegisterRequest request) {
        UserDto newMember = userService.createTeamMember(request);
        return new ResponseEntity<>(ApiResponse.success(newMember, "Team member account created"), HttpStatus.CREATED);
    }
}
