var App = {

	tpl_cache: {},

	/**
	 * Надстройка над шаблонизатором TrimPath возврашает HTML
	 * @param {String} tpl шаблон
	 * @param {Object} data данные
	 */
	getHTML: function (tpl, data) {

		/*{* распарсенный шаблон - это обьект с функцией process *}*/
		var t = this.tpl_cache[tpl];

		if (t == undefined) {

			t = TrimPath.parseTemplate(tpl);

			this.tpl_cache[tpl] = t;
		}

		return t.process(data);

	}

};