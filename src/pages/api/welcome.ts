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
      subject: 'WELCOME TO ARAMCO',
      html: `
          <div style="width: 100%; display: flex; justify-content: center;">
        <div style="font-family: Georgia, serif; color: #333; line-height: 1.6; border: 1px solid black; border-radius: 5px; width: 100%; max-width: 600px;  overflow: hidden;">
    
            <div style="text-align: center; background:url(https://cdn.pixabay.com/photo/2022/04/18/17/26/artwork-7141114_960_720.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="background-color: rgba(0, 0, 0, 0.5); width: 100%; padding: 15px 0 10px 0 ;">

                    <img src="https://companieslogo.com/img/orig/2222.SR_BIG.D-9054d0d6.png?t=1720244490" style="width: 20em; max-width: 10em;" />
                    <h1 style="color: white; font-size: 150%;">Welcome to ARAMCO</h1>
                </div>
            </div>
    
            <div style="padding: 10px; text-align: justify;">
                <p>Dear ${name},</p>
          
          <p>Welcome to <strong>Aramco</strong>. We're thrilled to have you on board.</p>
          
          <p>You've successfully created an account using this email address: <strong>${email}</strong>. We are excited to be a part of your journey.</p>
          
          <p>Click <a href="https://aramco.vercel.app/auth/welcome_back?verifier=${verifier}">HERE</a> to verify your account.
          
          <p>If you have any questions or need assistance, feel free to reach out to our support team. We're here to help you every step of the way.</p>
          
          <p>Thank you for choosing Aramco. We look forward to serving you.</p>
          
          <p>Best Regards,</p>
          <p>The Aramco Support Team</p>
          <p><em>Your journey to excellence begins here.</em></p>
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