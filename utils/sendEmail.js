import nodemailer from "nodemailer";
export const sendEmail = async ({ to, subject, html, attachments = [] }) => {
   
    //sender
    const transporter = nodemailer.createTransport({
      host: "localhost",
      service: "gmail",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });
  //recevier
  if (html) {
     const info = await transporter.sendMail({
       from: `"E-commerce Application " <${process.env.EMAIL}>`,
       to,
       subject,
       html,
       
     });
  } else {
    const info = await transporter.sendMail({
      from: `"E-commerce Application " <${process.env.EMAIL}>`,
      to,
      subject,
      html,
      attachments,
    });
    if (info.rejected.length > 0) return false;
    return true;
  }
   
    


}