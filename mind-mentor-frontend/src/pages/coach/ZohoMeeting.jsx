import React, { useState } from "react";
import MeetingScheduler from "../../coach/components/Meeting";
import MeetingRoom from "../../coach/components/MeetingRoom";

const App = () => {
  const [joinUrl, setJoinUrl] = useState("");

  return (
    <div>
      <MeetingScheduler setJoinUrl={setJoinUrl} />
      {joinUrl && <MeetingRoom joinUrl={joinUrl} />}
    </div>
  );
};

export default App;
