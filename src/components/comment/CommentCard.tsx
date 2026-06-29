import { useState } from 'react';
import { useComments } from './CommentContext';
import GifPicker, { type SelectedGif } from './GifPicker';
import type { CommentItem } from '../../lib/types';
import { ask, convertMarkdownToHTML, escapeHtml, parseUserAgent } from '../../lib/util';
import { useLang } from '../../context/LangContext';
import { storage } from '../../lib/storage';
import { notify } from '../../lib/util';

const info = storage('weddingbook_information');

const MAX_LEN = 300;

export default function CommentCard({ c }: { c: CommentItem }) {
  const { isAdmin, config, owns, likes, like, unlike, create, update, remove } = useComments();
  const { t } = useLang();

  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [busy, setBusy] = useState(false);

  const liked = likes.has(c.uuid);
  const isOwner = owns.has(c.uuid);
  const tenorKey = config?.tenor_key ?? '';

  const canReply = config?.can_reply !== false;
  const canEditCfg = config?.can_edit !== false;
  const canDeleteCfg = config?.can_delete !== false;

  const showEdit =
    ((isAdmin && c.is_admin) || (isOwner && canEditCfg)) && (!c.gif_url || !!tenorKey);
  const showDelete = isAdmin || (isOwner && canDeleteCfg);

  const toggleLike = async () => {
    setBusy(true);
    try {
      if (liked) {
        await unlike(c.uuid);
      } else {
        await like(c.uuid);
      }
    } finally {
      setBusy(false);
    }
  };

  const onDelete = async () => {
    if (!ask(t.areYouSure)) {
      return;
    }
    const own = owns.get<string>(c.uuid) ?? c.own;
    if (!own) {
      return;
    }
    await remove(own);
  };

  const headerClass = c.is_parent
    ? 'bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4'
    : 'overflow-x-auto mw-100 border-start bg-theme-auto py-2 ps-2 pe-0 my-2 ms-2 me-0';

  const title = c.is_admin ? (
    <>
      <strong className="me-1">{c.name}</strong>
      <i className="fa-solid fa-certificate text-primary"></i>
    </>
  ) : c.is_parent ? (
    <>
      <strong className="me-1">{c.name}</strong>
      <i
        className={`fa-solid ${c.presence ? 'fa-circle-check text-success' : 'fa-circle-xmark text-danger'}`}
      ></i>
    </>
  ) : (
    <strong>{c.name}</strong>
  );

  const renderBody = () => {
    if (c.gif_url) {
      return (
        <div className="d-flex justify-content-center align-items-center my-2">
          <img src={c.gif_url} className="img-fluid mx-auto gif-image rounded-4" alt="gif" />
        </div>
      );
    }
    const text = c.comment ?? '';
    const tooLong = text.length > MAX_LEN;
    const shown = tooLong && !expanded ? text.slice(0, MAX_LEN) + '...' : text;
    return (
      <>
        <p
          dir="auto"
          className="text-theme-auto my-1 mx-0 p-0"
          style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}
          dangerouslySetInnerHTML={{ __html: convertMarkdownToHTML(escapeHtml(shown)) }}
        />
        {tooLong && (
          <p className="d-block mb-2 mt-0 mx-0 p-0">
            <a
              className="text-theme-auto"
              role="button"
              style={{ fontSize: '0.85rem' }}
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? t.readLess : t.readMore}
            </a>
          </p>
        )}
      </>
    );
  };

  return (
    <div className={headerClass} id={c.uuid} style={{ overflowWrap: 'break-word' }}>
      <div tabIndex={0}>
        <div className="d-flex justify-content-between align-items-center">
          <p className="text-theme-auto text-truncate m-0 p-0" style={{ fontSize: '0.95rem' }}>
            {title}
          </p>
          <small className="text-theme-auto m-0 p-0" style={{ fontSize: '0.75rem' }}>
            {c.created_at}
          </small>
        </div>
        <hr className="my-1" />
        {renderBody()}
      </div>

      {isAdmin && c.ip && c.user_agent && !c.is_admin && (
        <div className="mb-1 mt-3">
          <p className="text-theme-auto mb-1 mx-0 mt-0 p-0" style={{ fontSize: '0.7rem' }}>
            <i className="fa-solid fa-location-dot me-1"></i>
            {c.ip}
          </p>
          <p className="text-theme-auto m-0 p-0" style={{ fontSize: '0.7rem' }}>
            <i className="fa-solid fa-mobile-screen-button me-1"></i>
            {parseUserAgent(c.user_agent)}
          </p>
        </div>
      )}

      <div className="d-flex justify-content-between align-items-center">
        <div className="d-flex justify-content-start align-items-center">
          {canReply && (
            <button
              style={{ fontSize: '0.8rem' }}
              onClick={() => {
                const savedName = info.get<string>('name') ?? '';
                if (!savedName.trim()) {
                  notify(t.nameEmpty).warning();
                  return;
                }
                setReplyOpen((o) => !o);
              }}
              className="btn btn-sm btn-outline-auto rounded-4 py-0 me-1 shadow-sm"
            >
              {t.reply}
            </button>
          )}
          {showEdit && (
            <button
              style={{ fontSize: '0.8rem' }}
              onClick={() => setEditOpen((o) => !o)}
              className="btn btn-sm btn-outline-auto rounded-4 py-0 me-1 shadow-sm"
            >
              {t.edit}
            </button>
          )}
          {showDelete && (
            <button
              style={{ fontSize: '0.8rem' }}
              onClick={onDelete}
              className="btn btn-sm btn-outline-auto rounded-4 py-0 me-1 shadow-sm"
            >
              {t.delete}
            </button>
          )}
        </div>

        {c.comments.length > 0 && (
          <a
            className="text-theme-auto me-auto ms-1 py-0"
            style={{ fontSize: '0.8rem' }}
            role="button"
            onClick={() => setShowReplies((s) => !s)}
          >
            {showReplies ? t.hideReplies : t.showReplies(c.comments.length)}
          </a>
        )}

        <button
          style={{ fontSize: '0.8rem' }}
          onClick={toggleLike}
          disabled={busy}
          className="btn btn-sm btn-outline-auto ms-auto rounded-3 p-0 shadow-sm d-flex justify-content-start align-items-center"
        >
          <span className="my-0 mx-1">{c.like_count}</span>
          <i className={`me-1 ${liked ? 'fa-solid fa-heart text-danger' : 'fa-regular fa-heart'}`}></i>
        </button>
      </div>

      {replyOpen && (
        <ReplyForm
          tenorKey={tenorKey}
          onCancel={() => setReplyOpen(false)}
          onSubmit={async (text, gif) => {
            const res = await create({
              id: c.uuid,
              name: info.get<string>('name') ?? 'Guest',
              presence: true,
              comment: gif ? null : text,
              gif_id: gif?.id ?? null,
            });
            if (res) {
              setReplyOpen(false);
              setShowReplies(true);
            }
          }}
        />
      )}

      {editOpen && (
        <EditForm
          comment={c}
          tenorKey={tenorKey}
          allowPresence={c.is_parent && !isAdmin}
          onCancel={() => setEditOpen(false)}
          onSubmit={async (presence, text, gif) => {
            const own = owns.get<string>(c.uuid) ?? c.own;
            if (!own) {
              return;
            }
            const ok = await update(own, {
              presence,
              comment: gif ? null : text,
              gif_id: gif?.id ?? null,
            });
            if (ok) {
              setEditOpen(false);
            }
          }}
        />
      )}

      {showReplies && c.comments.length > 0 && (
        <div>
          {c.comments.map((child) => (
            <CommentCard key={child.uuid} c={child} />
          ))}
        </div>
      )}
    </div>
  );
}

function ReplyForm({
  tenorKey,
  onCancel,
  onSubmit,
}: {
  tenorKey: string;
  onCancel: () => void;
  onSubmit: (text: string, gif: SelectedGif | null) => Promise<void>;
}) {
  const [text, setText] = useState('');
  const [gifOpen, setGifOpen] = useState(false);
  const [gif, setGif] = useState<SelectedGif | null>(null);
  const [busy, setBusy] = useState(false);
  const { t } = useLang();

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(text, gif);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="my-2">
      <p className="my-1 mx-0 p-0" style={{ fontSize: '0.95rem' }}>
        <i className="fa-solid fa-reply me-2"></i>{t.reply}
      </p>
      {gifOpen ? (
        <GifPicker tenorKey={tenorKey} onSelect={setGif} onBack={() => { setGif(null); setGifOpen(false); }} />
      ) : (
        <div className="position-relative">
          {tenorKey && (
            <button
              className="btn btn-secondary btn-sm rounded-4 shadow-sm me-1 my-1 position-absolute bottom-0 end-0"
              onClick={() => setGifOpen(true)}
              aria-label="button gif"
            >
              <i className="fa-solid fa-photo-film"></i>
            </button>
          )}
          <textarea
            dir="auto"
            className="form-control shadow-sm rounded-4 mb-2"
            minLength={1}
            maxLength={1000}
            placeholder={t.replyPlaceholder}
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
      )}
      <div className="d-flex justify-content-end align-items-center mb-0">
        <button
          style={{ fontSize: '0.8rem' }}
          onClick={onCancel}
          className="btn btn-sm btn-outline-auto rounded-4 py-0 me-1"
        >
          {t.cancel}
        </button>
        <button
          style={{ fontSize: '0.8rem' }}
          onClick={submit}
          disabled={busy}
          className="btn btn-sm btn-outline-auto rounded-4 py-0"
        >
          {t.send}
        </button>
      </div>
    </div>
  );
}

function EditForm({
  comment,
  tenorKey,
  allowPresence,
  onCancel,
  onSubmit,
}: {
  comment: CommentItem;
  tenorKey: string;
  allowPresence: boolean;
  onCancel: () => void;
  onSubmit: (presence: boolean | null, text: string, gif: SelectedGif | null) => Promise<void>;
}) {
  const isGif = !!comment.gif_url;
  const [text, setText] = useState(comment.comment ?? '');
  const [presence, setPresence] = useState(comment.presence ? '1' : '2');
  const [gif, setGif] = useState<SelectedGif | null>(null);
  const [busy, setBusy] = useState(false);
  const { t } = useLang();

  const submit = async () => {
    setBusy(true);
    try {
      await onSubmit(allowPresence ? presence === '1' : null, text, gif);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="my-2">
      <p className="my-1 mx-0 p-0" style={{ fontSize: '0.95rem' }}>
        <i className="fa-solid fa-pen me-2"></i>{t.edit}
      </p>
      {allowPresence && (
        <select
          className="form-select shadow-sm mb-2 rounded-4"
          value={presence}
          onChange={(e) => setPresence(e.target.value)}
        >
          <option value="1">{t.attending}</option>
          <option value="2">{t.notAttending}</option>
        </select>
      )}
      {isGif ? (
        <GifPicker tenorKey={tenorKey} onSelect={setGif} onBack={onCancel} />
      ) : (
        <textarea
          dir="auto"
          className="form-control shadow-sm rounded-4 mb-2"
          minLength={1}
          maxLength={1000}
          placeholder={t.updateCommentPlaceholder}
          rows={3}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}
      <div className="d-flex justify-content-end align-items-center mb-0">
        <button
          style={{ fontSize: '0.8rem' }}
          onClick={onCancel}
          className="btn btn-sm btn-outline-auto rounded-4 py-0 me-1"
        >
          {t.cancel}
        </button>
        <button
          style={{ fontSize: '0.8rem' }}
          onClick={submit}
          disabled={busy}
          className="btn btn-sm btn-outline-auto rounded-4 py-0"
        >
          {t.update}
        </button>
      </div>
    </div>
  );
}
