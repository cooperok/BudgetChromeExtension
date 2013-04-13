var Pages_class = new Class({

	options: {
		json_url: 'json/pages_list.json'
	},

	/**
	 * List of pages properties
	 * @type Object
	 */
	pages_list: null,

	/**
	 * List of pages objects
	 * @type Object {page_name: value: page_object}
	 */
	pages: null,

	/**
	 * Elements to change pages
	 * @type Object {tab_name: tab(Element)}
	 */
	tabs: null,

	initialize: function () {

		this.container = document.id('tabs_container');

		this.initPages();

		this.initTabs();

	},

	initPages: function () {

		this.pages = {};

		new Request({
			onSuccess: this.onLoadPagesList.bind(this),
			url: chrome.extension.getURL(this.options.json_url)
		}).send();

	},

	onLoadPagesList: function(response) {

		if (response) {

			var pages_list = JSON.parse(response);

			Object.each(pages_list, function (page_properties, page_name) {

				if (page_properties.class_name) {

					try {

						var class_name = eval(page_properties.class_name);

						this.pages[page_name] = new class_name(page_name, page_properties.controllers);

					} catch (e) {

						console.log(e);

					}

				}

			}, this);

			this.showPage('expenses');

		}

	},

	initTabs: function () {

		this.content = this.container.getElement('[name=content]');

		this.tabs = {};

		var tabs = this.container.getElements('[name=tab]');

		if (tabs) {

			tabs.each(function(tab){

				var name = tab.get('page');

				if (name) {

					this.tabs[name] = tab;

					tab.addEvent('click', this.onTabClick.bind(this, tab));

				}

			}, this);

		}

	},

	onTabClick: function (tab, e) {

		new DOMEvent(e).stop();

		this.showPage(tab.get('page'));

	},

	showPage: function (page_name) {

		if (this.pages[page_name]) {
console.log('showPage: ' + page_name);
			this.pages[page_name].show(this.content);

		}

		this.highlightTab(page_name);

	},

	highlightTab: function (tab_name) {

		Object.each(this.tabs, function (tab) {

			tab.removeClass('active');

		}, this);

		this.tabs[tab_name].addClass('active');

	}

});