import { useCallback, useEffect, useState } from 'react';
import { request, HTTP_GET } from '../lib/api';
import { session } from '../lib/session';
import { ask, formatNumber } from '../lib/util';
import { useTheme } from '../context/ThemeContext';
import type { GuestConfig, Stats, UserDetail } from '../lib/types';
import LoginModal from '../components/admin/LoginModal';
import Settings from '../components/admin/Settings';
import CommentSection from '../components/comment/CommentSection';

type Tab = 'home' | 'setting';

export default function DashboardPage() {
  const { toggle } = useTheme();
  const [authed, setAuthed] = useState(session.isValid());
  const [tab, setTab] = useState<Tab>('home');
  const [user, setUser] = useState<UserDetail | null>(null);
  const [config, setConfig] = useState<GuestConfig | null>(null);
  const [stats, setStats] = useState<Stats | null>(null);

  const token = session.getToken() ?? '';

  const loadAll = useCallback(async () => {
    if (!session.isValid()) {
      setAuthed(false);
      return;
    }
    try {
      const [u, c, s] = await Promise.all([
        request(HTTP_GET, '/api/user').token(token).send<UserDetail>(),
        request(HTTP_GET, '/api/v2/config').token(token).send<GuestConfig>(),
        request(HTTP_GET, '/api/stats').token(token).send<Stats>(),
      ]);
      setUser(u.data);
      setConfig(c.data);
      setStats(s.data);
    } catch {
      session.logout();
      setAuthed(false);
    }
  }, [token]);

  useEffect(() => {
    if (authed) {
      loadAll();
    }
  }, [authed, loadAll]);

  const download = async () => {
    await request(HTTP_GET, '/api/download').token(token).download('comments.csv').send();
  };

  const logout = () => {
    if (!ask('Are you sure?')) {
      return;
    }
    session.logout();
    setUser(null);
    setAuthed(false);
  };

  const statCards: [string, string, number | undefined, string][] = [
    ['Comments', '#8573F1', stats?.comments, 'fa-comments'],
    ['Present', '#7A5CD9', stats?.present, 'fa-circle-check'],
    ['Absent', '#6546B1', stats?.absent, 'fa-circle-xmark'],
    ['Likes', '#4F3392', stats?.likes, 'fa-heart'],
  ];

  return (
    <>
      <LoginModal show={!authed} onSuccess={() => setAuthed(true)} />

      {/* Mobile bottom nav */}
      <nav className="navbar navbar-expand fixed-bottom rounded-top-4 border-top d-md-none p-0">
        <ul className="navbar-nav nav-justified w-100 align-items-center">
          <li className="nav-item">
            <button className={`nav-link ${tab === 'home' ? 'active' : ''}`} onClick={() => setTab('home')}>
              <i className="fa-solid fa-house"></i>
              <span className="d-block" style={{ fontSize: '0.7rem' }}>
                Home
              </span>
            </button>
          </li>
          <li className="nav-item">
            <button className={`nav-link ${tab === 'setting' ? 'active' : ''}`} onClick={() => setTab('setting')}>
              <i className="fa-solid fa-gear"></i>
              <span className="d-block" style={{ fontSize: '0.7rem' }}>
                Setting
              </span>
            </button>
          </li>
        </ul>
      </nav>

      <main className="container mt-4 mb-5">
        <div className="d-none d-sm-flex justify-content-between align-items-center mt-4 mb-5 pt-1">
          <h4 className="m-0 p-0 flex-grow-1 fw-bold">
            WeddingBook<i className="fa-solid fa-fire text-danger ms-2"></i>
          </h4>
          <div className="m-0 p-0 flex-grow-1 text-end" style={{ fontSize: '1.4rem' }}>
            {user ? (
              <>
                {user.name}
                <i className="fa-solid fa-hands text-warning ms-2"></i>
              </>
            ) : (
              <span className="placeholder col-3 rounded-4" />
            )}
          </div>
        </div>

        <div className="row m-0 p-0">
          {/* Sidebar */}
          <div className="col-md-3 d-none d-md-block m-0 p-0">
            <ul className="nav flex-column w-100 nav-pills pe-4" role="tablist">
              <li className="nav-item pe-2">
                <button
                  className={`btn-theme-auto nav-link w-100 text-start fw-semibold mb-1 rounded-4 shadow-sm ${tab === 'home' ? 'active' : ''}`}
                  onClick={() => setTab('home')}
                >
                  <i className="fa-solid fa-house ms-3 me-2"></i>Home
                </button>
              </li>
              <li className="nav-item pe-2">
                <button
                  className={`btn-theme-auto nav-link w-100 text-start fw-semibold my-1 rounded-4 shadow-sm ${tab === 'setting' ? 'active' : ''}`}
                  onClick={() => setTab('setting')}
                >
                  <i className="fa-solid fa-gear ms-3 me-2"></i>Setting
                </button>
              </li>
              <li className="nav-item pe-2">
                <hr className="my-2" />
              </li>
              <li className="nav-item pe-2">
                <button
                  className="btn-theme-auto nav-link w-100 text-start fw-semibold mt-1 rounded-4 shadow-sm"
                  onClick={logout}
                >
                  <i className="fa-solid fa-right-from-bracket ms-3 me-2"></i>Logout
                </button>
              </li>
            </ul>
          </div>

          {/* Content */}
          <div className="col-md-9 m-0 p-0">
            {tab === 'home' && (
              <section>
                <div className="rounded-4 p-2 mb-4 shadow" style={{ backgroundColor: 'var(--bs-gray-200)' }}>
                  <div className="d-flex justify-content-between">
                    <h5 className="fw-bold my-1 ms-0 p-0" style={{ color: 'var(--bs-gray-900)', fontSize: '1rem' }}>
                      <i className="fa-solid fa-home mx-2"></i>Home
                    </h5>
                    <div className="d-flex">
                      <button
                        className="btn btn-success rounded-3 btn-sm shadow-sm my-0 ms-0 me-2 pb-0"
                        onClick={download}
                        aria-label="Download comment"
                      >
                        <i className="fa-solid fa-download"></i>
                        <span className="d-none d-sm-inline ms-2">Download</span>
                      </button>
                      <button
                        className="btn btn-secondary rounded-3 btn-sm shadow-sm m-0 pb-0"
                        onClick={toggle}
                        aria-label="Change theme"
                      >
                        <i className="fa-solid fa-circle-half-stroke"></i>
                        <span className="d-none d-sm-inline ms-2">Theme</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  {statCards.map(([label, bg, value, icon]) => (
                    <div className="col col-xl-3 col-6 mb-3" key={label}>
                      <div className="rounded-4 shadow p-3 border-0" style={{ background: bg }}>
                        <div className="row align-items-center" style={{ color: 'var(--bs-gray-100)' }}>
                          <div className="col-9">
                            <p className="fw-bold m-0 p-0">{label}</p>
                            <div className="fw-bold m-0 p-0">
                              {value === undefined ? (
                                <span className="placeholder col-8 rounded-3" />
                              ) : (
                                formatNumber(value)
                              )}
                            </div>
                          </div>
                          <div className="col-3 p-0">
                            <i className={`fa-solid ${icon} fa-2xl me-2`}></i>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="row mt-2">
                  <div className="col-12">
                    {authed && token && (
                      <CommentSection token={token} isAdmin config={config} variant="admin" />
                    )}
                  </div>
                </div>
              </section>
            )}

            {tab === 'setting' && user && (
              <Settings user={user} token={token} onChanged={loadAll} onLogout={logout} />
            )}
          </div>
        </div>
      </main>
    </>
  );
}
