import { useState, useEffect } from 'react';
import { formatHijriDate } from '@/lib/hijriCalendar';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function DigitalClock() {
  const [now, setNow] = useState(new Date());
  const [colon, setColon] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
      setColon(c => !c);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const day = DAYS[now.getDay()];
  const engDate = `${day}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  const hijriDate = formatHijriDate(now);

  return (
    <div className="flex flex-col items-end select-none min-w-[180px]">
      {/* Digital time */}
      <div className="font-digital text-glow-red text-xl leading-none tracking-widest">
        {h}
        <span className={colon ? 'opacity-100' : 'opacity-30'}>:</span>
        {m}
        <span className={colon ? 'opacity-30' : 'opacity-100'}>:</span>
        {s}
      </div>
      {/* English date */}
      <div className="text-[9px] text-blue-600 font-medium mt-0.5 tracking-wide opacity-90">
        {engDate}
      </div>
      {/* Hijri date */}
      <div className="text-[9px] text-cyan-600 font-medium tracking-wide opacity-85">
        ☪ {hijriDate}
      </div>
    </div>
  );
}
