import { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from '../../lib/util';

interface TenorResult {
  id: string;
  content_description: string;
  media_formats: { tinygif: { url: string } };
}

export interface SelectedGif {
  id: string;
  url: string;
}

interface Props {
  tenorKey: string;
  onSelect: (gif: SelectedGif | null) => void;
  onBack: () => void;
}

/**
 * Tenor GIF picker (featured + search). Replaces the original gif.js masonry
 * picker with a simpler responsive grid that returns the chosen GIF id + url.
 */
export default function GifPicker({ tenorKey, onSelect, onBack }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<TenorResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<SelectedGif | null>(null);

  const fetchGifs = useCallback(
    async (q: string) => {
      if (!tenorKey) {
        return;
      }
      setLoading(true);
      const path = q.trim() ? 'search' : 'featured';
      const params = new URLSearchParams({
        key: tenorKey,
        media_filter: 'tinygif',
        client_key: 'weddingbook_app',
        limit: '24',
      });
      if (q.trim()) {
        params.set('q', q.trim());
      }
      try {
        const res = await fetch(`https://tenor.googleapis.com/v2/${path}?${params.toString()}`);
        const json = await res.json();
        setResults(json.results ?? []);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    },
    [tenorKey],
  );

  const debouncedFetch = useRef(debounce((q: string) => fetchGifs(q), 600)).current;

  useEffect(() => {
    fetchGifs('');
  }, [fetchGifs]);

  const onInput = (v: string) => {
    setQuery(v);
    debouncedFetch(v);
  };

  const choose = (r: TenorResult) => {
    const gif = { id: r.id, url: r.media_formats.tinygif.url };
    setSelected(gif);
    onSelect(gif);
  };

  const cancel = () => {
    setSelected(null);
    onSelect(null);
  };

  if (selected) {
    return (
      <figure className="d-flex m-0 position-relative">
        <button
          type="button"
          onClick={cancel}
          className="btn d-flex position-absolute justify-content-center align-items-center top-0 end-0 bg-overlay-auto p-2 m-0 rounded-circle border shadow-sm z-1"
          aria-label="cancel gif"
        >
          <i className="fa-solid fa-circle-xmark"></i>
        </button>
        <img src={selected.url} className="img-fluid mx-auto gif-image rounded-4" alt="selected-gif" />
      </figure>
    );
  }

  return (
    <div>
      <label className="form-label my-1">
        <i className="fa-solid fa-photo-film me-2"></i>Gif
      </label>
      <div className="d-flex mb-3">
        <button
          type="button"
          className="btn btn-secondary btn-sm rounded-4 shadow-sm me-1 my-1"
          onClick={onBack}
          aria-label="back"
        >
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <input
          dir="auto"
          type="text"
          className="form-control shadow-sm rounded-4"
          placeholder="Search for a GIF on Tenor"
          value={query}
          onChange={(e) => onInput(e.target.value)}
        />
      </div>

      <div
        className="rounded-4 p-2 overflow-y-scroll border position-relative"
        style={{ height: '15rem' }}
      >
        {loading && (
          <div className="position-absolute top-50 start-50 translate-middle">
            <span className="spinner-border spinner-border-sm" />
          </div>
        )}
        <div
          style={{ columnCount: 3, columnGap: '0.5rem' }}
        >
          {results.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => choose(r)}
              className="btn p-0 mb-2 d-block w-100 border-0"
              style={{ breakInside: 'avoid' }}
              aria-label="select gif"
            >
              <img
                src={r.media_formats.tinygif.url}
                className="img-fluid rounded-3"
                alt={r.content_description}
                style={{ width: '100%' }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
