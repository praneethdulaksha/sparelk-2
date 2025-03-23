import nodemailer from 'nodemailer'

const userMail = process.env.EMAIL_ADDRESS;
const userPass = process.env.EMAIL_APP_PASSWORD
let transporter: any = null;

export const emailConfig = () => {
    console.log('configuring email service');
    transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: userMail,
            pass: userPass
        }
    });
}

export type TMailOptions = {
    to: string,
    subject: string,
    text?: string,
    html?: string,
}

export const sendMail = async (options: TMailOptions) => {
    if (!transporter) {
        emailConfig();
    }
    await transporter.sendMail(
        { ...options, from: userMail },
        (error: any, info: any) => {
            if (error) {
                console.error(error);
                throw new Error('Error sending mail');
            } else {
                console.log('Email sent: ' + info.response);
            }
        }
    );
}