const app = require('./app');
const http = require('http').Server(app);
const { port } = require('./config.json');
const initSocket = require('./io');

initSocket(http);

http.listen(port, () => {
	console.log('listening...');
});
