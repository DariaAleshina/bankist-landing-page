'use strict';

///////////////////////////////////////
// Selections

const navTopArea = document.querySelector('.nav');
const header = document.querySelector('.header');
const allSections = document.querySelectorAll('.section');

const modal = document.querySelector('.modal');
const overlay = document.querySelector('.overlay');
const btnCloseModal = document.querySelector('.btn--close-modal');
const btnsOpenModal = document.querySelectorAll('.btn--show-modal');

const btnScrollTo = document.querySelector('.btn--scroll-to');
const section1 = document.querySelector('#section--1');

const tabsContainer = document.querySelector('.operations__tab-container');
const tabs = document.querySelectorAll('.operations__tab');
const tabsContent = document.querySelectorAll('.operations__content');

const slider = document.querySelector('.slider');
const slides = document.querySelectorAll('.slide');
const btnLeft = document.querySelector('.slider__btn--left');
const btnRight = document.querySelector('.slider__btn--right');
const dotContainer = document.querySelector('.dots');


///////////////////////////////////////
// Page Navigation

// // old - not very efficient way
// const navLinks = document.querySelectorAll('.nav__link');
// navLinks.forEach(link => {
//   link.addEventListener('click', function (event) {
//     event.preventDefault();
//     const sectionId = this.getAttribute('href');
//     console.log(sectionId);
//     document.querySelector(`${sectionId}`).scrollIntoView({ behavior: "smooth" });
//   })
// });

// more efficient way!!!
// add event listener to common parent element
document.querySelector('.nav__links').addEventListener('click', function (event) {
  // check if chiled link element generated an event & implement scroll
  if (event.target.classList.contains('nav__link')) {
    event.preventDefault();
    const sectionId = event.target.getAttribute('href');
    console.log(sectionId);
    document.querySelector(`${sectionId}`).scrollIntoView({ behavior: "smooth" });
  }
});

///////////////////////////////////////
// Button Scroll-To (Leant More btn -  Section 0)
btnScrollTo.addEventListener('click', function (event) {
  // const s1coord = section1.getBoundingClientRect();
  // window.scrollTo({
  //   left: window.scrollX + s1coord.left,
  //   top: window.scrollY + s1coord.top,
  //   behavior: 'smooth'
  // });

  section1.scrollIntoView({ behavior: 'smooth' });
});

// Menu fade out animations
const handleHoverOnNavTopArea = function (event) {
  if (event.target.classList.contains('nav__link')) {
    const linkTarget = event.target;
    const siblingLinks = linkTarget.closest('.nav').querySelectorAll('.nav__link');
    const logo = linkTarget.closest('.nav').querySelector('.nav__logo');
    siblingLinks.forEach(link => {
      if (link !== linkTarget) link.style.opacity = this;
      logo.style.opacity = this;
    });
  };
};

navTopArea.addEventListener('mouseover', handleHoverOnNavTopArea.bind(0.5));
navTopArea.addEventListener('mouseout', handleHoverOnNavTopArea.bind(1));

// STICKY NAVIGATION
// ver 1  - bad for performance! never use a scroll event!
// const stickNavFromCoord = section1.getBoundingClientRect().top;
// console.log(stickNavFromCoord);

// window.addEventListener('scroll', function () {
//   if (window.scrollY > stickNavFromCoord) navTopArea.classList.add('sticky');
//   else navTopArea.classList.remove('sticky');
// })

// ver 2 - better option
// const obsCallbackFunction = function (entries, observer) {
//   entries.forEach(entry => {
//     console.log(entry);
//   })
// };

// const obsOptions = {
//   root: null,
//   threshold: [0, 0.2]
// };

// const observer = new IntersectionObserver(obsCallbackFunction, obsOptions);
// observer.observe(section1);

const stickNavigation = function (entries) {
  const [entry] = entries;
  if (!entry.isIntersecting) navTopArea.classList.add('sticky');
  else navTopArea.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickNavigation, {
  root: null,
  threshold: 0,
  rootMargin: `-${navTopArea.getBoundingClientRect().height}px`
});
headerObserver.observe(header);

// sections reveal while scrolling
const revealSection = function (entries, observer) {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.remove('section--hidden');
    observer.unobserve(entry.target);
  });
}
const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.2
});

allSections.forEach(section => {
  section.classList.add('section--hidden');
  sectionObserver.observe(section);
});

// Lazy Image Loading
const imgTargets = document.querySelectorAll('img[data-src]');
const loadImg = function (entries, observer) {
  const [entry] = entries;
  if (!entry.isIntersecting) return;
  entry.target.src = entry.target.dataset.src;
  entry.target.addEventListener('load', function () {
    entry.target.classList.remove('lazy-img');
  })
  observer.unobserve(entry.target);
}
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  // this is to load a bit earlier that we scroll to the img itself
  rootMargin: '200px'
});

imgTargets.forEach(img => {
  imgObserver.observe(img);
});
///////////////////////////////////////
// Modal Window - Open/Close
const openModal = function (event) {
  event.preventDefault();
  modal.classList.remove('hidden');
  overlay.classList.remove('hidden');
};

const closeModal = function () {
  modal.classList.add('hidden');
  overlay.classList.add('hidden');
};

btnsOpenModal.forEach(btn => btn.addEventListener('click', openModal));


btnCloseModal.addEventListener('click', closeModal);
overlay.addEventListener('click', closeModal);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

///////////////////////////////////////
// Tabbed Component (Section 2)

tabsContainer.addEventListener('click', function (event) {
  const clickedTab = event.target.closest('.operations__tab');

  // guard clause
  if (!clickedTab) return;

  tabs.forEach(tab => tab.classList.remove('operations__tab--active'));
  clickedTab.classList.add('operations__tab--active');

  tabsContent.forEach(el => el.classList.remove('operations__content--active'));
  document.querySelector(`.operations__content--${clickedTab.dataset.tab}`).classList.add('operations__content--active');
});

// Slider Component (Section 3)

// Functions
const createDots = function () {
  slides.forEach(function (_, i) {
    dotContainer.insertAdjacentHTML(
      'beforeend',
      `<button class="dots__dot" data-slide="${i}"></button>`
    );
  })
}

const activateDot = function (slideNum) {
  const dots = document.querySelectorAll('.dots__dot');
  dots.forEach(dot => dot.classList.remove('dots__dot--active'));

  document.querySelector(`.dots__dot[data-slide="${slideNum}"]`).classList.add('dots__dot--active');
}

const goToSlide = function (slideNum) {
  slides.forEach(
    (slide, index) => slide.style.transform = `translateX(${100 * (index - slideNum)}%)`);
};

const goToNextSlide = function () {
  if (currentSlide === maxSlideNum - 1) {
    currentSlide = 0;
  } else {
    currentSlide++;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

const goToPrevSlide = function () {
  if (currentSlide === 0) {
    currentSlide = maxSlideNum - 1;
  } else {
    currentSlide--;
  }
  goToSlide(currentSlide);
  activateDot(currentSlide);
}

// Initial state setup
let currentSlide = 0;
const maxSlideNum = slides.length;
goToSlide(0);
createDots();
activateDot(0);

// Event handlers
btnRight.addEventListener('click', goToNextSlide);
btnLeft.addEventListener('click', goToPrevSlide);

document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowLeft') goToPrevSlide();
  event.key === 'ArrowRight' && goToNextSlide();
});

dotContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('dots__dot')) {
    currentSlide = Number(event.target.dataset.slide);
    goToSlide(currentSlide);
    activateDot(currentSlide);
  }
})