var ExpensesController_class = new Class({

	Extends: Controller_class,

	table_name: 'expenses',

	fields: {
		'title'         : 'title',
		'price'         : 'price',
		'date'          : 'date',
		'group_id'      : 'group_id',
		'description'   : 'description'
	}

});