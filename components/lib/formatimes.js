import Vue from 'vue';
var formatimes= {
	changeDate(dateA) {
		var dateee = new Date(dateA).toJSON();
		var date = new Date(+new Date(dateee)+8*3600*1000).toISOString().replace(/T/g,' ').replace(/\.[\d]{3}Z/,'');
		return date;
	}
};
export default formatimes;
