/* tokens */
const API_TOKEN = '2abbf7c3-245b-404f-9473-ade729ed4653';

const validateToken = (req, res, next) => {
	console.log('executing middleware...');
	console.log("headers", req.headers);
	const authToken = req.headers.authorization;
	const authParam = req.query['apiKey']
	if (!authToken) {
		res.statusMessage = "You must send the auth token."
		return res.status(401).end();
	}

	if(authToken !== `Bearer ${API_TOKEN}`) {
		res.statusMessage = "The api auth token doesn't match";
		return res.status(401).end();
	}
	next();   
}

module.exports = validateToken;