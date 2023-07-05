import axios from 'axios';

const zoomAuth = 'https://zoom.us/oauth/';
const zoomAPI = 'https://api.zoom.us/v2/';

export async function getAccessToken() {
	try {
		let oauthToken = Buffer.from(
			`${process.env.clientID}:${process.env.clientSecret}`
		).toString('base64');

		let res = await axios({
			method: 'post',
			url: `${zoomAuth}token?grant_type=account_credentials&account_id=${process.env.accountID}`,
			headers: {Authorization: `Basic ${oauthToken}`}
		});
		return res.data.access_token;
	} catch (e) {
		return false;
	}
}

export async function getUser(accessToken, userID) {
	try {
		let res = await axios({
			method: 'get',
			url: `${zoomAPI}users/${userID}`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		return res.data;
	} catch (e) {
		return e.response.data;
	}
}

export async function getParticipantReport(accessToken, meetingID) {
	try {
		let res = await axios({
			method: 'get',
			url: `${zoomAPI}report/meetings/${meetingID}/participants`,
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		return res.data;
	} catch (e) {
		return e.response.data;
	}
}
