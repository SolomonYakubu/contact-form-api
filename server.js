const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");

require("dotenv").config();

const transport = {
	service: "gmail",
	auth: {
		user: process.env.EMAIL,
		pass: process.env.PASSWORD,
	},
	tls: {
		rejectUnauthorized: false,
	},
};
const transporter = nodemailer.createTransport(transport);
transporter.verify((error, success) => {
	if (error) {
		console.log(error);
	} else {
		console.log("server is ready");
	}
});
router.post("/send", (req, res, next) => {
	const name = req.body.name;
	const email = req.body.email;
	const message = req.body.message;
	const content = `<h3 style = "font size:18px">Message from <b>${name}</b></h3><p style = "font size:11px">${email}</p><p style = "font size:14px">${message}</p>`;

	const mail = {
		from: name,
		to: "soloyaks.sy@gmail.com",
		subject: "New message from your Website",

		html: content,
	};
	transporter.sendMail(mail, (err, data) => {
		if (err) {
			res.json({ status: "fail" });
		} else {
			res.json({
				status: "success",
			});
		}
	});
});
const app = express();
const port = process.env.PORT || 3002;
app.use(cors());
app.use(express.json());
app.use("/", router);
app.listen(port);
