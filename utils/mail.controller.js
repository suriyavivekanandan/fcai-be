import nodemailer from "nodemailer";
import isEmpty from "is-empty";
import { EmailTemplate } from "@/models/email.template.model";
import config from "@/config";

const sendEmail = async (toEmail, content) => {
  console.log('config.GMAIL_USER,: ', config.GMAIL_USER,);
  console.log('config.GMAIL_PASS: ', config.GMAIL_PASS);
  try {
    const { subject, template } = content;
    const transport = nodemailer.createTransport({
      service: 'gmail', // Use Gmail service
      auth: {
        user: config.GMAIL_USER, // Your Gmail address
        pass: config.GMAIL_PASS, // Your Gmail password or App Password
      },
    });

    const mailSentInformation = await transport.sendMail({
      from: config.GMAIL_USER, // Use the same Gmail address
      to: toEmail,
      subject,
      html: template,
    });

    console.log(
      "Mail sent info: ",
      mailSentInformation.accepted,
      mailSentInformation.messageId
    );
    return true;
  } catch (error) {
    console.error("Error in sending email", error);
    return false;
  }
};

export const sendEmailViaTemplate = async ({ identifier, to, content }) => {
  console.log(' identifier, to, content : ', identifier, to, content);
  console.log(identifier);
  try {
    const template = await EmailTemplate.findOne({ identifier: identifier });

    if (isEmpty(template)) {
      console.log("No email template found for", identifier);
      return false;
    }

    if (template.status === "inactive") {
      console.log(`${identifier} template is currently inactive`);
    }

    const mailContent = { subject: "", template: "" };

    mailContent.subject = template.subject;
    mailContent.template = template.content;

    switch (identifier) {
      case "REGISTERATION":
        mailContent.template = mailContent.template
          .replaceAll("##NAME##", content.name)
          .replaceAll("##OTP##", content.Otp);
        break;
      case "FORGET_PASSWORD_MAIL":
        mailContent.template = mailContent.template
          .replaceAll("##NAME##", content.name)
          .replaceAll("##OTP##", content.Otp);
        break;
    
    }

    return await sendEmail(to, mailContent);
  } catch (error) {
    console.error("sendEmailViaTemplate", error);
    return false;
  }
};