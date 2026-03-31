# LiveAccess.ai (dev) Login Critical Test Cases

## 1. Test objective
Verify that the login flow for https://dev.liveaccess.ai/login is functional and secure for valid and invalid credentials.

## 2. Assumptions
- Login page is reachable at `/login`.
- User accounts exist in test environment.
- Password policy is known (e.g., min length, special characters).
- Captcha/2FA may be present; if so, those steps are included.

## 3. Test accounts (sample)
- valid user: `testuser@example.com` / `ValidPassword123!`
- locked user: `lockeduser@example.com` / `LockedPass123!`
- non-existent: `nouser@example.com` / `AnyPass123!`

## 4. Critical test cases

### 4.1 Successful login
1. Go to `https://dev.liveaccess.ai/login`.
2. Enter valid email and password.
3. Click `Login`.
4. Verify user is redirected to dashboard (e.g., `/app`, `/dashboard`, `/home`).
5. Verify user profile/username is displayed, and token/session cookie is set.

## 5. Negative login test cases (full coverage)

### 5.1 Invalid password
1. Go to login page.
2. Enter valid email with invalid password.
3. Click `Login`.
4. Verify error message appears (`Invalid credentials`, `Password is incorrect`) and no redirect occurs.
5. Verify account is not authenticated.

### 5.2 Invalid username/email formats
1. Enter malformed email (`plainaddress`, `a@b`, `@domain.com`).
2. Enter any password.
3. Click `Login`.
4. Verify validation error for email format.

### 5.3 Non-existent user
1. Enter non-existent email and any password.
2. Click `Login`.
3. Verify error message appears (`User not found`, `Invalid credentials`).

### 5.4 Empty fields
1. Leave email empty, enter password.
2. Click `Login`.
3. Verify inline validation (`Email is required`).
4. Leave password empty, enter email.
5. Click `Login`.
6. Verify inline validation (`Password is required`).
7. Leave both empty and verify no submission.

### 5.5 SQL injection / script injection / XSS payload
1. Enter malicious input: `' OR 1=1 --`, `" OR ""="`, `<script>alert(1)</script>`.
2. Click `Login`.
3. Verify login fails and defensive error message appears.
4. Verify application does not execute script and escapes output.

### 5.6 Brute-force rate limit
1. Submit invalid credentials repeatedly (e.g., 10 times).
2. Verify lockout error or CAPTCHA appears after thresholds.
3. Verify status message (`Too many attempts`, `account locked`).

### 5.7 Session fixation and CSRF
1. Confirm login form includes anti-CSRF token (if available).
2. Attempt request with missing/invalid token.
3. Verify server rejects and does not authenticate.

### 5.8 Forgotten password with invalid email
1. Click `Forgot password`.
2. Enter invalid or non-existent email.
3. Verify appropriate response (error or masked confirmation).

### 5.9 Captcha and 2FA fallback
1. If enabled, fail first factor.
2. Validate challenge/2FA prompt appears.
3. Cancel; verify non-authenticated state.

### 5.10 UI/Accessibility controls
1. Verify login button is disabled until field validation passes.
2. Verify keyboard navigation (Tab to, Enter to submit).
3. Verify form fields have ARIA labels and required attributes.

### 5.11 URL-based attacks and redirect
1. Use redirect parameter `?next=/admin` after login.
2. Verify open redirect mitigations (only allow safe paths).

### 5.12 Invalid cookie/session reuse
1. Use stale auth token or session cookie.
2. Access protected endpoint.
3. Verify server requires re-login.

### 5.13 Extreme input lengths
1. Enter very long strings (10k chars) in email/password.
2. Verify input is rejected safely with validation messages or truncation.

## 6. Notes for automation
- Use stable selectors: `id`, `name`, `data-testid`, not fragile DOM indexes.
- Isolate each scenario with `test.beforeEach` or a fresh browser context.
- Clear cookies/localStorage in cleanup.
- Capture screenshot and logs on failure.
- Add retries for transient network issues.

1. Go to login page.
2. Enter valid email with invalid password.
3. Click `Login`.
4. Verify error message appears (`Invalid credentials` / `Password is incorrect`) and no redirect occurs.
5. Verify account is not authenticated.

### 4.3 Invalid email
1. Enter non-existent email and any password.
2. Click `Login`.
3. Verify error message appears (`User not found`).

### 4.4 Empty fields
1. Leave email empty, enter password.
2. Click `Login`.
3. Verify inline validation (`Email is required`).
4. Repeat for empty password and both empty.

### 4.5 SQL injection / XSS in input fields
1. Use payload as email: `" OR 1=1 --` or `<script>alert(1)</script>`.
2. Verify input is sanitized and login fails.

### 4.6 Cross-site request forgery (CSRF)
1. Confirm login form includes CSRF token field (if applicable).
2. Check that missing/invalid token rejects request.

### 4.7 Rate limits and lockout
1. Submit invalid credentials repeatedly (e.g., 5 attempts).
2. Verify account temporarily locked or CAPTCHA displayed.

### 4.8 Password reset link
1. Click `Forgot password`.
2. Verify reset workflow starts with email prompt and confirmation.

### 4.9 Logout and session expiry
1. Login successfully.
2. Click `Logout`.
3. Verify user is redirected to login and protected page access redirects back to login.
4. Verify session expires after timeout and requires re-login.

### 4.10 UI/Accessibility
1. Verify login button disabled until required fields are filled.
2. Verify keyboard navigation (Tab/Enter) works.
3. Verify fields have labels and screen-reader text.

## 5. Notes for automation
- Use stable selectors: `id`, `name`, `data-testid`, not CSS position.
- Add retry for page load delays.
- Store and clear cookies between tests.
- Capture screenshots on failure.
