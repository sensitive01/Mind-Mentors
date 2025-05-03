const axios = require('axios');

axios.post('https://mind-mentors-1.onrender.com/api/new-class/create-new-class', {
  className: "Database Discussion",
  coachName: "Aswinraj"
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
