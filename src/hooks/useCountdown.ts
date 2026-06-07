import { useEffect, useState } from 'react';

interface Countdown {
  day: string;
  hour: string;
  minute: string;
  second: string;
}

const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);

/** Live countdown to (or up from) the wedding date. Ported from guest.js. */
export function useCountdown(target: string): Countdown {
  const compute = (): Countdown => {
    const count = new Date(target.replace(' ', 'T')).getTime();
    const distance = Math.abs(count - Date.now());
    return {
      day: pad(Math.floor(distance / (1000 * 60 * 60 * 24))),
      hour: pad(Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))),
      minute: pad(Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))),
      second: pad(Math.floor((distance % (1000 * 60)) / 1000)),
    };
  };

  const [time, setTime] = useState<Countdown>(compute);

  useEffect(() => {
    const id = setInterval(() => setTime(compute()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target]);

  return time;
}
