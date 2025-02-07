// const crypto = require('crypto');

// // Zoom API Key and Secret
// const API_KEY = 'YOUR_ZOOM_API_KEY';
// const API_SECRET = 'YOUR_ZOOM_API_SECRET';

// // Function to generate the signature
// const generateZoomSignature = (meetingNumber) => {
//   const timestamp = new Date().getTime() - 30000;
//   const msg = Buffer.from(API_KEY + meetingNumber + timestamp + '1' + 'YOUR_ZOOM_API_SECRET').toString('base64');

//   const hash = crypto.createHmac('sha256', API_SECRET).update(msg).digest('base64');
//   const signature = Buffer.from(`${API_KEY}.${meetingNumber}.${timestamp}.${hash}`).toString('base64');

//   return signature;
// };

// app.post('/generate-signature', (req, res) => {
//   const { meetingNumber } = req.body;
//   const signature = generateZoomSignature(meetingNumber);
//   res.json({ signature });
// });
