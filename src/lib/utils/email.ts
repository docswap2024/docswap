import 'server-only';

import nodemailer from 'nodemailer';

import { env } from '@/env.mjs';
import { MAIL } from '@/config/mail';
import { MESSAGES } from '@/config/messages';

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

export const sendEmail = async (data: EmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...MAIL,
  });

  // try {
  //   transporter.sendMail({
  //     from: env.SMTP_FROM_EMAIL,
  //     ...data,
  //   });
  //   return true;
  // } catch (error: any) {
  //   throw new Error(MESSAGES.ERROR_SENDING_EMAIL);
  // }

  await new Promise((resolve, reject) => {
    transporter.sendMail({
      from: env.SMTP_FROM_EMAIL,
      ...data,
    }, (error) => {
      if (error) {
        reject(new Error(MESSAGES.ERROR_SENDING_EMAIL));
      } else {
        resolve(true);
      }
    });
  });
};

type MessageEmailPayload = {
  from: string;
  to: string;
  subject: string;
  html: string;
  text: string;
};

export const sendMessageEmail = async (data: MessageEmailPayload) => {
  const transporter = nodemailer.createTransport({
    ...MAIL,
  });
  await new Promise((resolve, reject) => {
    transporter.sendMail({
      ...data,
    }, (error) => {
      if (error) {
        reject(new Error(MESSAGES.ERROR_SENDING_EMAIL));
      } else {
        resolve(true);
      }
    });
  });
  // try {
  //   transporter.sendMail({
  //     ...data,
  //   });
  //   return true;
  // } catch (error: any) {
  //   throw new Error(MESSAGES.ERROR_SENDING_MESSAGE);
  // }
};
