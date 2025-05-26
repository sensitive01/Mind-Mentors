const axios = require('axios');
const fs = require('fs');

const internalMeetingID = 'b6e6c4417c9bbd3e4ec8de0961619be36750decf-1748247284015';

axios.get(`https://class.mindmentorz.in/bigbluebutton/api/learning-analytics?meeting=${internalMeetingID}`)
  .then(response => {
    const data = response.data;
    fs.writeFileSync(`analytics-${internalMeetingID}.json`, JSON.stringify(data, null, 2));
    console.log('Analytics data saved successfully!');
  })
  .catch(error => {
    console.error('Error fetching analytics data:', error.message);
  });
