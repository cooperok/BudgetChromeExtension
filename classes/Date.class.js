var Date_class = new Class({

	days: ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'],

	monthes: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],

	date: null,

	setTime: function (time) {

		this.date = new Date(time);

	},

	getDay: function () {

		var day = null;

		if (this.date) {

			day = this.monthes[this.date.getDay()];

		}

		return day;

	},

	getMonth: function () {

		var month = null;

		if (this.date) {

			month = this.monthes[this.date.getMonth()];

		}

		return month;

	}

});