import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../Styles/Countdown.css'; // Import vlastního CSS

const Countdown = () => {
  const targetDate = new Date('2025-08-16T00:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return (
    <div className="container custom-container">
      <div className="row">
        <div className="col-12 col-lg-6 text-center text-lg-start mb-4 mb-lg-0">
          <h1>MerWeekend 2025</h1>
          <h2>
            <a
              href="https://facebook.com/events/s/merweekend-2025/531073163082523/"
              target="_blank"
              rel="noopener noreferrer"
              className="custom-link"
            >
              Sledujte na Facebooku
            </a>
          </h2>
        </div>
        <div className="col-12 col-lg-6 d-flex justify-content-center justify-content-lg-around align-items-center">
          <div className="text-center mx-3">
            <div className="countdown-time">{timeLeft.days}</div>
            <div className="countdown-label">dní</div>
          </div>
          <div className="text-center mx-3">
            <div className="countdown-time">{timeLeft.hours}</div>
            <div className="countdown-label">hodin</div>
          </div>
          <div className="text-center mx-3">
            <div className="countdown-time">{timeLeft.minutes}</div>
            <div className="countdown-label">minut</div>
          </div>
          <div className="text-center mx-3">
            <div className="countdown-time">{timeLeft.seconds}</div>
            <div className="countdown-label">vteřin</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
