# Email OTP Setup Guide

## How It Works
The system uses **one service email** to send OTPs to **all your users**. Users don't need to configure anything - they just receive OTPs at their registered email addresses.

## Setup Steps

### 1. Configure Gmail Service Email
Create a dedicated Gmail account for your app (e.g., `noreply@yourapp.com` or `elevare.system@gmail.com`):

1. **Enable 2-Factor Authentication** on the Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate a new app password
   - Use "Mail" for the app and "Other (Custom name)" for device
3. **Add to your .env file**:
   ```env
   EMAIL_USER="your-service-email@gmail.com"
   EMAIL_PASS="your-16-character-app-password"
   ```

### 2. Email Flow
```
User enters email → System generates OTP → System sends OTP to user's email → User enters OTP → Password reset
```

### 3. Development Mode (No Email Setup)
If you don't configure email, the system will:
- Log OTPs to console for testing
- Show "check console for development mode" message
- Continue working for development/testing

### 4. Production Considerations
- Use a domain email (noreply@yourdomain.com) for better deliverability
- Configure SPF/DKIM records for your domain
- Monitor email sending limits (Gmail: 500 emails/day)

## Example .env Configuration
```env
# Service email that sends OTPs TO users
EMAIL_USER="elevare.system@gmail.com"
EMAIL_PASS="abcd efgh ijkl mnop"  # 16-character app password
```

## Security Notes
- Never use your personal Gmail password
- Use App Passwords, not regular passwords
- The service email is only for SENDING, not receiving
- Users receive OTPs at THEIR registered emails, not the service email
