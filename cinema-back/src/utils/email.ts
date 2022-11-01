import * as nodemailer from 'nodemailer';

type topic = 'welcome' | 'reset' | 'ticket';

interface attachment {
  filename: string;
  path: string;
}

interface mailContent {
  from: string;
  to: string;
  subject: string;
  html: string;
  attachments?: attachment[];
}

class EmailHandler {
  mailTransporter: nodemailer.Transporter;
  addressee: string;
  typeOfSubject: topic;
  filePath?: string | string[];
  mailDetails: mailContent;

  constructor(
    to: string,
    type: topic,
    private name: string,
    private resetLink?: string,
    attachmentPath?: string | string[],
  ) {
    this.mailTransporter = nodemailer.createTransport({
      service: 'Mail.ru',
      auth: {
        user: 'middleagescinema@mail.ru',
        pass: 'webMTeW1FAGame7umGiz',
      },
    });
    this.addressee = to;
    this.typeOfSubject = type;
    this.filePath = attachmentPath;
    this.constructEmail();
  }

  constructEmail() {
    const text = this.createEmailText();
    this.mailDetails = {
      from: 'middleagescinema@mail.ru',
      to: this.addressee,
      html: text,
      subject:
        this.typeOfSubject === 'reset'
          ? 'Сброс пароля'
          : this.typeOfSubject === 'welcome'
          ? 'Добро пожаловать'
          : 'Купленные билеты',
    };
    if (this.typeOfSubject === 'ticket') {
      if (typeof this.filePath === 'object') {
        const attachmentsArr = this.filePath.map((path, idx) => {
          return { filename: `Билет №${idx + 1}`, path };
        });
        this.mailDetails.attachments = attachmentsArr;
      } else {
        this.mailDetails.attachments = [
          { filename: 'Билет №1', path: this.filePath },
        ];
      }
    }
  }

  createEmailText() {
    if (this.typeOfSubject === 'reset') {
      return `
        <div>Здравствуйте, ${this.name}!</div>
        <p>С Вашего аккаунта поступил запрос на сброс пароля, если это были не Вы, то, пожалуйста, проигнорируйте это письмо.</p>
        <p>Для сброса пароля нажмите на ссылку ниже</p>
        <a href="${this.resetLink}">Сбросить пароль</a>
        <p>С уважением, команда кинотеатра "Middle Ages".</p>
      `;
    }
    if (this.typeOfSubject === 'ticket') {
      return `
      <div>Здравствуйте, ${this.name}!</div>
      <p>Благодарим Вас за выбор нашего кинотеатра, мы надеемся, что Вам понравится атмосфера, в которую Вы окунетесь при просмотре фильма!</p>
      <p>Купленные билеты Вы можете найти во вложении этого письма.</p>
      <p>С уважением, команда кинотеатра "Middle Ages".</p>
    `;
    }
    return `
    <div>Здравствуйте, ${this.name}!</div>
    <p>Благодарим Вас за регистрацию на нашем сайте!</p>
    <p>Теперь Вы можете покупать билеты, а также видеть Вашу статистику посещений нашего кинотеатра.</p>
    <p>С уважением, команда кинотеатра "Middle Ages".</p>
  `;
  }

  sendMail() {
    this.mailTransporter.sendMail(this.mailDetails, (err, data) => {
      if (err) {
        console.log(err, 'some error');
      } else {
        console.log('email sent successfully');
      }
    });
  }
}

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

// mailTransporter.sendMail(mailDetails, (err, data) => {
//   if (err) {
//     console.log(err, "some error");
//   } else {
//     console.log("email sent successfully");
//   }
// });

export default EmailHandler;
