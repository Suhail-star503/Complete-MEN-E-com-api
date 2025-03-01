
import nodemailer from 'nodemailer';

// Function to send email
const sendMail = async (to, subject,html) => {
    try {
        // Create a transporter object using SMTP transport
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMPT_USER, // SMTP username
                pass: process.env.SMPT_PASS, // SMTP password
            },
        });

        // Email options
        const mailOptions = {
            from: process.env.SMPT_USER, 
            to: to,
            subject: subject, 
            
            html: html, 
           
        };

        // Send email
        await transporter.sendMail(mailOptions);
        
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Error sending email');
    }
};

export default sendMail;