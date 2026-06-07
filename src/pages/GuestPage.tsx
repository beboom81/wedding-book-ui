import { useEffect, useMemo, useRef, useState } from 'react';
import { Carousel, Collapse } from 'react-bootstrap';
import AOS from 'aos';
import confetti from 'canvas-confetti';

import { config, asset } from '../config';
import { request, HTTP_GET } from '../lib/api';
import type { GuestConfig } from '../lib/types';
import { useCountdown } from '../hooks/useCountdown';
import CommentSection from '../components/comment/CommentSection';
import ImageModal from '../components/guest/ImageModal';
import FloatingButtons from '../components/guest/FloatingButtons';
import CopyButton from '../components/guest/CopyButton';

const LOVE_PATH =
  'm8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143q.09.083.176.171a3 3 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15';

const gallery1 = [1, 2, 3];
const gallery2 = [4, 5, 6];

function getQueryParam(name: string): string | null {
  const href = window.location.href;
  const match = href.match(new RegExp(`[?&]${name}=([^&#]*)`));
  return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
}

export default function GuestPage() {
  const [opened, setOpened] = useState(false);
  const [modalSrc, setModalSrc] = useState<string | null>(null);
  const [showStory, setShowStory] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [tfOpen, setTfOpen] = useState(false);
  const [qrisOpen, setQrisOpen] = useState(false);
  const [giftOpen, setGiftOpen] = useState(false);
  const [guestConfig, setGuestConfig] = useState<GuestConfig | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const time = useCountdown(config.weddingTime);
  const guestName = useMemo(() => getQueryParam('to'), []);
  const accessKey = useMemo(() => getQueryParam('k') ?? config.guestKey, []);
  const commentsEnabled = !!accessKey;

  useEffect(() => {
    AOS.init({ once: true, duration: 1000 });
  }, []);

  // Fetch the public invitation config (timezone, gif key, permissions).
  useEffect(() => {
    if (!commentsEnabled) {
      return;
    }
    request(HTTP_GET, '/api/v2/config')
      .token(accessKey)
      .send<GuestConfig>()
      .then((res) => setGuestConfig(res.data))
      .catch(() => setGuestConfig(null));
  }, [accessKey, commentsEnabled]);

  const open = () => {
    setOpened(true);
    document.body.scrollIntoView({ behavior: 'instant' });
    setTimeout(() => AOS.refreshHard(), 100);

    confetti({ particleCount: 120, spread: 70, origin: { y: 0.6 } });

    if (config.audio && audioRef.current) {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => undefined);
    }
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
            <div className="text-center p-4 bg-overlay-auto rounded-5">
              <h2 className="font-esthetic mb-4" style={{ fontSize: '2rem' }}>
                Wahyu &amp; Riski
              </h2>
              <p className="m-0" style={{ fontSize: '1rem' }}>
                Rabu, 15 Maret 2023
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
                  Undangan Pernikahan
                </h1>
                <img
                  src={asset('/assets/images/bg.webp')}
                  alt="couple"
                  onClick={(e) => setModalSrc(e.currentTarget.src)}
                  className="img-center-crop rounded-circle border border-3 border-light shadow my-4 mx-auto cursor-pointer"
                />
                <h2 className="font-esthetic my-4" style={{ fontSize: '2.25rem' }}>
                  Wahyu &amp; Riski
                </h2>
                <p className="my-2" style={{ fontSize: '1.25rem' }}>
                  Rabu, 15 Maret 2023
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
              <h2 className="font-arabic py-4 m-0" style={{ fontSize: '2rem' }}>
                بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
              </h2>
              <h2 className="font-esthetic py-4 m-0" style={{ fontSize: '2rem' }}>
                Assalamualaikum Warahmatullahi Wabarakatuh
              </h2>
              <p className="pb-4 px-2 m-0" style={{ fontSize: '0.95rem' }}>
                Tanpa mengurangi rasa hormat, kami mengundang Anda untuk berkenan menghadiri acara pernikahan
                kami:
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
                    <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                      Nama Wahyu Siapa
                    </h2>
                    <p className="mt-3 mb-1" style={{ fontSize: '1.25rem' }}>
                      Putra ke-1
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Bapak lorem ipsum
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      dan
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Ibu lorem ipsum
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
                    <h2 className="font-esthetic m-0" style={{ fontSize: '2.125rem' }}>
                      Nama Riski Siapa
                    </h2>
                    <p className="mt-3 mb-1" style={{ fontSize: '1.25rem' }}>
                      Putri ke-2
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Bapak lorem ipsum
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      dan
                    </p>
                    <p className="mb-0" style={{ fontSize: '0.95rem' }}>
                      Ibu lorem ipsum
                    </p>
                  </div>
                  <Love top="90%" left="5%" />
                </div>
              </div>
            </section>

            <Wave d="M0,192L40,181.3C80,171,160,149,240,149.3C320,149,400,171,480,165.3C560,160,640,128,720,128C800,128,880,160,960,186.7C1040,213,1120,235,1200,218.7C1280,203,1360,149,1400,122.7L1440,96L1440,0L0,0Z" />

            {/* Quotes */}
            <section className="bg-light-dark pt-2 pb-4">
              <div className="container text-center">
                <h2 className="font-esthetic pt-2 pb-1 m-0" style={{ fontSize: '2rem' }}>
                  Allah Subhanahu Wa Ta'ala berfirman
                </h2>
                <div className="bg-theme-auto mt-4 p-3 shadow rounded-4" data-aos="fade-down" data-aos-duration="2000">
                  <p className="p-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    Dan segala sesuatu Kami ciptakan berpasang-pasangan agar kamu mengingat (kebesaran Allah).
                  </p>
                  <p className="m-0 p-0 text-theme-auto" style={{ fontSize: '0.95rem' }}>
                    QS. Adh-Dhariyat: 49
                  </p>
                </div>
                <div className="bg-theme-auto mt-4 p-3 shadow rounded-4" data-aos="fade-down" data-aos-duration="2000">
                  <p className="p-1 mb-2" style={{ fontSize: '0.95rem' }}>
                    dan sesungguhnya Dialah yang menciptakan pasangan laki-laki dan perempuan,
                  </p>
                  <p className="m-0 p-0 text-theme-auto" style={{ fontSize: '0.95rem' }}>
                    QS. An-Najm: 45
                  </p>
                </div>
              </div>
            </section>

            {/* Love Story */}
            <section className="bg-light-dark pt-2 pb-4">
              <div className="container">
                <div className="bg-theme-auto rounded-5 shadow p-3">
                  <h2 className="font-esthetic text-center py-2 mb-2" style={{ fontSize: '2.125rem' }}>
                    Kisah Cinta
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
                          <i className="fa-solid fa-heart fa-bounce me-2"></i>Lihat Story
                        </button>
                      </div>
                    )}
                    <div
                      className="overflow-y-scroll overflow-x-hidden p-2 with-scrollbar"
                      style={{ height: '15rem', filter: showStory ? 'none' : 'blur(5px)' }}
                    >
                      {[
                        ['💼 Awal Pertemuan Sederhana', 'Pada Januari 2025, Wahyu, seorang desainer grafis berusia 28 tahun, bertemu Riski, copywriter yang dikenal cerdas dan pendiam, dalam proyek branding perusahaan.'],
                        ['💞 Benih Cinta dalam Ujian', 'Memasuki Februari 2025, proyek mereka menghadapi krisis. Di tengah tekanan, Riski tampil dengan solusi kreatif yang menyelamatkan proyek, membuat Wahyu terkesan.'],
                        ['💍 Langkah Menuju Ridha Allah', 'Pada Maret 2025, setelah istikharah dan mendapat restu keluarga, Wahyu melamar Riski dalam acara sederhana namun penuh makna.'],
                      ].map(([t, body], i) => (
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
                  Moment Bahagia
                </h2>
                <div className="border rounded-pill shadow py-2 px-4 mt-2 mb-4">
                  <div className="row justify-content-center">
                    {[
                      ['Hari', time.day],
                      ['Jam', time.hour],
                      ['Menit', time.minute],
                      ['Detik', time.second],
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
                  Dengan memohon rahmat dan ridho Allah Subhanahu Wa Ta'ala, insyaAllah kami akan
                  menyelenggarakan acara:
                </p>
                <div className="overflow-x-hidden">
                  <div className="py-2" data-aos="fade-right" data-aos-duration="1500">
                    <h2 className="font-esthetic m-0 py-2" style={{ fontSize: '2rem' }}>
                      Akad
                    </h2>
                    <p style={{ fontSize: '0.95rem' }}>Pukul 10.00 WIB - Selesai</p>
                  </div>
                  <div className="py-2" data-aos="fade-left" data-aos-duration="1500">
                    <h2 className="font-esthetic m-0 py-2" style={{ fontSize: '2rem' }}>
                      Resepsi
                    </h2>
                    <p style={{ fontSize: '0.95rem' }}>Pukul 13.00 WIB - Selesai</p>
                  </div>
                </div>
                <div className="py-2" data-aos="fade-down" data-aos-duration="1500">
                  <a
                    href="https://goo.gl/maps/ALZR6FJZU3kxVwN86"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline-auto btn-sm rounded-pill shadow mb-2 px-3"
                  >
                    <i className="fa-solid fa-map-location-dot me-2"></i>Lihat Google Maps
                  </a>
                  <small className="d-block my-1">
                    RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191.
                  </small>
                </div>
              </div>
            </section>

            {/* Gallery */}
            <section className="bg-white-black pb-5 pt-3" id="gallery">
              <div className="container">
                <div className="border rounded-5 shadow p-3">
                  <h2 className="font-esthetic text-center py-2 m-0" style={{ fontSize: '2.25rem' }}>
                    Galeri
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
                  Dengan hormat, bagi Anda yang ingin memberikan tanda kasih kepada kami, dapat melalui:
                </p>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-money-bill-transfer"></i>
                  <p className="d-inline"> Transfer</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Riski Siapa?
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
                        <i className="fa-solid fa-building-columns me-1"></i>Bank Central Asia
                      </p>
                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <p className="m-0 p-0" style={{ fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-credit-card me-1"></i>1234567891234
                        </p>
                        <CopyButton value="1234567891234" />
                      </div>
                    </div>
                  </Collapse>
                </div>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-qrcode fa-lg"></i>
                  <p className="d-inline"> Qris</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Wahyu Siapa?
                    </p>
                    <button
                      className="btn btn-outline-auto btn-sm shadow-sm rounded-4 py-0"
                      style={{ fontSize: '0.75rem' }}
                      onClick={() => setQrisOpen((o) => !o)}
                    >
                      <i className="fa-solid fa-circle-info fa-sm me-1"></i>Info
                    </button>
                  </div>
                  <Collapse in={qrisOpen}>
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
                </div>

                <div className="bg-theme-auto rounded-4 shadow p-3 mx-4 mt-4 text-start" data-aos="fade-up" data-aos-duration="2500">
                  <i className="fa-solid fa-gift fa-lg"></i>
                  <p className="d-inline"> Gift</p>
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <p className="m-0 p-0" style={{ fontSize: '0.95rem' }}>
                      <i className="fa-regular fa-user fa-sm me-1"></i>Wahyu Siapa?
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
                          <i className="fa-solid fa-phone-volume me-1"></i>0812345678
                        </p>
                        <CopyButton value="0812345678" />
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <p className="my-0 p-0 text-truncate me-2" style={{ fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-location-dot me-1"></i>RT 10 RW 02, Desa Pajerukan, Kab.
                          Banyumas.
                        </p>
                        <CopyButton value="RT 10 RW 02, Desa Pajerukan, Kec. Kalibagor, Kab. Banyumas, Jawa Tengah 53191." />
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
                    Ucapan &amp; Doa
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
                <p className="pb-2 pt-4" style={{ fontSize: '0.95rem' }}>
                  Terima kasih atas perhatian dan doa restu Anda, yang menjadi kebahagiaan serta kehormatan
                  besar bagi kami.
                </p>
                <h2 className="font-esthetic" style={{ fontSize: '2rem' }}>
                  Wassalamualaikum Warahmatullahi Wabarakatuh
                </h2>
                <h2 className="font-arabic pt-4" style={{ fontSize: '2rem' }}>
                  اَلْحَمْدُ لِلّٰهِ رَبِّ الْعٰلَمِيْنَۙ
                </h2>
                <hr className="my-3" />
                <small>
                  Build with<i className="fa-solid fa-heart mx-1"></i>Dewanakl
                </small>
              </div>
            </section>
          </main>

          {/* Navbar Bottom */}
          <nav className="navbar navbar-expand sticky-bottom rounded-top-4 border-top p-0" id="navbar-menu">
            <ul className="navbar-nav nav-justified w-100 align-items-center">
              {[
                ['#home', 'fa-house', 'Home'],
                ['#bride', 'fa-user-group', 'Mempelai'],
                ['#wedding-date', 'fa-calendar-check', 'Tanggal'],
                ['#gallery', 'fa-images', 'Galeri'],
                ['#comment', 'fa-comments', 'Ucapan'],
              ].map(([href, icon, label]) => (
                <li className="nav-item" key={href}>
                  <a className="nav-link" href={href}>
                    <i className={`fa-solid ${icon}`}></i>
                    <span className="d-block" style={{ fontSize: '0.7rem' }}>
                      {label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Welcome overlay */}
      {!opened && (
        <div className="loading-page bg-white-black" id="welcome">
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
                Wahyu &amp; Riski
              </h2>
              {guestName && (
                <div className="m-2">
                  <small className="mt-0 mb-1 mx-0 p-0">Kepada Yth Bapak/Ibu/Saudara/i</small>
                  <p className="m-0 p-0" style={{ fontSize: '1.25rem' }}>
                    {guestName}
                  </p>
                </div>
              )}
              <button type="button" className="btn btn-light shadow rounded-4 mt-3 mx-auto" onClick={open}>
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
