import { useEffect } from 'react';
import { CommentProvider, useComments } from './CommentContext';
import CommentForm from './CommentForm';
import CommentCard from './CommentCard';
import type { GuestConfig } from '../../lib/types';

interface Props {
  token: string;
  isAdmin: boolean;
  config: GuestConfig | null;
  variant: 'guest' | 'admin';
}

export default function CommentSection({ token, isAdmin, config, variant }: Props) {
  return (
    <CommentProvider token={token} isAdmin={isAdmin} config={config}>
      <Inner variant={variant} />
    </CommentProvider>
  );
}

function Inner({ variant }: { variant: 'guest' | 'admin' }) {
  const { lists, loading, reload, page, count, per, totalPages, nextPage, prevPage } = useComments();

  useEffect(() => {
    reload();
  }, [reload]);

  const current = page / per + 1;
  const showPagination = count > per || page > 0;

  const emptyMessage =
    variant === 'guest' ? "📢 Let's share this invitation to get more comments! 🎉" : 'No comments yet.';

  return (
    <>
      <Form variant={variant} />

      <div className={variant === 'guest' ? 'py-3' : 'mb-2'}>
        {loading ? (
          <Loading per={per} />
        ) : lists.length === 0 ? (
          <div className="text-center p-4 mx-0 mt-0 mb-3 bg-theme-auto rounded-4 shadow">
            <p className="fw-bold p-0 m-0" style={{ fontSize: '0.95rem' }}>
              {emptyMessage}
            </p>
          </div>
        ) : (
          lists.map((c) => <CommentCard key={c.uuid} c={c} />)
        )}
      </div>

      {showPagination && (
        <nav className="d-flex justify-content-center mt-1 mb-0">
          <ul className="pagination mb-2 shadow-sm rounded-4">
            <li className={`page-item ${page === 0 ? 'disabled' : ''}`}>
              <button className="page-link rounded-start-4" onClick={prevPage} disabled={page === 0}>
                <i className="fa-solid fa-circle-left me-1"></i>Prev
              </button>
            </li>
            <li className="page-item disabled">
              <span className="page-link text-theme-auto">
                {current} / {totalPages}
              </span>
            </li>
            <li className={`page-item ${current >= totalPages ? 'disabled' : ''}`}>
              <button
                className="page-link rounded-end-4"
                onClick={nextPage}
                disabled={current >= totalPages}
              >
                Next<i className="fa-solid fa-circle-right ms-1"></i>
              </button>
            </li>
          </ul>
        </nav>
      )}
    </>
  );
}

function Form({ variant }: { variant: 'guest' | 'admin' }) {
  if (variant === 'admin') {
    return (
      <div className="bg-theme-auto p-3 mb-3 rounded-4 shadow">
        <CommentForm variant="admin" />
      </div>
    );
  }
  return (
    <div className="mb-3">
      <CommentForm variant="guest" />
    </div>
  );
}

function Loading({ per }: { per: number }) {
  return (
    <>
      {Array.from({ length: per }).map((_, i) => (
        <div key={i} className="bg-theme-auto shadow p-3 mx-0 mt-0 mb-3 rounded-4">
          <div className="d-flex justify-content-between align-items-center placeholder-wave">
            <span className="placeholder bg-secondary col-5 rounded-3 my-1"></span>
            <span className="placeholder bg-secondary col-3 rounded-3 my-1"></span>
          </div>
          <hr className="my-1" />
          <p className="placeholder-wave m-0">
            <span className="placeholder bg-secondary col-6 rounded-3"></span>
            <span className="placeholder bg-secondary col-12 rounded-3 my-1"></span>
          </p>
        </div>
      ))}
    </>
  );
}
