import Countdown from '../Components/Countdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import VideoPlayer from '../Components/VideoPlayer';


const Home = () => {

  return (
    <div className="home-container" >
      <div >
        <div className="overlay-text d-flex flex-column justify-content-center align-items-center text-center text-white position-absolute top-50 start-50 translate-middle p-4">
          <img src={`${process.env.PUBLIC_URL}/images/merweekend1.png`} alt="MerWeekend" className="merweekend mb-3" />
          <h2 className="text-warning mb-3">16. a 17. srpen 2025  Koupaliště Úvaly</h2>
          <VideoPlayer />
          <Countdown />
        </div>
      </div>
    </div>
  );
};

export default Home;
