var imgs = {
	logo :"./assets/images/logo.png",
	loginLogo :"./assets/images/login-logo.png",
	loginTitle :"./assets/images/raterlogo.png",
	userLoginTitle :"./assets/images/userlogo.png",
	adminLoginTitle: "./assets/images/manger.png",
	loginPerson :"./assets/images/login-person.png",
	loginLock :"./assets/images/login-lock.png",
	open :"./assets/images/open.png",
	tip :"./assets/images/tip.png",
	search :"./assets/images/search.png",
	back :"./assets/images/back.png",
	reset :"./assets/images/reset.png",
	guidang :"./assets/images/guidang.png",
	loginBg:"./assets/images/login-bg.jpg",
	adminLoginBg:'./assets/images/adminlogin.png',
	raterLoginBg:'./assets/images/raterlogin.png',

	man:'./assets/images/man.png',
	group:'./assets/images/group.png',
	scoreIco:'./assets/images/score-ico.png',
	logout:'./assets/images/logout.png',
	file:'./assets/images/file.png',
	uncheck:'./assets/images/uncheck.png',
	uncheck1:'./assets/images/uncheck1.png',
	pass:'./assets/images/pass.png',
	pass1:'./assets/images/pass1.png',
	brower:'./assets/images/brower.png',
	pass2:'./assets/images/pass2.png',
	reject:'./assets/images/reject.png',
	reject1:'./assets/images/reject1.png',
	user:'./assets/images/user.png',
	media:'./assets/images/media.png',
	shangbao:'./assets/images/shangbao.png',
	doc:'./assets/images/word.png',
	docx:'./assets/images/word.png',
	pdf:'./assets/images/pdf.png',
	zip: './assets/images/zip.png',
	rar: './assets/images/zip.png',
	enable:'./assets/images/enable.png',
	disable:'./assets/images/disabled.png',
	createcode:'./assets/images/createcode.png',


	//smile:'./assets/images/smile.png',
	titleBg:'./assets/images/title-bg.png',
	ruleIco:'./assets/images/rule-ico.png',
	imgIco:'./assets/images/img-ico.png',
	h5Ico:'./assets/images/h5.png',
	videoIco:'./assets/images/video-ico.png',
	audioIco:'./assets/images/audio-ico.png',
	dongmanIco:'./assets/images/dongman-ico.png',


};

/* Date.prototype.Format = function (fmt) { //author: meizz 
	var o = {
		"M+": this.getMonthgetMonth() + 1, //月份 
		"d+": this.getDate(), //日 
		"h+": this.getHours(), //小时 
		"m+": this.getMinutes(), //分 
		"s+": this.getSeconds(), //秒 
		"q+": Math.floor((this.getMonth() + 3) / 3), //季度 
		"S": this.getMilliseconds() //毫秒 
	};
	if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
	return fmt;
}
 */


(function () {
	var imgExtensions = 'gif,jpg,jpeg,bmp,png,tiff,tif'.split(','),
		videoExtensions = 'mp4,webm,ogg,aac,wma,vnd.dlna.adts,mp3'.split(','),
		textExtensions = ' xlsx, pdf, doc, ppt, xlsx, doc, docx, pdf, txt, ppt, pptx, xls, rar, css, scss,vb, zip'.split(',');
	var allExtensions = imgExtensions.concat(videoExtensions).concat(textExtensions);
	window.config = {
		baseUrl: 'http://10.137.0.3/v1',
		importModel: './assets/js/templet.zip',
		accepts: [{
			id: 0,
			name: '图片',
			type: 'Image',
			extensions: imgExtensions.join(',')
		}, {
			id: 1,
			name: '视频',
			type:'video',
			extensions: videoExtensions.join(',')
		}, {
			id: 2,
			name: '文本',
			type:'text',
			extensions: textExtensions.join(',')
		}, {
			id: 3,
			name: '全部',
			type:'all',
			extensions: allExtensions.join(',')
		}],
		qrcodeUrl:'http://h5.zmiti.com/public/wmmeeting/'
	}

	if (window.location.href.indexOf('localhost') > -1 || window.location.href.indexOf('zmiti.com') > -1) {
		window.config.baseUrl = "https://api.symbin.cn/v1";
	}

})();


