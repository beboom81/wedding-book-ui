import { useMemo, useState } from 'react';
import { request, HTTP_PATCH, HTTP_PUT } from '../../lib/api';
import { copyText, getGMTOffset, notify } from '../../lib/util';
import type { UserDetail } from '../../lib/types';

interface Props {
  user: UserDetail;
  token: string;
  onChanged: () => void;
  onLogout: () => void;
}

const allTimezones: string[] = (() => {
  try {
    return (Intl as unknown as { supportedValuesOf: (k: string) => string[] }).supportedValuesOf('timeZone');
  } catch {
    return [];
  }
})();

export default function Settings({ user, token, onChanged, onLogout }: Props) {
  const [name, setName] = useState(user.name);
  const [tz, setTz] = useState(user.tz ?? '');
  const [tzOpen, setTzOpen] = useState(false);
  const [tenor, setTenor] = useState(user.tenor_key ?? '');
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [copied, setCopied] = useState(false);

  const patch = async (body: Record<string, unknown>): Promise<boolean> => {
    const res = await request(HTTP_PATCH, '/api/user').token(token).body(body).send<{ status: boolean }>();
    return !!res.data?.status;
  };

  const tzMatches = useMemo(() => {
    const q = tz.trim().toLowerCase();
    const list = q ? allTimezones.filter((t) => t.toLowerCase().includes(q)) : allTimezones;
    return list.slice(0, 20);
  }, [tz]);

  const changeName = async () => {
    if (!name.trim()) {
      notify('Name cannot be empty').warning();
      return;
    }
    if (await patch({ name })) {
      notify('Success change name').success();
      onChanged();
    }
  };

  const regenerate = async () => {
    const res = await request(HTTP_PUT, '/api/key').token(token).send<{ status: boolean }>();
    if (res.data?.status) {
      onChanged();
    }
  };

  const changeTz = async () => {
    if (!allTimezones.includes(tz)) {
      notify('Timezone not supported').warning();
      return;
    }
    if (await patch({ tz })) {
      notify('Success change tz').success();
    }
  };

  const saveTenor = async () => {
    if (await patch({ tenor_key: tenor.length ? tenor : null })) {
      notify(`success ${tenor.length ? 'add' : 'remove'} tenor key`).success();
      onChanged();
    }
  };

  const toggle = async (key: string, value: boolean) => {
    await patch({ [key]: value });
    onChanged();
  };

  const changePassword = async () => {
    if (!oldPwd || !newPwd) {
      notify('Password cannot be empty').warning();
      return;
    }
    if (await patch({ old_password: oldPwd, new_password: newPwd })) {
      setOldPwd('');
      setNewPwd('');
      notify('Success change password').success();
    }
  };

  const copyKey = async () => {
    if (await copyText(user.access_key ?? '')) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  const Card = ({ icon, title, children }: { icon: string; title: string; children: React.ReactNode }) => (
    <div className="p-3 bg-theme-auto mb-3 rounded-4 shadow">
      <p className="mx-0 mt-0 mb-1 p-0 fw-bold">
        <i className={`fa-solid ${icon} me-2`}></i>
        {title}
      </p>
      {children}
    </div>
  );

  return (
    <section>
      <div className="rounded-4 p-2 mb-4 shadow" style={{ backgroundColor: 'var(--bs-gray-200)' }}>
        <h5 className="fw-bold my-1 ms-0 p-0" style={{ color: 'var(--bs-gray-900)', fontSize: '1rem' }}>
          <i className="fa-solid fa-gear mx-2"></i>Setting
        </h5>
      </div>

      <Card icon="fa-envelope" title="Email">
        <p className="m-0 p-0">{user.email}</p>
      </Card>

      <Card icon="fa-person" title="Name">
        <div className="mb-3">
          <input
            dir="auto"
            type="text"
            className="form-control form-control-sm rounded-4 shadow-sm"
            minLength={2}
            maxLength={50}
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary rounded-4 shadow-sm" onClick={changeName}>
            Change
          </button>
        </div>
      </Card>

      <Card icon="fa-key" title="Access Key">
        <div className="input-group input-group-sm mb-3">
          <input
            type="text"
            className="form-control form-control-sm rounded-start-4 shadow-sm"
            value={user.access_key ?? ''}
            placeholder="Regenerate key"
            readOnly
          />
          <button className="btn btn-sm btn-outline-secondary rounded-end-4 shadow-sm" onClick={copyKey}>
            <i className={`fa-solid ${copied ? 'fa-check' : 'fa-copy'}`}></i>
          </button>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary rounded-4 shadow-sm" onClick={regenerate}>
            Regenerate
          </button>
        </div>
      </Card>

      <Card icon="fa-location-dot" title="Time Zone">
        <div className="position-relative mb-3">
          <input
            type="text"
            className="form-control form-control-sm rounded-4 shadow-sm"
            value={tz}
            onChange={(e) => {
              setTz(e.target.value);
              setTzOpen(true);
            }}
            onFocus={() => setTzOpen(true)}
          />
          {tzOpen && (
            <div
              className="list-group position-absolute w-100 shadow-sm rounded-4 overflow-y-scroll z-3"
              style={{ maxHeight: '15rem' }}
            >
              {tzMatches.map((t) => (
                <button
                  key={t}
                  type="button"
                  className="list-group-item list-group-item-action py-1 small"
                  onClick={() => {
                    setTz(t);
                    setTzOpen(false);
                  }}
                >
                  {t} ({getGMTOffset(t)})
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary rounded-4 shadow-sm" onClick={changeTz}>
            Change
          </button>
        </div>
      </Card>

      <Card icon="fa-photo-film" title="Tenor Key">
        <div className="input-group input-group-sm mb-3">
          <input
            type="text"
            className="form-control form-control-sm rounded-start-4 shadow-sm"
            placeholder="Api key tenor"
            value={tenor}
            onChange={(e) => setTenor(e.target.value)}
          />
          <button className="btn btn-sm btn-outline-secondary rounded-end-4 shadow-sm" onClick={() => setTenor('')}>
            <i className="fa-solid fa-trash-can"></i>
          </button>
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary rounded-4 shadow-sm" onClick={saveTenor}>
            Save
          </button>
        </div>
      </Card>

      <Card icon="fa-sliders" title="Control">
        {[
          ['filter', 'Filter bad word', user.is_filter],
          ['confetti_animation', 'Confetti animation', user.is_confetti_animation],
          ['can_reply', 'Can reply', user.can_reply],
          ['can_edit', 'Can edit', user.can_edit],
          ['can_delete', 'Can delete', user.can_delete],
        ].map(([key, label, value]) => (
          <div className="form-check form-switch mb-1" key={key as string}>
            <input
              className="form-check-input shadow-sm"
              style={{ cursor: 'pointer' }}
              type="checkbox"
              role="switch"
              id={key as string}
              checked={value as boolean}
              onChange={(e) => toggle(key as string, e.target.checked)}
            />
            <label className="form-check-label" style={{ cursor: 'pointer' }} htmlFor={key as string}>
              {label as string}
            </label>
          </div>
        ))}
      </Card>

      <Card icon="fa-lock" title="Change Password">
        <div className="my-2">
          <input
            type="password"
            className="form-control form-control-sm rounded-4 shadow-sm"
            minLength={8}
            maxLength={20}
            placeholder="Old Password"
            autoComplete="current-password"
            value={oldPwd}
            onChange={(e) => setOldPwd(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control form-control-sm rounded-4 shadow-sm"
            minLength={8}
            maxLength={20}
            placeholder="New Password"
            autoComplete="new-password"
            value={newPwd}
            onChange={(e) => setNewPwd(e.target.value)}
          />
        </div>
        <div className="d-flex justify-content-end">
          <button className="btn btn-sm btn-primary rounded-4 shadow-sm" onClick={changePassword}>
            Change
          </button>
        </div>
      </Card>

      <div className="d-block d-md-none">
        <div className="p-3 bg-theme-auto mb-3 rounded-4 shadow">
          <button
            className="btn btn-danger btn-sm w-100 text-center fw-semibold rounded-4 shadow-sm"
            onClick={onLogout}
          >
            <i className="fa-solid fa-right-from-bracket me-2"></i>Logout
          </button>
        </div>
      </div>
    </section>
  );
}
