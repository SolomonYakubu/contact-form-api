const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const cors = require("cors");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

require("dotenv").config();

const myOAuth2Client = new OAuth2(
	process.env.CLIENT_ID,
	process.env.CLIENT_SECRET,
	"https://developers.google.com/oauthplayground",
);

myOAuth2Client.setCredentials({
	refresh_token:
		"1//04ax8WEsJJb90CgYIARAAGAQSNwF-L9IrLuz0dlXgHysLSljDdMkd_ZOsLq7agECSN75evyG1Vrhm5E7IpWXP0mDJePMbV34V_HM",
});
const myAccessToken = myOAuth2Client.getAccessToken();
const transport = {
	service: "gmail",
	auth: {
		type: "OAuth2",
		user: process.env.EMAIL,
		clientId: process.env.CLIENT_ID,
		clientSecret: process.env.CLIENT_SECRET,
		refreshToken:
			"1//04ax8WEsJJb90CgYIARAAGAQSNwF-L9IrLuz0dlXgHysLSljDdMkd_ZOsLq7agECSN75evyG1Vrhm5E7IpWXP0mDJePMbV34V_HM",
		accessToken: myAccessToken,
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
	const content = `<h4 style = "font-size:18px;font-family:geneva">Hey!!, you've got a message from <b style = "color:indigo">${name}</b></h3><p style = "font-size:13px">Email: ${email}</p><p style = "font-size:16px;font-weight:300;font-family:verdana">${message}</p>`;

	const mail = {
		from: name,
		to: "soloyaks.sy@gmail.com",
		subject: "New message from your Website",

		html: content,
	};
	const reply = {
		from: "Yakubu Solomon",
		to: email,
		subject: "Yakubu Solomon",
		html: `<div style = 'font-size:16px; border-style:solid;border-width:2px;padding:10px; border-color:indigo;font-weight:500;font-family:verdana'><p>Hi ${name}, your message was received and would be responded to shortly. <p>Best Regards.</p></p><p>Yakubu Solomon.</p></div>`,
	};
	transporter.sendMail(mail, (err, data) => {
		if (err) {
			res.status(500).json({ status: "fail" });
		} else {
			res.status(200).json({
				status: "success",
			});
			transporter.sendMail(reply, (err, data) => {
				if (err) {
					res.json({ status: "reply failed" });
				} else {
					res.json({
						status: "Reply successful",
					});
				}
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
