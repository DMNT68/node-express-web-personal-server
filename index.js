const mongoose = require('mongoose');
const app = require('./app');
const { API_VERSION, IP_SERVER, PORT_DB, port } = require('./config');

// mongoose.set('useFindAndModify', false);
mongoose.connect(
	`mongodb://${IP_SERVER}:${PORT_DB}/webpersonalandres`,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err, res) => {
		if (err) {
			throw err;
		} else {
			console.log('coneccion a la bdd es correcta');
			app.listen(port, () => {
				console.log(`http://${IP_SERVER}:${port}/api/${API_VERSION}/`);
			});
		}
	}
);
