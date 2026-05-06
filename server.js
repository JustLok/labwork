require('dotenv').config();
const Koa = require('koa');
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const path = require('path');
const nodemailer = require('nodemailer');
const Router = require('@koa/router');

const app = new Koa();
const router = new Router();
const PORT = 3000;

app.use(bodyParser());
app.use(serve(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: 'in-v3.mailjet.com',
    port: 587,
    auth: {
        user: process.env.MAILJET_API_KEY,
        pass: process.env.MAILJET_SECRET_KEY
    }
});

router.post('/api/contact', async (ctx) => {
    const { name, email, subject, message } = ctx.request.body;

    if (!name || !email || !subject || !message) {
        ctx.status = 400;
        ctx.body = { error: "Всі поля є обов'язковими" };
        return;
    }

    try {
        console.log("Спроба відправити лист через Mailjet...");

        const info = await transporter.sendMail({
            from: process.env.SENDER_EMAIL, 
            replyTo: email, 
            to: process.env.RECEIVER_EMAIL, 
            subject: `Нове повідомлення: ${subject}`,
            text: `Ім'я: ${name}\nEmail: ${email}\nПовідомлення:\n${message}`
        });

        console.log("Mailjet прийняв лист:", info.messageId);
        ctx.status = 200;
        ctx.body = { message: "Повідомлення успішно відправлено!" };
    } catch (error) {
        console.error("Помилка Mailjet:", error);
        ctx.status = 500;
        ctx.body = { error: "Помилка при відправленні листа" };
    }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});