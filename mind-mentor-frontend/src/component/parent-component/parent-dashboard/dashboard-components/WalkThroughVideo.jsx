

const WalkthroughVideo = () => {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <h1 className="text-xl font-semibold mb-4">Video Walkthrough</h1>
      <div className="w-full max-w-4xl">
        <iframe
          width="100%"
          height="400"
          src="https://www.youtube.com/embed/zhkDRVRu6Rc" // Your video URL here
          title="Walkthrough Video"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
};

export default WalkthroughVideo;
