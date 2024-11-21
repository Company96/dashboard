import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';

type OTPData = {
  otp: string;
  expiresAt: number;
};

let savedOTPS: Record<string, OTPData> = {};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const OTP_EXPIRATION_MS = 60 * 1000;

const sendOTP = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  const digits = '0123456789';
  const limit = 4;
  let otp = '';
  for (let i = 0; i < limit; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }

  savedOTPS[email] = {
    otp,
    expiresAt: Date.now() + OTP_EXPIRATION_MS,
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'OTP',
    html: `
     <div style="width: 100%; display: flex; justify-content: center;">
        <div style="font-family: Georgia, serif; color: #333; line-height: 1.6; border: 1px solid black; border-radius: 5px; width: 100%; max-width: 600px;  overflow: hidden;">
    
            <div style="text-align: center; background:url(https://cdn.pixabay.com/photo/2022/04/18/17/26/artwork-7141114_960_720.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="background-color: rgba(0, 0, 0, 0.5); width: 100%; padding: 15px 0 10px 0 ;">

                    <img src="https://companieslogo.com/img/orig/2222.SR_BIG.D-9054d0d6.png?t=1720244490" style="width: 20em; max-width: 10em;" />
                    <h1 style="color: white; font-size: 150%;">Reset password</h1>
                </div>
            </div>
    
            <div style="padding: 10px; text-align: justify;">
                <p><b>DO NOT DISCLOSE!</b></p>
                <p>Enter ${otp} to reset your password.</p>
                <p>Best Regards,</p>
                <p>The Aramco Support Team</p>
            </div>
            <div style="text-align: center; background:url(https://cdn.pixabay.com/photo/2022/04/18/17/26/artwork-7141114_960_720.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="background-color: rgba(0, 0, 0, 0.5); width: 100%; padding: 15px 0 5px 0 ; line-height: 10px; filter: blur(20%); ">
                    <b style="color: rgb(99, 252, 99);">Aramco Corporate Entity</b>
                    <p style="font-size: small; color: rgb(69, 177, 240);"><i>${process.env.EMAIL_USER}</i></p>
                </div>
            </div>
        </div>
    </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.log("Failed to send Email: ", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

const verifyOTP = async (req: NextApiRequest, res: NextApiResponse) => {
  const email = req.body.email;
  const enteredOTP = req.body.otp;

  const savedData = savedOTPS[email];

  if (savedData) {
    const { otp, expiresAt } = savedData;
    const currentTime = Date.now();

    if (currentTime > expiresAt) {
      delete savedOTPS[email];
      res.status(400).json({ message: "OTP has expired" });
      return;
    }

    if (otp === enteredOTP) {
      res.status(200).json({ message: "OTP verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid OTP" });
    }
  } else {
    res.status(400).json({ message: "OTP not found" });
  }
};

const handleOTPRequest = async (req: NextApiRequest, res: NextApiResponse) => {
  const { action } = req.query;

  if (req.method === 'POST') {
    if (action === 'send') {
      await sendOTP(req, res);
    } else if (action === 'verify') {
      await verifyOTP(req, res);
    } else {
      res.status(400).json({ message: "Invalid action" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
};

export default handleOTPRequest;
