const axios = require('axios');

// axios.post('https://live.mindmentorz.in/api/new-class/create-new-class', {
axios.post('http://localhost:3000/api/new-class/create-new-class', {

  className: "Demo Display",
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
  console.error('Error:', error);
});
