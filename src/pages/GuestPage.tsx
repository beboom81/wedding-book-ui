import { useEffect, useMemo, useRef, useState } from 'react';
import { Carousel, Collapse } from 'react-bootstrap';
import AOS from 'aos';
import confetti from 'canvas-confetti';

import { config, asset } from '../config';
import type { GuestConfig } from '../lib/types';
import { useCountdown } from '../hooks/useCountdown';
import CommentSection from '../components/comment/CommentSection';
import ImageModal from '../components/guest/ImageModal';
import FloatingButtons from '../components/guest/FloatingButtons';
import CopyButton from '../components/guest/CopyButton';

const LOVE_PATH =
  'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15';

const COUPLE = 'Duy Khanh & Ý Duyên';
const PLACE_DATE = 'Hồ Chí Minh, 13 October 2026';

const gallery1 = [1, 2, 3];
const gallery2 = [4, 5, 6];

const loveStory: [string, string][] = [
  ['✨ Lần gặp đầu tiên', 'Nơi bắt đầu câu chuyện của chúng mình.'],
  ['💞 Hẹn hò', 'Những ngày tháng cùng nhau tạo nên kỷ niệm.'],
  ['💥 Những lần cãi nhau', 'Cãi nhau rồi lại thương nhau nhiều hơn.'],
  ['💍 Cầu hôn', 'Và rồi chúng mình quyết định về chung một nhà.'],
];

function getQueryParam(name: string): string | null {
  const href = window.location.href;
  const match = href.match(new RegExp(`[?&]${name}=([^&#]*)`));
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

const SLIDES = ['/assets/images/bg.webp', '/assets/images/cowo.webp', '/assets/images/cewe.webp'];

export default function GuestPage() {
  const [opened, setOpened] = useState(false);
  const [welcomeFading, setWelcomeFading] = useState(false);
  const [welcomeGone, setWelcomeGone] = useState(false);
  const [slideIndex, setSlideIndex] = useState(-1); // -1 = not yet started
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [tfOpen, setTfOpen] = useState(false);
  const [qr1isOpen, setQr1isOpen] = useState(false);
  const [qr2isOpen, setQr2isOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [guestConfig, setGuestConfig] = useState<GuestConfig | null>(null);
  const [activeSection, setActiveSection] = useState('home');

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const time = useCountdown(config.weddingTime);
  const guestName = useMemo(() => getQueryParam('to'), []);
  const accessKey = useMemo(() => getQueryParam('k') ?? config.guestKey, []);
  const commentsEnabled = !!accessKey;

  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  useEffect(() => {
    if (!commentsEnabled) return;
    const key = accessKey;
    const headers: Record<string, string> = key.split('.').length === 3
      ? { Authorization: `Bearer ${key}` }
      : { 'x-access-key': key };
    fetch(`${config.apiUrl}api/v2/config`, { headers })
      .then(r => r.json())
      .then(json => { if (json?.data) setGuestConfig(json.data); })
      .catch(() => setGuestConfig(null));
  }, [accessKey, commentsEnabled]);

  useEffect(() => {
    if (!opened) return;
    setSlideIndex(0);
    const id = setInterval(() => setSlideIndex(i => (i + 1) % SLIDES.length), 6000);
    return () => clearInterval(id);
  }, [opened]);

  useEffect(() => {
    if (!opened) return;
    const ids = ['home', 'bride', 'wedding-date', 'gallery', 'comment'];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [opened]);

  const open = () => {
    setWelcomeFading(true);
    setOpened(true);
    document.body.scrollIntoView({ behavior: 'instant' });

    if (config.audio && audioRef.current) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => undefined);
    }

    // firework bursts — immediate
    const fireAt = (x: number, y: number) => {
      const n = 120 + Math.floor(Math.random() * 80);
      confetti({ particleCount: Math.floor(n * 0.25), angle: 60, spread: 55, origin: { x, y }, startVelocity: 60, ticks: 200, colors: ['#FFC0CB','#FF1493','#FFD700','#00BFFF','#7CFC00'] });
      confetti({ particleCount: Math.floor(n * 0.25), angle: 120, spread: 55, origin: { x, y }, startVelocity: 60, ticks: 200, colors: ['#FF6347','#FF69B4','#ADFF2F','#00CED1','#FFD700'] });
      confetti({ particleCount: Math.floor(n * 0.4), spread: 360, origin: { x, y }, startVelocity: 45, ticks: 200, gravity: 0.8, colors: ['#FFC0CB','#FF1493','#FFD700','#7CFC00','#00BFFF','#FF6347'] });
      confetti({ particleCount: Math.floor(n * 0.1), spread: 120, origin: { x, y }, startVelocity: 25, decay: 0.92, scalar: 1.4, ticks: 200 });
    };
    fireAt(0.2, 0.5);
    setTimeout(() => fireAt(0.8, 0.4), 200);
    setTimeout(() => fireAt(0.5, 0.3), 400);
    setTimeout(() => fireAt(0.1, 0.6), 700);
    setTimeout(() => fireAt(0.9, 0.5), 900);
    setTimeout(() => fireAt(0.5, 0.2), 1200);

    // heart shower for 12s after fireworks settle
    setTimeout(() => {
      const end = Date.now() + 12_000;
      const colors = ['#FFC0CB', '#FF1493', '#C71585'];
      const frame = () => {
        const left = end - Date.now();
        if (left <= 0) return;
        colors.forEach(color => {
          confetti({
            particleCount: 1, startVelocity: 0,
            ticks: Math.max(50, 75 * (left / 12_000)),
            origin: { x: Math.random(), y: Math.abs(Math.random() - left / 12_000) },
            colors: [color], shapes: ['heart' as unknown as confetti.Shape],
            gravity: 0.4 + Math.random() * 0.2,
            scalar: 0.8 + Math.random() * 0.8,
            drift: -0.4 + Math.random() * 0.8,
          });
        });
        requestAnimationFrame(frame);
      };
      requestAnimationFrame(frame);
    }, 2000);

    setTimeout(() => {
      setWelcomeGone(true);
      AOS.refreshHard();
    }, 850);
  };

  const toggleMusic = () => {
    const el = audioRef.current;
    if (!el) return;
    if (el.paused) {
      el.play().then(() => setMusicPlaying(true)).catch(() => undefined);
    } else {
      el.pause();
      setMusicPlaying(false);
    }
  };

  const Love = ({ top, left, right }: { top: string; left?: string; right?: string }) => (
    <div className="position-absolute" style={{ top, left, right }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="40"
        height="40"
        fill="currentColor"
        className="opacity-50 animate-love"
        viewBox="0 0 16 16"
      >
        <path d={LOVE_PATH} />
      </svg>
    </div>
  );

  const Wave = ({ d }: { d: string }) => (
    <div className="svg-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="color-theme-svg no-gap-bottom">
        <path fill="currentColor" fillOpacity="1" d={d} />
      </svg>
    </div>
  );

  return (
    <>
      {config.audio && <audio ref={audioRef} src={asset(config.audio)} loop preload="auto" />}

      {/* Root Invitation */}
      <div className={`row m-0 p-0 ${opened ? '' : 'opacity-0'}`} id="root">
        {/* Desktop mode */}
        <div className="sticky-top vh-100 d-none d-sm-block col-sm-5 col-md-6 col-lg-7 col-xl-8 col-xxl-9 overflow-y-hidden m-0 p-0">
          <div className="position-relative bg-white-black d-flex justify-content-center align-items-center vh-100">
            <div className="d-flex position-absolute w-100 h-100">
              <div className="position-relative overflow-hidden w-100">
                {SLIDES.map((src, i) => (
                  <div
                    key={i}
                    className={`position-absolute h-100 w-100 slide-desktop${slideIndex === i ? ' slide-desktop-active' : ''}`}
                    style={{ opacity: slideIndex >= 0 && slideIndex === i ? 1 : 0 }}
                  >
                    <img src={asset(src)} alt="bg" className="bg-cover-home" style={{ maskImage: 'none', opacity: 0.3 }} />
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center p-4 bg-overlay-auto rounded-5">
              <h2 className="font-esthetic mb-4" style={{ fontSize: '2rem' }}>
                {COUPLE}
              </h2>
              <p className="m-0" style={{ fontSize: '1rem' }}>
                {PLACE_DATE}
              </p>
            </div>
          </div>
        </div>

        {/* Smartphone mode */}
        <div className="col-sm-7 col-md-6 col-lg-5 col-xl-4 col-xxl-3 m-0 p-0">
          <main tabIndex={0}>
            {/* Home */}
            <section id="home" className="bg-light-dark position-relative overflow-hidden p-0 m-0">
              <img
                src={asset('/assets/images/bg.webp')}
                alt="bg"
                className="position-absolute opacity-25 top-50 start-50 translate-middle bg-cover-home"
              />
              <div className="position-relative text-center bg-overlay-auto" style={{ backgroundColor: 'unset' }}>
                <h1 className="font-esthetic pt-5 pb-4 fw-medium" style={{ fontSize: '2.25rem' }}>
                  Wedding invitation
                </h1>
                <img
                  src={asset('/assets/images/bg.webp')}
                  alt="couple"
                  onClick={(e) => setModalSrc(e.currentTarget.src)}
                  className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                />
                <h2 className="font-esthetic my-4" style={{ fontSize: '2.25rem' }}>
                  {COUPLE}
                </h2>
                <p className="my-2" style={{ fontSize: '1.25rem' }}>
                  {PLACE_DATE}
                </p>
                <div className="d-flex justify-content-center align-items-center mt-4 mb-2">
                  <div className="mouse-animation border border-secondary border-2 rounded-5 px-2 py-1 opacity-50">
                    <div className="scroll-animation rounded-4 bg-secondary"></div>
                  </div>
                </div>
                <p className="pb-4 m-0 text-secondary" style={{ fontSize: '0.825rem' }}>
                  Scroll Down
                </p>
              </div>
            </section>

            <Wave d="M0,160L48,144C96,128,192,96,288,106.7C384,117,480,171,576,165.3C672,160,768,96,864,96C960,96,1056,160,1152,154.7C1248,149,1344,75,1392,37.3L1440,0L1440,320L0,320Z" />

            {/* Bride */}
            <section className="bg-white-black text-center" id="bride">
              <h2 className="font-greatvibes py-4 m-0" style={{ fontSize: '2rem' }}>
                Lễ Thành Hôn
              </h2>
              <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2rem' }}>
                Match made in heaven
              </h2>
              <p className="pb-4 px-2 m-0" style={{ fontSize: '0.95rem' }}>
                Sau hành trình dài cùng nhau viết nên câu chuyện tình yêu,
                chúng tôi quyết định bước sang chương mới - chương
                mang tên Hôn Nhân.
              </p>

              <div className="overflow-x-hidden pb-4">
                <div className="position-relative">
                  <Love top="0%" right="5%" />
                  <div data-aos="fade-right" data-aos-duration="2000" className="pb-1">
                    <img
                      src={asset('/assets/images/cowo.webp')}
                      alt="cowo"
                      onClick={(e) => setModalSrc(e.currentTarget.src)}
                      className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                    />
                    <h2 className="font-greatvibes m-0" style={{ fontSize: '2.125rem' }}>
                      Đinh Duy Khanh
                    </h2>
                    <p className="mt-3 mb-1" style={{ fontSize: '1.25rem' }}>
                      Quý nam
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Cha Đinh Văn Lê
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      &
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Mẹ Nguyễn Kiều Diễm Phương
                    </p>
                  </div>
                  <Love top="90%" left="5%" />
                </div>

                <h2 className="font-esthetic mt-4" style={{ fontSize: '4.5rem' }}>
                  &amp;
                </h2>

                <div className="position-relative">
                  <Love top="0%" right="5%" />
                  <div data-aos="fade-left" data-aos-duration="2000" className="pb-1">
                    <img
                      src={asset('/assets/images/cewe.webp')}
                      alt="cewe"
                      onClick={(e) => setModalSrc(e.currentTarget.src)}
                      className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                    />
                    <h2 className="font-greatvibes m-0" style={{ fontSize: '2.125rem' }}>
                      Phạm Nguyễn Ý Duyên
                    </h2>
                    <p className="mt-3 mb-1" style={{ fontSize: '1.25rem' }}>
                      Trưởng nữ
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Cha Phạm Văn A
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      &
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Mẹ Nguyễn Thị Nguyệt
                    </p>
                  </div>
                  <Love top="90%" left="5%" />
                </div>
              </div>
            </section>

            <Wave d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L0,0Z" />

            {/* Love Idiom */}
            <section className="bg-light-dark pt-2 pb-4">
              <div className="container text-center">
                <h2 className="font-esthetic pt-2 pb-1 m-0" style={{ fontSize: '2rem' }}>
                  Love Idiom
                </h2>
                <div className="bg-theme-auto mt-4 p-3 shadow rounded-4" data-aos="fade-down" data-aos-duration="2000">
                  <p className="p-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    Hai trái tim chung một nhịp, hai cuộc đời chung một lối
                  </p>
                </div>
                <div className="bg-theme-auto mt-4 p-3 shadow rounded-4" data-aos="fade-down" data-aos-duration="2000">
                  <p className="p-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    Duyên do trời định, phận do người tạo – hạnh phúc
                    do đôi ta nắm giữ
                  </p>
                </div>
              </div>
            </section>

            {/* Love Story */}
            <section className="bg-light-dark pt-2 pb-4">
              <div className="container">
                <div className="bg-theme-auto rounded-5 shadow p-3">
                  <h2 className="font-esthetic text-center py-2 mb-2" style={{ fontSize: '2.125rem' }}>
                    Love Story
                  </h2>
                  <div className="position-relative">
                    {!showStory && (
                      <div
                        className="position-absolute d-flex justify-content-center align-items-center top-50 start-50 translate-middle w-100 h-100 bg-overlay-auto z-3"
                        style={{ backgroundColor: 'unset' }}
                      >
                        <button
                          className="btn btn-outline-auto btn-sm rounded-4 shadow-sm"
                          onClick={() => setShowStory(true)}
                        >
                          <i className="fa-solid fa-heart fa-bounce me-2"></i>Lắng nghe câu chuyện
                        </button>
                      </div>
                    )}
                    <div
                      className="overflow-y-scroll overflow-x-hidden p-2 with-scrollbar"
                      style={{ height: '15rem', filter: showStory ? 'none' : 'blur(5px)' }}
                    >
                      {loveStory.map(([t, body], i) => (
                        <div className="row" key={i}>
                          <div className="col-auto position-relative">
                            <p
                              className="position-relative d-flex justify-content-center align-items-center bg-theme-auto border border-secondary border-2 opacity-100 rounded-circle m-0 p-0 z-1"
                              style={{ width: '2rem', height: '2rem' }}
                            >
                              {i + 1}
                            </p>
                            <hr className="position-absolute top-0 start-50 translate-middle-x border border-secondary h-100 z-0 opacity-100 m-0 rounded-4 shadow-none" />
                          </div>
                          <div className="col mt-1 mb-3 ps-0">
                            <p className="fw-bold mb-2">{t}</p>
                            <p className="small mb-0">{body}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <Wave d="M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,320L0,320Z" />

            {/* Wedding Date */}
            <section className="bg-white-black pb-2" id="wedding-date">
              <div className="container text-center">
                <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2.25rem' }}>
                  Happy moments
                </h2>
                <div className="border rounded-pill shadow py-2 px-4 mt-2 mb-4">
                  <div className="row justify-content-center">
                    {[
                      ['Ngày', time.day],
                      ['Giờ', time.hour],
                      ['Phút', time.minute],
                      ['Giây', time.second],
                    ].map(([label, val]) => (
                      <div className="col-3 p-1" key={label}>
                        <p className="d-inline m-0 p-0" style={{ fontSize: '1.25rem' }}>
                          {val}
                        </p>
                        <small className="ms-1 me-0 my-0 p-0 d-inline">{label}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="py-2 m-0" style={{ fontSize: '0.95rem' }}>
                  Trân trọng kính mời quý vị đến dự lễ thành
                  hôn của chúng tôi tại:
                </p>
                <div className="overflow-x-hidden">
                  <div className="py-2" data-aos="fade-right" data-aos-duration="1500">
                    <h2 className="font-esthetic m-0 py-2" style={{ fontSize: '3rem' }}>
                      Capella: Park View
                    </h2>
                  </div>
                  <div className="py-2" data-aos="fade-left" data-aos-duration="1500">
                    <h2 className="font-dancingscript m-0 py-2" style={{ fontSize: '2rem' }}>
                      Vào lúc 11:00 Thứ 7, 01.08.2026
                    </h2>
                  </div>
                </div>
                <p className="py-2 m-0" style={{ fontSize: '0.95rem' }}>
                  Mong quý khách ưu tiên trang phục cùng tông màu để
                  hòa hợp không gian buổi tiệc:
                </p>
                <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
                  <div className="d-flex justify-content-center align-items-center mb-3">
                    {['white', 'rgb(38, 132, 255)', 'rgb(0, 0, 0)', 'rgb(82, 79, 79)', 'rgb(255, 0, 0)'].map(
                      (color, i) => (
                        <div
                          key={color}
                          className="shadow rounded-circle border border-secondary"
                          style={{
                            width: '3rem',
                            height: '3rem',
                            backgroundColor: color,
                            marginLeft: i === 0 ? undefined : '-1rem',
                          }}
                        ></div>
                      ),
                    )}
                  </div>
                </div>
                <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
                  <a
                    href="https://maps.app.goo.gl/8Lwir8zTfzUZcUe4A"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
                  >
                    <i className="fa-solid fa-map-location-dot me-2"></i>See Google Maps
                  </a>
                  <small className="d-block my-1">
                    3 đường Đặng Văn Sâm, phường Đức Nhuận, TP. Hồ Chí Minh, Việt Namv
                  </small>
                </div>
              </div>
            </section>

            {/* Gallery */}
            <section className="bg-white-black pb-5 pt-3" id="gallery">
              <div className="container">
                <div className="border rounded-5 shadow p-3">
                  <h2 className="font-esthetic text-center py-2 m-0" style={{ fontSize: '2.25rem' }}>
                    Gallery
                  </h2>
                  {[gallery1, gallery2].map((set, idx) => (
                    <Carousel key={idx} className="mt-4" data-aos="fade-up" data-aos-duration="1500">
                      {set.map((n) => (
                        <Carousel.Item key={n}>
                          <img
                            src={`https://picsum.photos/1280/720?random=${n}`}
                            alt={`image ${n}`}
                            className="d-block img-fluid cursor-pointer rounded-4"
                            onClick={(e) => setModalSrc((e.currentTarget as HTMLImageElement).src)}
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ))}
                </div>
              </div>
            </section>

            <Wave d="M0,96L30,106.7C60,117,120,139,180,154.7C240,171,300,181,360,186.7C420,192,480,192,540,181.3C600,171,660,149,720,154.7C780,160,840,192,900,208C960,224,1020,224,1080,208C1140,192,1200,160,1260,138.7C1320,117,1380,107,1410,101.3L1440,96L1440,0L0,0Z" />

            {/* Love Gift */}
            <section className="bg-light-dark pb-3">
              <div className="container text-center">
                <h2 className="font-esthetic pt-3 mb-4" style={{ fontSize: '2.25rem' }}>
                  Love Gift
                </h2>
                <p className="mb-1" style={{ fontSize: '0.95rem' }}>
                  Với tất cả sự trân trọng, nếu quý khách muốn
                  gửi tặng chúng tôi chút tấm lòng, xin vui lòng thông qua:
                </p>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-money-bill-transfer"></i>
                  <p className="d-inline"> Transfer/Chuyển khoản</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Đinh Duy Khanh
                    </p>
                    <button
                      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setTfOpen((o) => !o)}
                    >
                      <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
                    </button>
                  </div>
                  <Collapse in={tfOpen}>
                    <div>
                      <hr className="my-2 py-1" />
                      <p className="m-0" style={{ fontSize: '0.9rem' }}>
                        <i className="fa-solid fa-building-columns me-1"></i>TP Bank
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="m-0 p-0" style={{ fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-credit-card me-1"></i>0775493481
                        </p>
                        <CopyButton value="0775493481" />
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-qrcode fa-lg"></i>
                  <p className="d-inline"> QR</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Đinh Duy Khanh
                    </p>
                    <button
                      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setQr1isOpen((o) => !o)}
                    >
                      <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
                    </button>
                  </div>
                  <Collapse in={qr1isOpen}>
                    <div>
                      <hr className="my-2 py-1" />
                      <div className="d-flex justify-content-center align-items-center">
                        <img
                          src={asset('/assets/images/donate.png')}
                          alt="donate"
                          className="img-fluid rounded-3 mx-auto bg-white"
                        />
                      </div>
                    </div>
                  </Collapse>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Phạm Nguyễn Ý Duyên
                    </p>
                    <button
                      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setQr2isOpen((o) => !o)}
                    >
                      <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
                    </button>
                  </div>
                  <Collapse in={qr2isOpen}>
                    <div>
                      <hr className="my-2 py-1" />
                      <div className="d-flex justify-content-center align-items-center">
                        <img
                          src={asset('/assets/images/donate_2.jpg')}
                          alt="donate"
                          className="img-fluid rounded-3 mx-auto bg-white"
                        />
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-gift fa-lg"></i>
                  <p className="d-inline"> Gift</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Đinh Duy Khanh
                    </p>
                    <button
                      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setGiftOpen((o) => !o)}
                    >
                      <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
                    </button>
                  </div>
                  <Collapse in={giftOpen}>
                    <div>
                      <hr className="my-2 py-1" />
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <p className="m-0 p-0" style={{ fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-phone-volume me-1"></i>0775493481
                        </p>
                        <CopyButton value="0775493481" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="my-0 p-0 text-truncate me-2" style={{ fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-location-dot me-1"></i>324/D12 Hòa Hưng, P.Hòa
                          Hưng, Hồ Chí Minh, Việt Nam.
                        </p>
                        <CopyButton value="324/D12 Hòa Hưng, P.Hòa Hưng, Hồ Chí Minh, Việt Nam." />
                      </div>
                    </div>
                  </Collapse>
                </div>
              </div>
            </section>

            {/* Comment */}
            <section className="bg-light-dark my-0 pb-0 pt-3" id="comment">
              <div className="container">
                <div className="border rounded-5 shadow p-3 mb-2">
                  <h2 className="font-esthetic text-center mt-2 mb-4" style={{ fontSize: '2.25rem' }}>
                    Hello &amp; Wish
                  </h2>
                  {commentsEnabled ? (
                    <CommentSection token={accessKey} isAdmin={false} config={guestConfig} variant="guest" />
                  ) : (
                    <p className="text-center m-0">Comment feature is disabled.</p>
                  )}
                </div>
              </div>
            </section>

            <Wave d="M0,224L34.3,234.7C68.6,245,137,267,206,266.7C274.3,267,343,245,411,234.7C480,224,549,224,617,213.3C685.7,203,754,181,823,197.3C891.4,213,960,267,1029,266.7C1097.1,267,1166,213,1234,192C1302.9,171,1371,181,1406,186.7L1440,192L1440,320L0,320Z" />

            {/* End */}
            <section className="bg-white-black py-2 no-gap-bottom">
              <div className="container text-center">
                <p className="pb-2 pt-4" style={{ fontSize: '1rem' }}>
                  Xin cảm ơn sự quan tâm và lời chúc phúc của quý
                  khách.
                </p>
                <h2 className="font-greatvibes" style={{ fontSize: '2rem' }}>
                  Sự hiện diện của quý khách là niềm vinh dự và
                  hạnh phúc của gia đình chúng tôi.
                </h2>
                <h2 className="font-dancingscript pt-4" style={{ fontSize: '2rem' }}>
                  Trân trọng cảm ơn
                </h2>
                <hr className="my-3" />
                <small>
                  Build with<i className="fa-solid fa-heart mx-1"></i>Duy Khanh
                </small>
              </div>
            </section>
          </main>

          {/* Navbar Bottom */}
          <nav className="navbar navbar-expand sticky-bottom rounded-top-4 border-top p-0" id="navbar-menu">
            <ul className="navbar-nav nav-justified w-100 align-items-center">
              {([
                ['home', 'fa-house', 'Home'],
                ['bride', 'fa-user-group', 'Marriage'],
                ['wedding-date', 'fa-calendar-check', 'Date'],
                ['gallery', 'fa-images', 'Gallery'],
                ['comment', 'fa-comments', 'Wish'],
              ] as [string, string, string][]).map(([id, icon, label]) => (
                <li className="nav-item" key={id}>
                  <button
                    className={`nav-link btn btn-link text-decoration-none${activeSection === id ? ' nav-link-active' : ''}`}
                    onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                  >
                    <i className={`fa-solid ${icon}`}></i>
                    <span className="d-block" style={{ fontSize: '0.7rem' }}>
                      {label}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Welcome overlay */}
      {!welcomeGone && (
        <div
          className="loading-page bg-white-black"
          id="welcome"
          style={{
            opacity: welcomeFading ? 0 : 1,
            transition: 'opacity 0.85s ease',
            pointerEvents: welcomeFading ? 'none' : undefined,
          }}
        >
          <div className="d-flex justify-content-center align-items-center vh-100 overflow-y-auto">
            <div className="d-flex flex-column text-center">
              <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                The Wedding Of
              </h2>
              <img
                src={asset('/assets/images/bg.webp')}
                alt="background"
                className="img-center-crop rounded-circle border border-3 border-light shadow mb-4 mx-auto"
              />
              <h2 className="font-esthetic mb-4" style={{ fontSize: '2.25rem' }}>
                {COUPLE}
              </h2>
              {guestName && (
                <div className="m-2">
                  <small className="mt-0 mb-1 mx-0 p-0">Kepada Yth Bapak/Ibu/Saudara/i</small>
                  <p className="m-0 p-0" style={{ fontSize: '1.25rem' }}>
                    {guestName}
                  </p>
                </div>
              )}
              <button
                type="button"
                className="btn btn-light shadow rounded-4 mt-3 mx-auto"
                onClick={open}
                disabled={welcomeFading}
              >
                <i className="fa-solid fa-envelope-open fa-bounce me-2"></i>Open Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      {opened && (
        <FloatingButtons
          showMusic={!!config.audio}
          musicPlaying={musicPlaying}
          onToggleMusic={toggleMusic}
        />
      )}

      <ImageModal src={modalSrc} onHide={() => setModalSrc(null)} />
    </>
  );
}
