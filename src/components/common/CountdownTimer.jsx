import { useState, useEffect } from 'react';

const CountdownTimer = ({ departureDate, departureTime }) => {
  const [timeLeft, setTimeLeft] = useState({});
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const departure = new Date(`${departureDate}T${departureTime}`);
      const now = new Date();
      const diff = departure - now;

      if (diff <= 0) {
        setExpired(true);
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    };

    calculateTime();
    const timer = setInterval(calculateTime, 1000);
    return () => clearInterval(timer);
  }, [departureDate, departureTime]);

  if (expired) {
    return <span className="badge badge-error">Departed</span>;
  }

  return (
    <div className="flex gap-2">
      <div className="flex flex-col items-center bg-base-200 rounded-lg px-2 py-1">
        <span className="font-bold text-lg">{timeLeft.days || 0}</span>
        <span className="text-xs text-base-content/60">days</span>
      </div>
      <div className="flex flex-col items-center bg-base-200 rounded-lg px-2 py-1">
        <span className="font-bold text-lg">{timeLeft.hours || 0}</span>
        <span className="text-xs text-base-content/60">hrs</span>
      </div>
      <div className="flex flex-col items-center bg-base-200 rounded-lg px-2 py-1">
        <span className="font-bold text-lg">{timeLeft.minutes || 0}</span>
        <span className="text-xs text-base-content/60">min</span>
      </div>
      <div className="flex flex-col items-center bg-base-200 rounded-lg px-2 py-1">
        <span className="font-bold text-lg">{timeLeft.seconds || 0}</span>
        <span className="text-xs text-base-content/60">sec</span>
      </div>
    </div>
  );
};
export default CountdownTimer;
