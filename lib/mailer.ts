import nodemailer from "nodemailer";

const host = process.env.SMTP_SERVER;
const port = process.env.SMTP_PORT;
const user = process.env.SMTP_USERNAME;
const pass = process.env.SMTP_TOKEN;

if (!host || !port || !user || !pass) {
  throw new Error(
    "Missing SMTP_SERVER/SMTP_PORT/SMTP_USERNAME/SMTP_TOKEN. Check your .env(.local) file."
  );
}

export const mailer = nodemailer.createTransport({
  host,
  port: Number(port),
  secure: Number(port) === 465,
  auth: { user, pass },
});

export const CONTACT_MAILBOX = user;
