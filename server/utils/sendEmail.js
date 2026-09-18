import axios from "axios";

const sendEmail = async (to, subject, html) => {
    try {
        const response = await axios.post(
            "https://api.brevo.com/v3/smtp/email",
            {
                sender: {
                    name: "HackArena",
                    email: process.env.SENDER_EMAIL,
                },
                to: [
                    {
                        email: to,
                    },
                ],
                subject: subject,
                htmlContent: html,
            },
            {
                headers: {
                    "api-key": process.env.BREVO_API_KEY,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("Email sent successfully:", response.data.messageId);

    } catch (error) {
        console.error(
            "Email sending failed:",
            error.response?.data || error.message
        );
    }
};

export default sendEmail;