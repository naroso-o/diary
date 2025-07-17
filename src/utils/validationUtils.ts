export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: string) => string | null;
}

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export const validateField = (value: string, rules: ValidationRule): ValidationResult => {
    // 필수 필드 검사
    if (rules.required && !value.trim()) {
        return { isValid: false, error: '필수 입력 항목입니다.' };
    }

    // 빈 값이면서 필수가 아닌 경우 통과
    if (!value.trim() && !rules.required) {
        return { isValid: true };
    }

    // 최소 길이 검사
    if (rules.minLength && value.length < rules.minLength) {
        return { isValid: false, error: `최소 ${rules.minLength}자 이상 입력해주세요.` };
    }

    // 최대 길이 검사
    if (rules.maxLength && value.length > rules.maxLength) {
        return { isValid: false, error: `최대 ${rules.maxLength}자 이하로 입력해주세요.` };
    }

    // 패턴 검사
    if (rules.pattern && !rules.pattern.test(value)) {
        return { isValid: false, error: '올바른 형식이 아닙니다.' };
    }

    // 커스텀 검사
    if (rules.custom) {
        const customError = rules.custom(value);
        if (customError) {
            return { isValid: false, error: customError };
        }
    }

    return { isValid: true };
};

// 일기 내용 검증
export const validateDiaryContent = (content: string): ValidationResult => {
    return validateField(content, {
        required: true,
        minLength: 1,
        maxLength: 5000,
        custom: (value) => {
            // 공백만 있는 경우 검사
            if (value.trim().length === 0) {
                return '일기 내용을 입력해주세요.';
            }
            return null;
        }
    });
};

// 이메일 검증
export const validateEmail = (email: string): ValidationResult => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validateField(email, {
        required: true,
        pattern: emailPattern,
        custom: (value) => {
            if (!emailPattern.test(value)) {
                return '올바른 이메일 형식을 입력해주세요.';
            }
            return null;
        }
    });
};

// 비밀번호 검증
export const validatePassword = (password: string): ValidationResult => {
    return validateField(password, {
        required: true,
        minLength: 8,
        custom: (value) => {
            if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                return '대문자, 소문자, 숫자를 포함해야 합니다.';
            }
            return null;
        }
    });
};