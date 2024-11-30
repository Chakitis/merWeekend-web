import '../Styles/VideoPlayer.css';

const VideoPlayer = () => {
  return (
    <div className="video-player-container">
      <div className="embed-responsive embed-responsive-16by9">
        <video className="embed-responsive-item" controls>
          <source src={`${process.env.PUBLIC_URL}/images/trailer.mp4`} type="video/mp4" />
          Váš prohlížeč nepodporuje video tag.
        </video>
      </div>
    </div>
  );
};

export default VideoPlayer;
