/* eslint-disable-next-line no-unused-vars */
import dotenv from 'dotenv/config';
import logger from './logger.js';
import {getAccessToken, getParticipantReport, getUser} from './zoom.js';
import {createHmac} from 'node:crypto';
import express from 'express';
const app = express();
const port = process.env.PORT || 3000;

if (!process.env.accountID) logger.warn('accountID missing in .env');
if (!process.env.clientID) logger.warn('clientID missing in .env');
if (!process.env.clientSecret) logger.warn('clientSecret missing in .env');
if (!process.env.webhookSecret) logger.warn('webhookSecret missing in .env');

app.set('query parser', 'simple');

app.post('/', express.json(), async function webhookHandler(req, res) {
	let webhookSecretToken = process.env.webhookSecret;
	let event = req.body.event;

	if (!event) {
		res.sendStatus(400);
		return;
	}

	if (!webhookSecretToken) {
		res.sendStatus(401);
		return;
	}

	if (event === 'endpoint.url_validation') {
		let hashForPlainToken = createHmac('sha256', webhookSecretToken)
			.update(req.body.payload.plainToken)
			.digest('hex');
		res.status(200);
		res.json({
			plainToken: req.body.payload.plainToken,
			encryptedToken: hashForPlainToken
		});
		return;
	}

	let message = `v0:${req.headers['x-zm-request-timestamp']}:${JSON.stringify(
		req.body
	)}`;
	let hashForVerify = createHmac('sha256', webhookSecretToken)
		.update(message)
		.digest('hex');
	let signature = `v0=${hashForVerify}`;

	if (req.headers['x-zm-signature'] !== signature) {
		res.sendStatus(400);
		return;
	}

	res.sendStatus(200);

	if (event === 'meeting.ended') {
		if (!req.body.payload.object.host_id) {
			logger.warn('no host_id');
			return;
		}

		if (!req.body.payload.object.id) {
			logger.warn('no meeting id');
			return;
		}

		let hostID = req.body.payload.object.host_id;
		let meetingID = req.body.payload.object.id;

		logger.info(`Meeting ${meetingID} ended.  Getting participant report.`);

		//wait 20 seconds to give the report a chance to be created
		await new Promise((r) => setTimeout(r, 20000));

		const accessToken = await getAccessToken();
		if (!accessToken) {
			logger.error('Unable to get access token');
			return;
		}

		const user = await getUser(accessToken, hostID);
		if (!!user.email === false) {
			logger.error(`Error getting user | ${user}`);
			return;
		}

		const report = await getParticipantReport(accessToken, meetingID);
		if (!!report === false) {
			logger.error(`Error getting participant report | ${report}`);
			return;
		}

		logger.info(
			`User: ${JSON.stringify(user)} | Participant Report: ${JSON.stringify(
				report
			)}`
		);
	}
});

app.get('/', express.json(), async function mainHandler(req, res) {
	res.status(200).json({status: 'ok'});
});

app.listen(port, function startServer() {
	logger.info(`listening on port ${port}`);
});
