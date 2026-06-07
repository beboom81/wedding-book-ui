const markdownRules: [string, RegExp, string][] = [
  ['*', /\*(\S(?:[\s\S]*?\S)?)\*/g, '<strong class="text-theme-auto">$1</strong>'],
  ['_', /_(\S(?:[\s\S]*?\S)?)_/g, '<em class="text-theme-auto">$1</em>'],
  ['~', /~(\S(?:[\s\S]*?\S)?)~/g, '<del class="text-theme-auto">$1</del>'],
  ['```', /```(\S(?:[\s\S]*?\S)?)```/g, '<code class="font-monospace text-theme-auto">$1</code>'],
];

const deviceTypes = [
  { type: 'Mobile', regex: /Android.*Mobile|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i },
  { type: 'Tablet', regex: /iPad|Android(?!.*Mobile)|Tablet/i },
  { type: 'Desktop', regex: /Windows NT|Macintosh|Linux/i },
];

const browsers = [
  { name: 'Edge', regex: /Edg|Edge/i },
  { name: 'Samsung Browser', regex: /SamsungBrowser/i },
  { name: 'Opera', regex: /Opera|OPR/i },
  { name: 'Chrome', regex: /Chrome|CriOS/i },
  { name: 'Firefox', regex: /Firefox|FxiOS/i },
  { name: 'Safari', regex: /Safari/i },
  { name: 'Internet Explorer', regex: /MSIE|Trident/i },
];

const operatingSystems = [
  { name: 'Windows', regex: /Windows NT ([\d.]+)/i },
  { name: 'Android', regex: /Android ([\d.]+)/i },
  { name: 'iOS', regex: /OS ([\d_]+) like Mac OS X/i },
  { name: 'MacOS', regex: /Mac OS X ([\d_.]+)/i },
  { name: 'Chrome OS', regex: /CrOS/i },
  { name: 'Ubuntu', regex: /Ubuntu/i },
  { name: 'Linux', regex: /Linux/i },
];

export const escapeHtml = (unsafe: string): string =>
  String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

export const convertMarkdownToHTML = (str: string): string => {
  let out = str;
  markdownRules.forEach(([, regex, replacement]) => {
    out = out.replace(regex, replacement);
  });
  return out;
};

export const notify = (message: string) => {
  const exec = (emoji: string) => window.alert(`${emoji} ${message}`);
  return {
    success: () => exec('🟩'),
    error: () => exec('🟥'),
    warning: () => exec('🟨'),
    info: () => exec('🟦'),
  };
};

export const ask = (message: string): boolean => window.confirm(`🟦 ${message}`);

export const copyText = async (data: string): Promise<boolean> => {
  if (!data) {
    notify('Nothing to copy').warning();
    return false;
  }
  try {
    await navigator.clipboard.writeText(data);
    return true;
  } catch {
    notify('Failed to copy').error();
    return false;
  }
};

export const parseUserAgent = (userAgent?: string | null): string => {
  if (!userAgent) {
    return 'Unknown';
  }
  const deviceType = deviceTypes.find((i) => i.regex.test(userAgent))?.type ?? 'Unknown';
  const browser = browsers.find((i) => i.regex.test(userAgent))?.name ?? 'Unknown';
  const osMatch = operatingSystems.find((i) => i.regex.test(userAgent));
  const osName = osMatch ? osMatch.name : 'Unknown';
  const osVersion = osMatch ? userAgent.match(osMatch.regex)?.[1]?.replace(/_/g, '.') ?? null : null;
  return `${browser} ${deviceType} ${osVersion ? `${osName} ${osVersion}` : osName}`;
};

export const getGMTOffset = (tz: string): string => {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', { timeZone: tz, hourCycle: 'h23', hour: 'numeric' });
  let offset = (parseInt(formatter.format(now)) - now.getUTCHours() + 24) % 24;
  if (offset > 12) {
    offset -= 24;
  }
  return `GMT${offset >= 0 ? '+' : ''}${offset}`;
};

export const formatNumber = (n: number): string =>
  String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const debounce = <A extends unknown[]>(callback: (...args: A) => void, delay = 100) => {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: A) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => callback(...args), delay);
  };
};
