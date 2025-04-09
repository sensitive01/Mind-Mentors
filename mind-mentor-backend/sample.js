const axios = require('axios');

axios.post('https://live.mindmentorz.in/api/class/create-class', {
  className: "NeilsMindMentorz",
  coachName: "Neils"
}, {
  headers: {
    'Content-Type': 'application/json'
  }
})
.then(response => {
  console.log('Response:', response.data);
})
.catch(error => {
  console.error('Error:', error.response?.data || error.message);
});
