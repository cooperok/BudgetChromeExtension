var Page_class = new Class({

	controllers: null,

	page: null,

	template_path: null,

	template: null,

	template_loaded: false,

	initialize: function (page_name, controllers_list) {

		this.name = page_name;

		this.initControllers(controllers_list);

		this.loadTemplate();

	},

	initControllers: function () {



	},

	loadTemplate: function () {

		if (this.template_path) {

			new Request({
				onSuccess: this.onLoadTemplate.bind(this),
				url: chrome.extension.getURL(this.template_path)
			}).send();

		}

	},

	onLoadTemplate: function (template) {
console.log('onLoadTemplate');
		this.template_loaded = true;

		this.template = template;

	},

	show: function (container) {
console.log('show');
		if (this.template_loaded) {

			this.container = container;

			this.init();

		} else {

			setTimeout(this.show.bind(this, container), 500);

		}

	},

	init: function () {

		this.setTemplate();

	},

	refresh: function () {

		this.setTemplate();

	},

	getData: function () {

		return {};

	},

	setTemplate: function (data) {

		if (this.container && this.template) {

			data = data || this.getData();

			this.container.set('html', App.getHTML(this.template, data));

		}

	}

});