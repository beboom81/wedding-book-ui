import { Modal } from 'react-bootstrap';

interface Props {
  src: string | null;
  onHide: () => void;
}

/** Fullscreen image viewer with open-in-new-tab + download. */
export default function ImageModal({ src, onHide }: Props) {
  const download = () => {
    if (!src) return;
    const link = document.createElement('a');
    link.href = src;
    link.download = src.split('/').pop() || 'image';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Modal show={!!src} onHide={onHide} centered contentClassName="rounded-4 border border-0">
      <Modal.Body className="p-0">
        <div className="d-flex position-absolute top-0 end-0">
          <a
            className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
            role="button"
            target="_blank"
            rel="noreferrer"
            href={src ?? '#'}
          >
            <i className="fa-solid fa-arrow-up-right-from-square" style={{ width: '1em' }}></i>
          </a>
          <button
            className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
            onClick={download}
          >
            <i className="fa-solid fa-download" style={{ width: '1em' }}></i>
          </button>
          <button
            className="btn d-flex justify-content-center align-items-center bg-overlay-auto p-2 m-1 rounded-circle border shadow-sm z-1"
            onClick={onHide}
          >
            <i className="fa-solid fa-circle-xmark" style={{ width: '1em' }}></i>
          </button>
        </div>
        {src && <img src={src} className="img-fluid w-100 rounded-4 cursor-pointer" alt="image" />}
      </Modal.Body>
    </Modal>
  );
}
