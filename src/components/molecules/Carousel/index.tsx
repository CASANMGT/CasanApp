import { useDispatch } from "react-redux";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules"; // Import Swiper modules
import { Swiper, SwiperSlide } from "swiper/react";
import { setFromGlobal } from "../../../features";
import { AppDispatch } from "../../../store";
import "../../../styles/swiper.css";

export interface Slides {
  id: number;
  image: string;
  title: string;
  details: {
    validityPeriod: string;
    termsCondition: string[];
  };
}

interface CarouselProps {
  slides: Slides[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <Swiper
      modules={[Pagination, Autoplay]}
      pagination={{ clickable: true }}
      slidesPerView={1}
      spaceBetween={16}
      loop={true}
      autoplay={{
        delay: 3000, // 3 seconds
        disableOnInteraction: false, // continues autoplay even after interaction
      }}
    >
      {slides.map((slide) => (
        <SwiperSlide key={slide.id}>
          <div
            onClick={() => {
              dispatch(
                setFromGlobal({
                  type: "openCarousel",
                  value: true,
                  data: slide,
                })
              );
            }}
            className="w-full h-[36%] cursor-pointer "
          >
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
