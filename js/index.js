(function(window,document,$){

	var $body = $('body'),
		$slide = $('.slide-btn'),
		$screen = $('.mobile-inner'),
		$top = $('.topbar');

	var screenSize = {
		'width': window.screen.width,
		'height': window.screen.height
	},
	changePanelIndex = function(index) {
		var sx = $('.panels')[0].scrollLeft,
		tx = index * screenSize.width,
		k = 10,
		scroll = function() {
			if (k > 0) {
				$('.panels')[0].scrollLeft = $('.panels')[0].scrollLeft + (tx - sx) / 10;
				k--;
				setTimeout(scroll, 30);
			} else {
				$('.panels')[0].scrollLeft = tx;
				panelIndex = index;
			}
		};
		if (index < 0) {
			index = 0;
		} else if (index >= $('.panel').length) {
			index = $('.panel').length - 1;
		} else {
			buttonSlider(1,300,0,index);
			scroll();		
		}		
	},
	dragingStart = 0,
	dragingSlider = 0,
	scrollX = 0,
	dragingX = 0,
	dragingY = 0,
	panelIndex = 0;

	// background transition
	setTimeout(function(){
		$('.background').addClass('zoom-in');
		$screen.addClass('zoom-in');
	},0);

	function random(n, m) {
		var start = 0, end = 0;
		if(n === undefined && m === undefined) {
			return 0;
		} else if(m === undefined) {
			start = 0;
			end = n;
		} else {
			start = n;
			end = m;
		}
		return Math.floor(start + Math.random()*(end-start));
	}

	function buttonSlider(time, value, relay, n) {
		if(!time) {
			time = 1;
		}
		if(!relay) {
			relay = 0;
		}
		if(!value) {
			value = 200;
		}

		$('.sort-item').css({
			'left' : (-value) + 'px',
			// 'background-image' : '../images/sort' + n + '.png',
			'-webkit-transition' : '0s ease',
			'-webkit-transform' : 'translateX(0)'
		}).removeClass('sort-'+(n+1)).removeClass('sort-'+(n-1)).addClass('sort-'+n).show();

		$('.together-item').removeClass('together-animate');

		$('.together-item').css({
			'left' : (value) + 'px',
			'-webkit-transition' : '0s ease',
			'-webkit-transform' : 'translateX(0)'
		}).show();	

		setTimeout(function() {
			$('.sort-item').css({
				'-webkit-transition' : time + 's ease',
				'-webkit-transform' : 'translateX(' + value + 'px)'
			});

			$('.together-item').css({
				'-webkit-transition' : time + 's ease',
				'-webkit-transform' : 'translateX(-' + value + 'px)'
			});	
		},relay);

		setTimeout(function() {
			$('.together-item').addClass('together-animate');
		},relay + 1000);
	}

	//圆圈浮出
	var comeCircle = function() {
		//最多6个 最少1个
		var k = random(4,8);
		var mask = $('.mask');
		var times = 10;
		for (var i = 0; i < k; i++) {
			//添加圆圈到页面
			var circle = $('<div class="come-circle"></div>').appendTo(mask);
			var width = random(30,90);
			var top = random(0,screenSize.height/times)*times;

			!function(width,circle,top) {
				console.log(top)
				if(i%2==0) {
					circle.css({
						'width':width+'px',
						'height':width+'px',
						'margin':0,
						'left':(-width)+'px',
						'top': top + 'px'
					});				
				} else {
					circle.css({
						'width':width+'px',
						'height':width+'px',
						'margin':0,
						'left':'100%',
						'top': top + 'px'
					});					
				}

				var n = $('.circle').offset().top + 90 - width/2;
				circle.animate({
					'margin-left': '-' + width/2 + 'px',
					'margin-bottom':'-'+(120+width/2)+'px',
					'left': '50%',
					'top' : n + 'px',
				},
				{
					'duration': random(600,1400),
					'complete': function() {
						circle.remove();
					}
				},
				random(100,300),'ease-in');				
			}(width,circle,top);
		}
	};	

	// flashlight && topbar show
	setTimeout(function(){
		var $flash = $('<div class="mask" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color:rgba(255,255,255,1);z-index:65535;"></div>')
		$body.prepend($flash);
		$flash.animate({
			opacity: 0
		},800,'ease-out',function(){
			$flash.remove();
			$top.addClass('enlarge');
			setTimeout(function(){
				$slide.removeClass('none');
			},1000)
		})
	},2000);

	var onDragEnd = function(){
		var $circleContainer = $('<div class="circle-container"><div class="circle center"></div></div>').appendTo($body),
			$circle = $circleContainer.find('.circle'),
			$mask = $('<div class="mask" style="position:absolute;top:0;bottom:0;left:0;right:0;background-color:black;opacity:0;z-index:10;"></div>');
		$circleContainer.css({
			position: 'absolute',
			width: $screen.width(),
			height: $screen.height(),
			left: $screen.offset().left,
			top: $screen.offset().top
		});
		$top.animate({
			opacity: 0
		},1000);
		$('.mobile').animate({
			opacity: 0
		},1000);
		$slide.hide();
		$mask.appendTo($body).animate({
			opacity: 0.8
		},1000);
		
		var flag = 1;

		$circle.bind('webkitAnimationEnd animationend',function(){
			if(!flag) {
				return;
			}
			flag = 0;
			$circle.addClass('end');

			var index = 0;
			var number = $('');
			var n = 5;
			while(index < n) {
				!function(index) {
					setTimeout(function(){
						if(number.size()) {
							number.html(index);
						} else {
							$circle.html('<div class="circle-inner"><p class="num">0</p><p class="msg">新消息</p></div>');
							number = $('.circle-inner .num');
						}

						if(index >=n-1){
							$circle.addClass('breathe');
							$circle.bind('click',function() {
								$circle.removeClass('center').removeClass('breathe');
								$('.circle-inner').addClass('circle-inner-full');
								$circle.css({
									'margin':'0 0 0 -47px',
									// 'padding':'0',
									'width':screenSize.width,
									'height':screenSize.height
								});
								setTimeout(function(){
									window.onresize();
									$('.mask').hide();
									$('.circle-container').addClass('display-none');
									setTimeout(function(){
										$('.background').hide();
										$('.circle-container').hide();
									},500);
									$('.panels-viewer').removeClass('none').addClass('display-visible');
									setTimeout(function(){
										changePanelIndex(0);	
									},500);									
								},150);
							});
						}
					},index*200+400);					
				}(index);
				index++;				
			}

			$circle.animate({'padding':'40px','margin-left':'-90px','margin-bottom':'-40px'},1500,200);
			comeCircle();

		});
	}

	var dragedX,dragedY,
		dragingX,dragingY,
		dragTarget;
	$body.bind({
		touchstart: function(event) {
			if (event.changedTouches[0].target === $slide[0]) {
				dragingY = event.touches[0].screenY;
				dragTarget = 'up';
				return;
			} else if ($.contains($('.panels')[0], event.target)) {
				dragTarget = 'panel';
				dragingX = event.touches[0].pageX;
				scrollX = $('.panels')[0].scrollLeft;
				return;
			} else {
				dragingX = event.touches[0].pageX;
				dragingY = event.touches[0].screenY;
			}
		},
		touchmove: function(event) {
			if( dragTarget === 'up'){
				var max = Math.min(80,dragingY - event.touches[0].screenY);
				$slide.css({
					'bottom': max
				});				
			} else if(dragTarget == 'panel') {
				$('.panels')[0].scrollLeft = (dragingX - event.touches[0].pageX) + scrollX;
			}
			event.preventDefault();
		},
		touchend: function(event) {
			var dragedX = event.changedTouches[0].screenX - dragingX,
			dragedY = event.changedTouches[0].screenY - dragingY;

			if(dragedX != 0 || dragedY!=0) {
				if ( dragTarget === 'up') {
					if(dragedY < -100) {
						onDragEnd();
						return false;
					} else {
						$slide.css({
							'bottom': 0
						});	
					}
				} else if(dragTarget == 'panel') {
					if (Math.abs(dragedX) <= 20) {
						changePanelIndex(panelIndex);
					} else if (dragedX < 0) {
						changePanelIndex(panelIndex + 1);
					} else {
						changePanelIndex(panelIndex - 1);
					}
					return false;
				}
				dragTarget = '';						
			} else {
				dragTarget = '';
			}
		}
	});

	window.onresize = function() {
		var panelsLength = $('.panel').length;
		screenSize = {
			'width': $('body').width(),
			'height': $('body').height()
		};
		$('.panel,.panels').css('width', screenSize.width);
		$('.panels-list').css({
			'width': panelsLength * screenSize.width
		});
	};
})(window,document,Zepto);