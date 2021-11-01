import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Slick from 'react-slick';
import { Overlay, Global, Indicator, SlickWrapper, CloseBtn, Header, ImageWrapper } from './styles';
// import { backUrl } from '../../config/config';

const ImagesZoom = ({ images, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  return (
    <Overlay>
      <Global />
      <Header>
        <h1>More pictures</h1>
        <CloseBtn onClick={onClose}>X</CloseBtn>
      </Header>
      <SlickWrapper>
        <div>
          <Slick
            initialSlide={0}
            afterChange={(slide) => setCurrentSlide(slide)}
            infinite
            arrows={false}
            slidesToScroll={1}
            slidesToShow={1}
          >
            {
                            images.map((obj) => (
                              <ImageWrapper key={obj.src}>
                                {/* // 원본보기 */}
                                <img src={`${obj.src.replace(/\/thumb\//, '/original/')}`} alt={obj.src} />
                              </ImageWrapper>
                            ))
                        }
          </Slick>
          <Indicator>
            <div>
              {currentSlide + 1}
              {' / '}
              {images.length}
            </div>
          </Indicator>
        </div>
      </SlickWrapper>
    </Overlay>
  );
};

ImagesZoom.propTypes = {
  images: PropTypes.arrayOf(PropTypes.object).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImagesZoom;
