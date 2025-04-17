const axios = require('axios');

axios.post('https://live.mindmentorz.in/api/new-class/create-new-class', {
  className: "Neils Test ",
  coachName: "Neil mind "
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
