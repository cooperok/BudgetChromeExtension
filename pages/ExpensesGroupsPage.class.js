var ExpensesGroupsPage_class = new Class({

	Extends: Page_class,

	template_path: 'templates/groups.jst',

	templates: {
		'groups': '{for group in groups}<div class="group" group_id="${group.id}"><span name="title">${group.title}</span><span name="remove" class="remove">x</span></div>{/for}'
	},

	groups: null,

	init: function () {

		this.parent();

		this.groups = {};

		this.fields = {
			title           : this.container.getElement('[name=title]'),
			groups          : this.container.getElement('[name=groups_list]'),
			add_container   : this.container.getElement('[name=add_container]'),
			show            : this.container.getElement('[name=show]'),
			adding_block    : this.container.getElement('[name=adding_block]'),
			add             : this.container.getElement('[name=add]')
		};

		this.groups_controller = controllers_manager.getControllerByName('expenses_groups');

		this.bindEvents();

		this.getGroups();

	},

	bindEvents: function () {

		this.fields.add.addEvent('click', this.onAddGroupClick.bind(this));

		this.fields.show.addEvent('click', this.onShowClick.bind(this));

	},

	onShowClick: function (e) {

		new DOMEvent(e).stop();

		this.fields.adding_block.toggle();

	},

	onAddGroupClick: function (e) {

		new DOMEvent(e).stop();

		var title = this.fields.title.get('value');

		if (title != '') {

			var data = {
				title: title
			};

			this.groups_controller.addRecord(this, this.onAddGroupListener, this.onAddRecordErrorListener, data);

		}

	},

	onAddGroupListener: function (results) {

		this.fields.title.set('value', '');

		this.getGroups();

	},

	onAddRecordErrorListener: function (results) {



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

			this.showGroups();

		}

	},

	onGetGroupsErrorListener: function (error) {



	},

	showGroups: function () {

		if (Object.getLength(this.groups) > 0)

		this.fields.groups.set('html', App.getHTML(this.templates.groups, {groups: this.groups}));

		this.groups_elements = this.fields.groups.getChildren();

		this.initGroups();

	},

	initGroups: function () {

		if (this.groups_elements) {

			this.groups_elements.each(function (group) {

				group.getElement('[name=remove]').addEvent('click', this.onRemoveGroupClick.bind(this, group));

			}, this)

		}

	},


	/**
	 *
	 * REMOVING GROUP
	 *
	 */

	onRemoveGroupClick: function (group, e) {

		new DOMEvent(e).stop();

		this.removeGroup(group.get('group_id'));

	},

	removeGroup: function (group_id) {

		if (this.removed_id) {

			console.error('Trying to remove group before previous group deleted');

		}

		this.removed_id = group_id;

		this.groups_controller.deleteRecord(this, this.onRemoveGroupSuccess, this.onRemoveGroupError, {id: group_id});

	},

	onRemoveGroupSuccess: function (result) {

		if ( result.rowsAffected > 0 ) {

			delete this.groups[this.removed_id];

			var el = this.fields.groups.getElement('[group_id=' + this.removed_id + ']');

			if (el) {

				el.hide();

			}

		}

		this.removed_id = null;

	},

	onRemoveGroupError: function (result) {

		console.error(result.message);

		this.removed_id = null;

	}

});