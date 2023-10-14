const express = require('express');

const router = express.Router();
router.get('/about', (req, res) => {
	
	const data = { key: 'value', number: 42 };

//   // Set the Content-Type header to indicate that you are sending JSON
//   res.setHeader('Content-Type', 'application/json');
// console.log("hdiD")
// console.log(JSON.stringify(data))
//   // Use res.send() to send the JSON data
//   res.send(JSON.stringify(data));
res.json(data)
    });

    module.exports = router;