const progectSlider = new Swiper('.progect-slider', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
      type: "fraction",
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    }
  });

// скролл наверх
var t;
function up() {
	var top = Math.max(document.body.scrollTop,document.documentElement.scrollTop);
	if(top > 0) {
		window.scrollBy(0,-100);
		t = setTimeout('up()',20);
	} else clearTimeout(t);
	return false;
}

// плавный скролл секций
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

let panels = gsap.utils.toArray(".panel"),
    observer = ScrollTrigger.normalizeScroll(true),
    scrollTween;

// on touch devices, ignore touchstart events if there's an in-progress tween so that touch-scrolling doesn't interrupt and make it wonky
document.addEventListener("touchstart", e => {
  if (scrollTween) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}, {capture: true, passive: false})

function goToSection(i) {
  scrollTween = gsap.to(window, {
    scrollTo: {y: i * innerHeight, autoKill: false},
    onStart: () => {
      observer.disable(); // for touch devices, as soon as we start forcing scroll it should stop any current touch-scrolling, so we just disable() and enable() the normalizeScroll observer
      observer.enable();
    },
    duration: 1,
    onComplete: () => scrollTween = null,
    overwrite: true
  });
}

panels.forEach((panel, i) => {
  ScrollTrigger.create({
    trigger: panel,
    // markers: true,
    start: "top bottom",
    end: "+=100%",
    onToggle: self => self.isActive && !scrollTween && goToSection(i)
  });
});

// just in case the user forces the scroll to an inbetween spot (like a momentum scroll on a Mac that ends AFTER the scrollTo tween finishes):
ScrollTrigger.create({
  start: 0, 
  end: "max",
  snap: 1 / (panels.length - 1)
})