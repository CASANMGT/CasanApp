import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules"; // Import Swiper modules
import { Swiper, SwiperSlide } from "swiper/react";
import "../../../styles/swiper.css";

interface CarouselProps {
  slides: { id: number; image: string; title: string }[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  return (
    <Swiper
      modules={[Pagination]}
      pagination={{ clickable: true }}
      slidesPerView={1}
      spaceBetween={16}
      loop={true}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div className="w-full h-[140px]  ">
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full rounded-lg"
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Carousel;
