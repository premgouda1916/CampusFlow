package com.campusflow.exception;

import com.campusflow.dto.response.EligibilityResult;
import lombok.Getter;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@Getter
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class IneligibleApplicationException extends RuntimeException {
    private final EligibilityResult eligibilityResult;

    public IneligibleApplicationException(String message, EligibilityResult eligibilityResult) {
        super(message);
        this.eligibilityResult = eligibilityResult;
    }
}
