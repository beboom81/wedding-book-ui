import { useRef, useState } from 'react';
import { useComments } from './CommentContext';
import GifPicker, { type SelectedGif } from './GifPicker';
import { storage } from '../../lib/storage';
import { notify } from '../../lib/util';
import { useLang } from '../../context/LangContext';

const info = storage('weddingbook_information');

interface Props {
  variant: 'guest' | 'admin';
}

/** Top-level comment form. Guests also enter name + attendance. */
export default function CommentForm({ variant }: Props) {
  const { config, create } = useComments();
  const { t } = useLang();
  const tenorKey = config?.tenor_key ?? '';

  const [name, setName] = useState<string>(info.get<string>('name') ?? '');
  const [presence, setPresence] = useState<string>(
    info.has('presence') ? (info.get<boolean>('presence') ? '1' : '2') : '0',
  );
  const [comment, setComment] = useState('');
  const [gifOpen, setGifOpen] = useState(false);
  const [gif, setGif] = useState<SelectedGif | null>(null);
  const [sending, setSending] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const isGuest = variant === 'guest';

  const send = async () => {
    if (isGuest && name.trim().length === 0) {
      notify(t.nameEmpty).warning();
      return;
    }
    if (isGuest && presence === '0') {
      notify(t.attendanceEmpty).warning();
      return;
    }
    if (!gif && comment.trim().length === 0) {
      notify(t.commentEmpty).warning();
      return;
    }

    const isPresence = isGuest ? presence === '1' : true;
    if (isGuest) {
      info.set('name', name);
      info.set('presence', isPresence);
    }

    setSending(true);
    try {
      const res = await create({
        id: null,
        name: isGuest ? name : 'Admin',
        presence: isPresence,
        comment: gif ? null : comment,
        gif_id: gif?.id ?? null,
      });
      if (res) {
        setComment('');
        setGif(null);
        setGifOpen(false);
      }
    } finally {
      setSending(false);
    }
  };

  return (
    <div ref={formRef}>
      {isGuest && (
        <>
          <div className="mb-3">
            <label htmlFor="form-name" className="form-label my-1">
              <i className="fa-solid fa-person me-2"></i>{t.nameLabel}
            </label>
            <input
              dir="auto"
              type="text"
              className="form-control shadow-sm rounded-4"
              id="form-name"
              minLength={2}
              maxLength={50}
              placeholder={t.namePlaceholder}
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="form-presence" className="form-label my-1">
              <i className="fa-solid fa-person-circle-question me-2"></i>{t.attendanceLabel}
            </label>
            <select
              className="form-select shadow-sm rounded-4"
              id="form-presence"
              value={presence}
              onChange={(e) => setPresence(e.target.value)}
            >
              <option value="0">{t.confirmAttendance}</option>
              <option value="1">{t.willAttend}</option>
              <option value="2">{t.wontAttend}</option>
            </select>
          </div>
        </>
      )}

      {!gifOpen ? (
        <div className="d-block mb-3">
          <label htmlFor="form-comment" className="form-label my-1">
            <i className="fa-solid fa-comment me-2"></i>
            {t.commentLabel}
          </label>
          <div className="position-relative">
            {tenorKey && (
              <button
                type="button"
                className="btn btn-secondary btn-sm rounded-4 shadow-sm me-1 my-1 position-absolute bottom-0 end-0"
                onClick={() => setGifOpen(true)}
                aria-label="button gif"
              >
                <i className="fa-solid fa-photo-film"></i>
              </button>
            )}
            <textarea
              dir="auto"
              className="form-control shadow-sm rounded-4"
              id="form-comment"
              rows={isGuest ? 4 : 3}
              minLength={1}
              maxLength={1000}
              placeholder={isGuest ? t.commentPlaceholder : 'Type to comment'}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>
        </div>
      ) : (
        <div className="mb-3">
          <GifPicker
            tenorKey={tenorKey}
            onSelect={setGif}
            onBack={() => {
              setGif(null);
              setGifOpen(false);
            }}
          />
        </div>
      )}

      <div className={isGuest ? 'd-grid' : 'd-flex justify-content-end mb-0'}>
        <button
          className={`btn btn-primary btn-sm rounded-4 shadow ${isGuest ? 'm-1' : ''}`}
          onClick={send}
          disabled={sending}
        >
          {sending ? (
            <span className="spinner-border spinner-border-sm me-2" style={{ height: '0.8rem', width: '0.8rem' }} />
          ) : (
            <i className="fa-solid fa-paper-plane me-2"></i>
          )}
          {t.send}
        </button>
      </div>
    </div>
  );
}
