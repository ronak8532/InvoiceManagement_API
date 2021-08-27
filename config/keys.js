const {
  mail: { username, password, from, service },
} = require("../config/var");

module.exports = {
	mailer: {
		service: service, // service
		user: username,  // username of mail service
		pass: password, // password of mail service
    	from: from, // from emil
		reporting_email: "" // reply mail
  	}
}