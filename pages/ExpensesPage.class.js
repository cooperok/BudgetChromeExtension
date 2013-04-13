var ExpensesPage_class = new Class({

	Extends: Page_class,

	template_path: 'templates/expenses.jst',

	init: function () {

		this.groups = {};

		this.expenses = {};

		this.date_helper = new DatetimeHelper_class();

		this.parent();

		this.initFields();

		this.bindEvents();

		this.groups_controller = controllers_manager.getControllerByName('expenses_groups');

		this.expenses_controller = controllers_manager.getControllerByName('expenses');

		this.getGroups();

	},

	initFields: function () {

		this.fields = {
			expenses_list: this.container.getElement('[name=expenses_list]'),
			title: this.container.getElement('[name=title]'),
			price: this.container.getElement('[name=price]'),
			date: this.container.getElement('[name=date]'),
			group_id: this.container.getElement('[name=group_id]'),
			description: this.container.getElement('[name=description]'),
			date_picker: this.container.getElement('[name=date_picker]'),
			add: this.container.getElement('[name=add]'),
			show: this.container.getElement('[name=show]'),
			adding_block: this.container.getElement('[name=adding_block]')
		};

	},

	getData: function () {

		return {
			expenses: this.expenses,
			groups: this.groups
		};

	},

	refresh: function () {

		this.parent();

		this.initFields();

		this.bindEvents();

	},

	bindEvents: function () {

		if (this.fields.add) {

			this.fields.add.addEvent('click', this.onAddExpenseClick.bind(this));

		}

		this.fields.show.addEvent('click', this.onShowClick.bind(this));

	},

	onShowClick: function (e) {

		new DOMEvent(e).stop();

		this.fields.adding_block.toggle();

	},

	getGroups: function () {

		this.groups_controller.getRecords(
			this,
			this.onGetGroupsListener,
			this.onGetGroupsErrorListener
		);

	},

	onGetGroupsListener: function (results) {

		if (results && results.rows.length > 0) {

			for (var i = 0; i < results.rows.length; i++) {

				this.groups[results.rows.item(i).id] = {
					id: results.rows.item(i).id,
					title: results.rows.item(i).title
				};

			}

			this.refresh();

		}

	},

	onGetGroupsErrorListener: function (error) {



	},

	checkFields: function () {

		var result = true,
			fields = ['title', 'price', 'date'],
			field;

		for (var i = 0; i < fields.length; i++) {

			field = this.fields[fields[i]];

			if (field && field.get('value') == '') {

				result = false;

				this.fields[fields[i]].highlight('#ffa6a6');

				break;

			}

		}

		if (result) {

			try {

				this.date_helper.getTimestampByDateString(this.fields.date.get('value'));

			} catch (e) {

				result = false;

			}

		}

		return result;

	},

	/**
	 *
	 * Adding expense
	 *
	 */

	onAddExpenseClick: function (e) {

		new DOMEvent(e).stop();

		if (this.checkFields()) {

			var data = {
				title: this.fields.title.get('value'),
				price: parseFloat(this.fields.price.get('value').replace(',', '.')),
				group_id: this.fields.group_id.get('value'),
				date: this.date_helper.getTimestampByDateString(this.fields.date.get('value')),
				description: this.fields.description.get('value')
			};

			this.expenses_controller.addRecord(this, this.onAddExpenseSuccess, this.onAddExpenseError, data);

		}

	},

	onAddExpenseSuccess: function(result) {



	},

	onAddExpenseError: function (error) {

		console.log(error);

	}

});