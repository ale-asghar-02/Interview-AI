import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';

import '../auth.scss';

import { EffectCoverflow, Pagination, Autoplay } from 'swiper/modules';

const Carosual = ()=> {
  return (
    <>
      <Swiper
        className="col-12 col-lg-10 col-xl-7 mt-5 mySwiper" style={{ paddingBottom : '50px' }}
        effect={'coverflow'}
        grabCursor={false}
        centeredSlides={true}
        slidesPerView={1}
        spaceBetween={100}
        loop={true}
        allowTouchMove={false}
        simulateTouch={false}
        autoplay={{
          delay: 2500,
          disableOnInteraction: false,
        }}
        coverflowEffect={{
          rotate: 50,
          stretch: 0,
          depth: 100,
          modifier: 1,
          slideShadows: true,
        }}
        pagination={{ clickable: false }}
        modules={[EffectCoverflow, Pagination, Autoplay]} >

        <SwiperSlide>
          <div className="col-12 text-center">
            <div className='col-12 mb-3'>
              <img className='col-12' src="../../../../src/assets/images/form-img-1.png" />
            </div>
            <h5 style={{ color : '#ffffff' , fontSize : '18px' }}>Secure Login & Signup</h5>
            <p className='fw-light mb-0' style={{ color : '#ebebeb' , fontSize : '13px' }}>Create your account or sign in to kick off your personalized AI-driven interview preparation journey.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="col-12 text-center">
            <div className='col-12 mb-3'>
              <img className='col-12' src="../../../../src/assets/images/form-img-2.png" />
            </div>
            <h5 style={{ color : '#ffffff' , fontSize : '18px' }}>AI-Generated Interview Report</h5>
            <p className='fw-light mb-0' style={{ color : '#ebebeb' , fontSize : '13px' }}>Enter your details and let AI instantly generate a complete, tailored interview readiness report just for you.</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="col-12 text-center">
            <div className='col-12 mb-3'>
              <img className='col-12' src="../../../../src/assets/images/form-img-3.png" />
            </div>
            <h5 style={{ color : '#ffffff' , fontSize : '18px' }}>Complete Report & Resume</h5>
            <p className='fw-light mb-0' style={{ color : '#ebebeb' , fontSize : '13px' }}>Get technical & behavioral questions, skill gap analysis, a career roadmap, and a downloadable resume — all in one place.</p>
          </div>
        </SwiperSlide>
      </Swiper>
    </>
  );
}

export default Carosual