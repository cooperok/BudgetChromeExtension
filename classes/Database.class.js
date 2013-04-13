var Database_class = new Class({

	Implements: [Class.Singleton],

	db_version: '1.0',

	db_name: 'budget',

	db_display_name: 'budget',

	db_size: 5 * 1024 * 1024, //5Mb

	db: null,

	options: {
		json_url: 'json/database_schema.json'
	},

	/**
	 * List of SQLiteTable_class objects
	 * @type Object
	 */
	tables: {},

	initialize: function () {

		return this.check() || this.setup();

	},

	setup: function () {

		this._createDescriptions();

		this._loadDB();

		this._loadTablesSchema();

		this._createTables();

	},

	_createDescriptions: function () {

		//ON DELETE CASCADE ON UPDATE CASCADE

		this.tables_descriptions = {
			'expenses_groups': {    //table name
				fields: {           //list of fields
					id          : 'INTEGER PRIMARY KEY AUTOINCREMENT',
					title       : 'TEXT'
				}
			},
			'revenues_groups': {
				fields: {
					id          : 'INTEGER PRIMARY KEY AUTOINCREMENT',
					title       : 'TEXT'
				}
			},
			'expenses': {
				fields: {
					id          : 'INTEGER PRIMARY KEY AUTOINCREMENT',
					title       : 'TEXT',
					group_id    : 'INTEGER',
					price       : 'REAL NOT NULL',
					date        : 'INTEGER NOT NULL',
					description : 'TEXT'
				},
				extra: ['FOREIGN KEY(group_id) REFERENCES expenses_groups(id) ON DELETE CASCADE ON UPDATE CASCADE']
			},
			'revenues': {
				fields: {
					id          : 'INTEGER PRIMARY KEY AUTOINCREMENT',
					title       : 'TEXT',
					group_id    : 'INTEGER',
					price       : 'REAL NOT NULL',
					date        : 'INTEGER NOT NULL',
					description : 'TEXT'
				},
				extra: ['FOREIGN KEY(group_id) REFERENCES revenues_groups(id) ON DELETE CASCADE ON UPDATE CASCADE']
			}
		}

	}.protect(),

	/**
	 * Openind database
	 */
	_loadDB: function () {

		try {

			this.db = openDatabase(this.db_name, this.db_version, this.db_display_name, this.db_size);

		} catch (e) {

		}

	}.protect(),

	_loadTablesSchema: function () {

		new Request({
			onSuccess: this.onTablesSchemaLoad.bind(this),
			url: chrome.extension.getURL(this.options.json_url)
		}).send();

	}.protect(),

	_executeSql: function (query, callback_succes, callback_error, bind) {

		this.db.transaction(function (tx) {

			tx.executeSql(
				query,
				[],
				this.onExecuteSqlSuccess.bind(this, callback_succes, bind),
				this.onExecuteSqlError.bind(this, callback_error, bind)
			);

		}.bind(this));

	}.protect(),

	_createTables: function () {

		var queries = [];

		Object.each(this.tables_descriptions, function (table_description, table_name) {

			this.tables[table_name] = new SQLiteTable_class(table_name);

			//Adding table fields to object
			Object.each(table_description.fields, function (field_type, field_name) {

				this.tables[table_name].addField(field_name, field_type);

			}, this);

			if (typeOf(table_description.extra) == 'array') {

				this.tables[table_name].addExtra(table_description.extra);

			}

			//collecting creation queries
			queries.push(this.tables[table_name].getCreateQuery());

		}, this);

		//Creating databases
		for (var i = 0; i < queries.length; i++) {

			this._executeSql(queries[i]);

		}

	}.protect(),

	_checkTable: function (table_name) {

		if (!this.tables[table_name]) {

			throw new Error('Table ' + table_name + ' not exists');

		}

		return true;

	}.protect(),

	//LISTENERS

	onTablesSchemaLoad: function (response) {

		if (response) {



		}

	},

	//PUBLIC METHODS

	selectRecords: function (table, bind, callback_succes, callback_error, fields, where, order_by, limit) {

		if (this._checkTable(table)) {

			this._executeSql(
				this.tables[table].getSelectQuery(fields, where, order_by, limit),
				callback_succes,
				callback_error,
				bind
			);

		}

	},

	insertRecord: function (table, bind, callback_succes, callback_error, fields_values) {

		if (this._checkTable(table)) {

			this._executeSql(
				this.tables[table].getInsertQuery(fields_values),
				callback_succes,
				callback_error,
				bind
			);

		}

	},

	deleteRecord: function (table, bind, callback_succes, callback_error, fields_values) {

		if (this._checkTable(table)) {

			this._executeSql(
				this.tables[table].getDeleteQuery(fields_values),
				callback_succes,
				callback_error,
				bind
			);

		}

	},

	onExecuteSqlSuccess: function (callback, bind, tx, results) {

		if (callback && bind) {

			callback.apply(bind, [results]);

		}

	},

	onExecuteSqlError: function (callback, bind, tx, results) {

		if (callback && bind) {

			callback.apply(bind, [results]);

		}

	},

});