package com.campusflow.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class OfferResponseRequest {

    @NotBlank(message = "Action is required")
    @Pattern(regexp = "^(ACCEPT|REJECT)$", message = "Action must be either ACCEPT or REJECT")
    private String action;
}

