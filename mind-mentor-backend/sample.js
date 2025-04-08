const axios = require('axios');

axios.post('http://3.104.84.126:3000/api/class/create-class', {
  className: "ChessClass",
  coachName: "Jayrams"
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
