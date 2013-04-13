var SQLiteTable_class = new Class({

	/**
	 * Table name
	 * @type String
	 */
	name: null,

	/**
	 * Table fields
	 * @type Object {key - field name, value - field type}
	 */
	fields: null,

	/**
	 * Extra values of fields (foreign keys, etc)
	 * @type Array
	 */
	extra: null,

	initialize: function (name, fields) {

		this.name = name;

		this.fields = {};

		this.extra = [];

	},

	_makeWhere: function (fields) {

		var where = '';

		if (fields && typeOf(fields) == 'object') {

			var fields_values = [];

			Object.each(fields, function (value, name) {

				switch (typeOf(value)) {

					case 'array':

						fields_values.push(name + " IN (" + value.join(',') + " ");

						break;

					case 'string':

						fields_values.push(name + " = " + value + " ");

				}

				where = 'WHERE ' + fields_values.join(' AND ');

			}, this);

		}

		return where;

	}.protect(),

	// PUBLIC METHODS

	/**
	 * Adding new table field
	 * @param name - String - name of field
	 * @param type - String - type and additional params of field (primary key, unique, etc.)
	 */
	addField: function (name, type) {

		this.fields[name] = {
			name: name,
			type: type
		}

	},

	/**
	 * Adding extra field values (foreign keys, etc)
	 */
	addExtra: function (extra) {

		switch (typeOf(extra)) {

			case 'string':

				this.extra.push(extra);

				break;

			case 'array':

				this.extra.combine(extra);

				break;

		}
		
	},

	getCreateQuery: function () {

		var fields = [];

		Object.each(this.fields, function (field, name) {

			fields.push(field.name + ' ' + field.type);

		}, this);

		if (this.extra.length) {

			fields.combine(this.extra);

		}

		return 'CREATE TABLE IF NOT EXISTS ' + this.name + ' (' + fields.join(', ') + ');';

	},

	getSelectQuery: function (fields, fields_values, order_by, limit) {

		var query = 'SELECT';

		if (fields && typeOf(fields) == 'array') {

			query += ' ' + fields.join(', ');

		} else {

			query += ' * '

		}

		query += ' FROM ' + this.name + ' ';

//		if (join && typeOf(join) == 'array') {
//
//			join.each(function (item) {
//
//				query += ' JOIN ON '
//
//			});
//
//		}

		if (fields_values) {

			query += this._makeWhere(fields_values);

		}

		if (order_by && typeOf(order_by) == 'object' && Object.getLength(order_by)) {

			query += ' ORDER BY';

			Object.each(order_by, function (order, field) {

				query += ' ' + field + ' ' + order;

			});

		}

		if (limit) {

			query += ' LIMIT ' + limit;

		}

		return query + ';';

	},

	getInsertQuery: function (fields_values) {

		if (typeOf(fields_values) != 'object') {

			throw new Error('fields_values must be object, ' + typeOf(fields_values) + ' given. Signature: {field_name:value}');

		}

		var query = '',
			fields = [],
			values = [];

		if (Object.getLength(fields_values) > 0) {

			Object.each(fields_values, function (value, field) {

				//Checking for real field
				if (this.fields[field]) {

					fields.push(field);

					if (typeOf(value) == 'string') {

						values.push("'" + value + "'");

					} else {

						values.push((value || "''"));

					}

				}

			}, this);

			query = 'INSERT INTO ' + this.name +
					' (' + fields.join(', ') + ')' +
					' VALUES (' + values.join(', ') + ');';

		}

		return query;

	},

	getDeleteQuery: function (fields) {

		var where = this._makeWhere(fields),
			query = '';

		//To prevent deleting all records
		if (where) {

			query = 'DELETE FROM ' + this.name + ' ' + where + ';';

		}

		return query;

	},

	getDropQuery: function () {

		return "DROP " + this.name;

	}


});