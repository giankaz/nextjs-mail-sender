import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { MailDto } from "root/interfaces/MailDto";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { user_mail, user_name, subject, content } = req.body as MailDto;

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.NEXT_PUBLIC_MAIL_USER,
          pass: process.env.NEXT_PUBLIC_MAIL_PASS,
        },
      });

      await new Promise((resolve, reject) => {
        transporter.verify((error, success) => {
          if (error) {
            console.log(error);
            reject(error);
          } else {
            console.log("Server is ready to send mails");
            resolve(success);
          }
        });
      });

      await new Promise((resolve, reject) => {
        transporter.sendMail(
          {
            to: process.env.NEXT_PUBLIC_MAIL_USER,
            subject,
            text: `
            Remetente: ${user_name}
            Email do remetente: ${user_mail}

            ${content}
            `,
          },
          (err, info) => {
            if (err) {
              console.error(err);
              reject(err);
              return res.status(500).json(err);
            } else {
              console.log(info);
              resolve(info);
              return res.status(200).json(info);
            }
          }
        );
      });

      return res.status(201).json({
        sent: true,
      });
    } catch (err) {
      return res.status(500).json({ error: "Interval server error" });
    }
  }

  return res.status(401).json({ error: "Forbbiden method" });
}
