const EventEmitter = require("events");

const userSubscriber = new EventEmitter();

userSubscriber.on("onUserCreate", function (id, name) {
	console.log(`User ${name} created with id:${id}!`);
});

userSubscriber.on("onUserUpdate", function (id, name) {
	console.log(`User ${name} updated with id:${id}!`);
});

userSubscriber.on("onUserDelete", function () {
	console.log(`User deleted!`);
});

module.exports = userSubscriber;