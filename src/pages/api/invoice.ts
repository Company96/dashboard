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
    const name = req.body.firstname;
    const email = req.body.email;
    const plan = req.body.plan;
    const amount = req.body.amount;
    const bonus = req.body.bonus;
    const sum = req.body.sum;
    const date = req.body.date;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Investment Invoice',
      html: `
             <div style="width: 100%; display: flex; justify-content: center;">
        <div style="font-family: Georgia, serif; color: #333; line-height: 1.6; border: 1px solid black; border-radius: 5px; width: 100%; max-width: 600px;  overflow: hidden;">
    
            <div style="text-align: center; background:url(https://cdn.pixabay.com/photo/2022/04/18/17/26/artwork-7141114_960_720.png); background-position: center; background-size: cover; background-repeat: no-repeat;">
                <div style="background-color: rgba(0, 0, 0, 0.5); width: 100%; padding: 15px 0 10px 0 ;">

                    <img src="https://companieslogo.com/img/orig/2222.SR_BIG.D-9054d0d6.png?t=1720244490" style="width: 20em; max-width: 10em;" />
                    <h1 style="color: white; font-size: 150%;">Account Credit Notification</h1>
                </div>
            </div>
    
            <div style="padding: 10px; text-align: justify;">
                <p>Dear <span style="color: green; font-weight: bold;">${name}</span>,</p>
    
                <p>We are pleased to notify you that an amount of <b>$${amount} USD</b> has been credited to your Aramco account. Kindly note that access to these funds will be available on the specified release date.</p>

                <p style="font-size: large; font-weight: bold;">Details:</p>

                <section style="border: 1px solid black;">
                    <table style="width: 100%;">
                        <thead style="background-color: gray; color: white;">
                            <tr>
                                <th style="padding: 10px;">Detail</th>
                                <th style="text-align: end; padding: 10px;">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="padding: 10px;">${plan}</td>
                                <td style="text-align: end; padding: 10px;">$${amount} USD</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px;">Referal Bonus</td>
                                <td style="text-align: end; padding: 10px; border-bottom: 1px dotted black">${bonus}%</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-weight: bold;">Total</td>
                                <td style="text-align: end; padding: 10px; font-weight: bolder; border-bottom: 1px solid black;">$${sum} USD</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px; font-size: small; color: green;"><i>Release date</i></td>
                                <td style="text-align: end; padding: 10px; font-size: small; color: green;"><i>${date}</i></td>
                            </tr>
                        </tbody>
                    </table>
                </section>
    
                <p>We appreciate your ongoing dedication and commitment. Should you have any inquiries regarding this transaction, please do not hesitate to contact us at <a href="mailto:${process.env.EMAIL_USER}" style="color: green; text-decoration: none;">${process.env.EMAIL_USER}</a>.</p>
    
                <p>Sincerely,</p>
                <p><b>CEO</b>, Aramco.</p>
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