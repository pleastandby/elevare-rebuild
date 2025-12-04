import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';

// Create a transporter object using SMTP transport
const createTransporter = () => {
    // Check if email configuration is available
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.warn('Email configuration missing. OTPs will be logged to console.');
        return null;
    }

    return nodemailer.createTransporter({
        service: 'gmail', // or any other email service
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

// Generate OTP
const generateOTP = () => {
    return otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
        digits: true
    });
};

// Send OTP email
const sendOTPEmail = async (email, otp) => {
    try {
        const transporter = createTransporter();
        
        // If no transporter available, log OTP to console (for development)
        if (!transporter) {
            console.log(`\n==========================================`);
            console.log(`🔔 OTP FOR ${email}: ${otp}`);
            console.log(`==========================================\n`);
            return true; // Return true so development continues
        }
        
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset OTP - Elevare',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h2 style="color: #0079fc; margin: 0;">Elevare</h2>
                        <p style="color: #666; margin: 5px 0;">Password Reset Request</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 8px; text-align: center; margin: 20px 0;">
                        <h3 style="color: #333; margin: 0 0 20px 0;">Your OTP Code</h3>
                        <div style="font-size: 32px; font-weight: bold; color: #0079fc; letter-spacing: 5px; margin: 20px 0;">
                            ${otp}
                        </div>
                        <p style="color: #666; margin: 20px 0 0 0;">This code will expire in 10 minutes</p>
                    </div>
                    
                    <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                        <p style="color: #856404; margin: 0; font-size: 14px;">
                            <strong>Security Notice:</strong> Never share this OTP with anyone. If you didn't request this password reset, please ignore this email.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; margin: 0; font-size: 12px;">
                            This is an automated message from Elevare. Please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`OTP email sent successfully to ${email}`);
        return true;
    } catch (error) {
        console.error('Error sending email:', error);
        
        // Fallback: log OTP to console if email fails
        console.log(`\n==========================================`);
        console.log(`🔔 EMAIL FAILED - OTP FOR ${email}: ${otp}`);
        console.log(`==========================================\n`);
        
        return false; // Return false so the controller knows email failed
    }
};

export { generateOTP, sendOTPEmail };
