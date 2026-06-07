import { useTheme } from '../../context/ThemeContext';

interface Props {
  showMusic: boolean;
  musicPlaying: boolean;
  onToggleMusic: () => void;
}

export default function FloatingButtons({ showMusic, musicPlaying, onToggleMusic }: Props) {
  const { toggle } = useTheme();

  return (
    <div
      className="d-flex position-fixed flex-column"
      style={{ bottom: '10vh', right: '2vh', zIndex: 1030 }}
    >
      <button
        type="button"
        className="btn bg-light-dark border btn-sm rounded-circle btn-transparent shadow-sm mt-3"
        aria-label="Change theme"
        onClick={toggle}
      >
        <i className="fa-solid fa-circle-half-stroke"></i>
      </button>

      {showMusic && (
        <button
          type="button"
          className="btn bg-light-dark border btn-sm rounded-circle btn-transparent shadow-sm mt-3"
          aria-label="Change audio"
          onClick={onToggleMusic}
        >
          <i className={`fa-solid ${musicPlaying ? 'fa-circle-pause spin-button' : 'fa-circle-play'}`}></i>
        </button>
      )}
    </div>
  );
}
