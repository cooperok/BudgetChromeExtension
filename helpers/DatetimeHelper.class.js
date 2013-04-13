var DatetimeHelper_class = new Class({

	Implements: Class.Singleton,

	/**
	 * @type Date
	 */
	date: null,

	/**
	 * Pattern for date string. Format DD-MM-YYYY
	 * @type RegExp
	 */
	date_string_pattern: /^\s*(\d{1,2})-(\d{1,2})-(\d{4})\s*$/,

	initialize: function () {

		this.date = new Date();

		this.date.setHours(0);

		this.date.setMinutes(0);

		this.date.setSeconds(0);

	},

	getTimestampByDateString: function (string) {

		var timestamp;

		if (this.date_string_pattern.test(string)) {

			var match = string.match(this.date_string_pattern);

			this.date.setDate(match[1]);

			this.date.setMonth(match[2]);

			this.date.setYear(match[3]);

			timestamp = this.date.getTime();

		} else {

			throw new Error('Wrong date string format. Required DD-MM-YYYY');

		}

		return timestamp;

	},

	toString: function () {

		return this.date.toString();

	}

});