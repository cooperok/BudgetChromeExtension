var ControllersManager_class = new Class({

	/**
	 * List of available controllers
	 * @type Object {controller_name: controller_object}
	 */
	controllers: null,

	initialize: function () {

		this.initControllers();

	},

	initControllers: function () {

		this.controllers = {};

		new Request({
			onSuccess: this.onLoadControllersList.bind(this),
			url: chrome.extension.getURL('json/controllers.json')
		}).send();

	},

	onLoadControllersList: function (controllers) {

		controllers = JSON.parse(controllers);

		Object.each(controllers, function (properties, name) {

			if (properties.class_name) {

				try {

					var class_name = eval(properties.class_name);

					this.controllers[name] = new class_name();

				} catch (e) {

					console.log(e);

				}

			}

		}, this);

	},

	getControllerByName: function (name) {

		return this.controllers[name] || null;

	}

});