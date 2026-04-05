/** 홈 히어로 하단 썸네일 슬라이더 예시 · 메인 객실 티저 스와이프 */

const swiperInstances = [];

export function destroySwipers() {
  swiperInstances.forEach((instance) => {
    if (instance) instance.destroy(true, true);
  });
  swiperInstances.length = 0;
}

export function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  destroySwipers();

  const thumbEl = document.getElementById('home-thumb-swiper');
  if (thumbEl) {
    swiperInstances.push(
      new Swiper(thumbEl, {
        loop: true,
        spaceBetween: 16,
        slidesPerView: 1.2,
        centeredSlides: true,
        breakpoints: {
          640: { slidesPerView: 2.2 },
          1024: { slidesPerView: 3.2 },
        },
        keyboard: { enabled: true },
        a11y: { enabled: true },
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
      }),
    );
  }

  const roomsEl = document.getElementById('home-rooms-swiper');
  if (roomsEl) {
    const roomsPagination = roomsEl.querySelector('.swiper-pagination-rooms');
    const roomsNext = document.getElementById('home-rooms-next');
    const roomsPrev = document.getElementById('home-rooms-prev');

    const roomsOptions = {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 24,
      roundLengths: true,
      resizeObserver: true,
      grabCursor: true,
      watchOverflow: true,
      keyboard: { enabled: true },
      a11y: {
        enabled: true,
        nextSlideMessage: '다음 객실',
        prevSlideMessage: '이전 객실',
      },
      breakpoints: {
        640: { slidesPerView: 2, spaceBetween: 28 },
        1024: { slidesPerView: 3, spaceBetween: 32 },
      },
    };

    if (roomsPagination) {
      roomsOptions.pagination = { el: roomsPagination, clickable: true };
    }
    if (roomsNext && roomsPrev) {
      roomsOptions.navigation = { nextEl: roomsNext, prevEl: roomsPrev };
    }

    swiperInstances.push(new Swiper(roomsEl, roomsOptions));
  }
}
