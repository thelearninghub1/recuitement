const nodemailer = require('nodemailer');

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true, // SSL
    auth: {
      user: process.env.SMTP_EMAIL_SCHOOL,
      pass: process.env.SMTP_PASSWORD_SCHOOL,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_SCHOOL || `TheTeachingPath <${process.env.SMTP_EMAIL_SCHOOL}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  await transporter.sendMail(mailOptions);
};

exports.sendEmailCandidates = async (options) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.SMTP_EMAIL_CANDIDATE,
      pass: process.env.SMTP_PASSWORD_CANDIDATE,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_FROM_CANDIDATE || `TheTeachingPath Careers <${process.env.SMTP_EMAIL_CANDIDATE}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html || options.message,
  };

  await transporter.sendMail(mailOptions);
};