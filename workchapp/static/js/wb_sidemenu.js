$(function(){
	/*
	 * sidebar 一级菜单active，显示左侧紫色border
	 */
	$('ul.sb-mu>li a').click(function(){
		$(this).parents('li').siblings(".active").removeClass('active');
		$(this).parents('li').addClass('active');
	});
	
	/*
	 * sidebar 菜单collpase效果
	 */
	$('ul.sb-mu a.ind').click(function(){
		$(this).parent().siblings().children('ul').slideUp();
		$(this).parent().siblings().children('a').removeClass('down');

		var submenuId = $(this).attr('href');
		if ($(submenuId).is(":visible")) {
			$(this).removeClass('down');
		} else {
			$(this).addClass('down');
		}
		$(submenuId).slideToggle();
		return false;
	});
});
