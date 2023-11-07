// login  
// registeration
// forget password

const logger = require('../../utils/logger')
const { Admin } = require('../../models')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const { JWT_KEY } = process.env;
const nodemailer = require('nodemailer');
const crypto = require('crypto')



const adminLogin = async (req, res) => {
    logger.info('INFO -> ADMIN LOGIN API CALLED');
    try {
        const { email, password } = req.body;

        // Step 1: Find the admin by email
        let admin = await Admin.findOne({
            where: { email }
        });


        // Step 2: Check if the admin exists
        if (!admin) {
            return res.status(204).json({ message: 'Admin not found' });
        }

        // Step 3: Compare the provided password with the stored hash
        const isValid = await bcrypt.compare(password, admin.password);

        if (!isValid) {
            return res.status(203).json({ message: 'Invalid credentials' });
        }

        // Step 4: Generate and return an authentication token
        const authToken = jwt.sign({ email: admin.email }, JWT_KEY);

        admin = JSON.parse(JSON.stringify(admin))
        delete admin?.password

        res.status(200).json({
            message: 'Login successful',
            payload: admin,
            auth_token: authToken,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};


const adminRegistration = async (req, res) => {
    logger.info('INFO -> ADMIN REGISTRATION API CALLED');
    try {
        const { first_name, last_name, email, password, role } = req.body;

        // Step 1: Hash the password securely
        const hashPassword = await bcrypt.hash(password, 10);

        // Step 2: Create a new admin record in the database
        const result = await Admin.create({
            first_name,
            last_name,
            email,
            password: hashPassword,
            role,
        });

        // Step 3: Remove the password from the result before sending it in the response
        const sanitizedResult = { ...result.toJSON() };
        delete sanitizedResult.password;

        res.status(201).json({
            message: 'Registration successful',
            payload: sanitizedResult,
        });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error during registration', error: error.message });
    }
};


// Function to generate a random OTP
const generateOTP = () => {
    // Generate a random 6-digit OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send the OTP to the user's email
const sendOTPEmail = async (email, otp) => {
    // Create a nodemailer transporter (replace with your SMTP configuration)
    const transporter = nodemailer.createTransport({
        service: 'your_email_service_provider',
        auth: {
            user: 'your_email_username',
            pass: 'your_email_password',
        },
    });

    // Email content
    const mailOptions = {
        from: 'your_email@example.com',
        to: email,
        subject: 'Password Reset OTP',
        text: `Your OTP for password reset is: ${otp}`,
    };

    // Send the email
    try {
        await transporter.sendMail(mailOptions);
        console.log(`OTP sent to ${email}`);
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
};

// Function to initiate the password reset process, provide the hashed OTP, and generate a hashed token
const forgotPassword = async (req, res) => {
    logger.info('INFO -> FORGOT PASSWORD API CALLED');
    try {
        const { email } = req.body;

        console.log(email)

        // Step 1: Check if the user with the provided email exists in your database (replace with your logic)
        const user = await Admin.findOne({ where: { email } });

        if (!user) {
            return res.status(204).json({ message: 'User not found' });
        }

        // Step 2: Generate a random OTP
        const otp = generateOTP();

        // Step 3: Hash the OTP
        const hashedOTP = await jwt.sign({ otp: otp }, JWT_KEY, { expiresIn: '1h' })
        // Step 4: Send the OTP to the user's email (you can do this here or earlier as needed)
        // await sendOTPEmail(email, otp)
        console.log(otp)

        res.status(200).json({ message: 'OTP sent to email', hashedOTP });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error during password reset', error: error.message });
    }
};

// Function to complete the password reset process using the OTP, token, and new password
const completePasswordReset = async (req, res) => {
    logger.info('INFO -> COMPLETE PASSWORD RESET API CALLED');
    try {
        const { email, otp, hashedToken, newPassword } = req.body;

        // Step 1: Check if the user with the provided email exists in your database (replace with your logic)
        const user = await Admin.findOne({ where: { email } });

        if (!user) {
            return res.status(204).json({ message: 'User not found' });
        }

        // Step 2: Verify the OTP provided by the user
        const originalOtp = await jwt.verify(hashedToken, JWT_KEY)

        const otpIsValid = otp === originalOtp?.otp;

        if (!otpIsValid) {
            return res.status(203).json({ message: 'Invalid OTP' });
        }


        // Step 3: Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Step 4: Update the user's password with the new hashed password
        await user.update({ password: hashedPassword });

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Error during password reset', error: error.message });
    }
};




const getAdminInfo = async (req, res) => {
    logger.info('INFO -> GETING INFORMATION OF ADMIN API CALLED')
    try {
        const { email } = req.userData;
        let result = await Admin.findAll({
            where: { email }
        })

       result = JSON.parse(JSON.stringify(result))
       delete result[0].password
        res.status(200).json({
            success: true,
            user: result
        })
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: 'Error generated while processing your request' })
    }
}




module.exports = {
    adminLogin,
    adminRegistration,
    forgotPassword,
    completePasswordReset,
    getAdminInfo
}