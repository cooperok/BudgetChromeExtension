var Controller_class = new Class({

	/**
	 * Name of operating table
	 */
	table_name: null,

	/**
	 * Fields of table
	 */
	fields: null,

	db: null,

	initialize: function () {

		this.db = new Database_class();

	},

	getRecords: function (bind, callback_succes, callback_error, fields, where, order_by, limit) {

		if (!bind || !callback_succes || !callback_error) {

			bind = this;
			callback_succes = this.onGetRecords;
			callback_error = this.onGetRecordsError;

		}

		this.db.selectRecords(
			this.table_name,
			bind,
			callback_succes,
			callback_error,
			fields,
			where,
			order_by,
			limit
		);

	},

	addRecord: function (bind, callback_succes, callback_error, fields_data) {

		if (!bind || !callback_succes || !callback_error) {

			bind = this;
			callback_succes = this.onAddRecords;
			callback_error = this.onAddRecordsError;

		}

		this.db.insertRecord(
			this.table_name,
			bind,
			callback_succes,
			callback_error,
			fields_data
		);

	},

	deleteRecord: function (bind, callback_succes, callback_error, fields_data) {

		if (!bind || !callback_succes || !callback_error) {

			bind = this;
			callback_succes = this.onDeleteRecords;
			callback_error = this.onDeleteRecordsError;

		}

		this.db.deleteRecord(
			this.table_name,
			bind,
			callback_succes,
			callback_error,
			fields_data
		);

	},

	//CALLBACKS

	onGetRecords: function (results) {



	},

	onGetRecordsError: function (error) {



	},

	onAddRecords: function (results) {



	},

	onAddRecordsError: function (error) {



	},

	onDeleteRecords: function (results) {



	},

	onDeleteRecordsError: function (error) {



	}

});