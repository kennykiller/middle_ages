import nodemailer from "nodemailer";

class EmailHandler {
  defaults = {
    service: "Mail.ru",
    auth: {
      user: "middleagescinema@mail.ru",
      pass: "webMTeW1FAGame7umGiz",
    },
  };
  constructor() {}
}
const mailTransporter = nodemailer.createTransport({
  service: "Mail.ru",
  auth: {
    user: "middleagescinema@mail.ru",
    pass: "webMTeW1FAGame7umGiz",
  },
});

// const mailDetails = {
//   from: "middleagescinema@mail.ru",
//   to: "vadim2505@mail.ru",
//   subject: "Тестовое письмо",
//   text: "check attachment",
//   attachments: [
//     {
//       filename: "somepdf.pdf",
//       path: "../src/coupon.pdf", //адаптировать путь
//     },
//   ],
// };

mailTransporter.sendMail(mailDetails, (err, data) => {
  if (err) {
    console.log(err, "some error");
  } else {
    console.log("email sent successfully");
  }
});

export default mailTransporter;
