$(document).ready(function(){

	slideShow();

	//header follows scroll
	$(window).scroll(function() {
	  var scroll = $(window).scrollTop();
	  var box = $('#top').height();
	  var header = $('header').height();

	  if (scroll >= box - header) {
	    $("header").addClass("background-header");
	  } else {
	    $("header").removeClass("background-header");
	  }
	});
	
	// Window Resize Mobile Menu Fix
	mobileNav();
	
	//dropdown nav toggle
	if($('.menu-trigger').length){
		$(".menu-trigger").on('click', function() {	
			$(this).toggleClass('active');
			$('.header-area .nav').slideToggle(200);
		});
	}

	// Window Resize Mobile Menu Fix
	$(window).on('resize', function() {
		mobileNav();
	});

	// Window Resize Mobile Menu Fix
	function mobileNav() {
		var width = $(window).width();
		$('.submenu').on('click', function() {
			if(width < 767) {
				$('.submenu ul').removeClass('active');
				$(this).find('ul').toggleClass('active');
			}
		});
	}

	//textArea counting
	$('.maxlength')
		.after("<span></span>")
		.next()
		.hide()
		.end()
		.keypress(function(e) {
		var current = $(this).val().length;
		if(current >= 130) {
			if(e.which != 0 && e.which != 8) {
			e.preventDefault();
			}
		}
		$(this).next().show().text(130 - current);
	});
	
	//checking
	$('.check-all:checkbox').change(function() {
        var isChecked = $(this).prop('checked'); 
        
        $('input[name="' + $(this).attr('name') + '"]').not(this).prop('checked', isChecked);
    });

	//men Carousel
	$(".men-item-carousel").owlCarousel({
    items: 3,
    margin: 30,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive:{
      0:{ items:1 },
      768:{ items:2 },
      992:{ items:3 }
    }
  });

  // Women Carousel
  $(".women-item-carousel").owlCarousel({
    items: 3,
    margin: 30,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive:{
      0:{ items:1 },
      768:{ items:2 },
      992:{ items:3 }
    }
  });

  // kid Carousel
  $(".kid-item-carousel").owlCarousel({
    items: 3,
    margin: 30,
    loop: true,
    nav: true,
    dots: true,
    autoplay: true,
    autoplayTimeout: 3000,
    responsive:{
      0:{ items:1 },
      768:{ items:2 },
      992:{ items:3 }
    }
  });

});

//slide
function slideShow() {
    var current = $('.thumb .show');
    var next = current.next('img').length ? current.next('img') : current.parent().children('img:first');

    current.removeClass('show');
    next.addClass('show');

    setTimeout(slideShow, 3000);
}