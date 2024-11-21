import { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});


const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const email = req.body.email;
    const name = req.body.firstName;
    const verifier = req.body.verifier

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Action Required: Verify Your ARAMCO Account',
      html: `
             <div style="width: 100%; display: flex; justify-content: center;">
        <div style="font-family: Georgia, serif; color: #333; line-height: 1.6; border: 1px solid black; border-radius: 5px; width: 100%; max-width: 600px;  overflow: hidden;">
    
            <div style="text-align: center; background:url(https://cdn.pixabay.com/photo/2022/04/18/17/26/artwork-7141114_960_720.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="background-color: rgba(0, 0, 0, 0.5); width: 100%; padding: 15px 0 10px 0 ;">

                    <img src="https://companieslogo.com/img/orig/2222.SR_BIG.D-9054d0d6.png?t=1720244490" style="width: 20em; max-width: 10em;" />
                    <h1 style="color: white; font-size: 150%;">Verify Account</h1>
                </div>
            </div>
    
            <div style="padding: 10px;">
                <p style="color: green; font-weight: bold;">Dear ${name},</p>
                            
                <p>Thank you for choosing Aramco! We noticed that you haven't verified your email address yet.</p>
                
                <p>To complete your account setup, please verify your email by clicking the link below:</p>
                
                <p><a href="https://aramco.vercel.app/auth/welcome_back?verifier=${verifier}" style="color: #1a73e8; text-decoration: none; font-weight: bold;">Verify My Account</a></p>
                
                <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:${process.env.EMAIL_USER}" style="color: #1a73e8; text-decoration: none;">${process.env.EMAIL_USER}</a>. We're here to help.</p>
                
                <p>Best regards,</p>
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
  
  

    try{
      await transporter.sendMail(mailOptions);
      res.status(200).json({message: "Email sent successfully"})
    }catch(error){
      console.log("Failed to send Email; ", error)
    }
  }

  return res.status(400).json({message: "Bad request"})
}

export default handler;