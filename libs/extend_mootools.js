Element.implement({

	hide:function(){
		this.addClass('hidden');
		return this;
	},

	show:function(){
		this.removeClass('hidden');
		return this;
	},

	toggle:function(){
		this.isHidden() ? this.show() : this.hide();
		return this;
	},

	isHidden: function() {
		return this.hasClass('hidden');
	},

	setActive: function(active) {
		active == undefined || !!active ? this.addClass('active') : this.removeClass('active');
		return this;
	},

	isActive: function() {
		return this.hasClass('active');
	},

	setDisabled: function (disabled) {
		disabled == undefined || !!disabled ? this.addClass('disabled') : this.removeClass('disabled');
		return this;
	},

	isDisabled: function () {
		return this.hasClass('disabled');
	}

});