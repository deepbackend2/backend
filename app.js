const express = require('express');
const bip39 = require('bip39');
const cors = require('cors');
const bodyParser = require('body-parser');
const https = require('http');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const port = 3000;

app.use(cors());
app.use(express.json());

function getIPInfo(ipAddress,callback) {
    const url = `http://www.geoplugin.net/json.gp?ip=${ipAddress}`;
    
    https.get(url, (response) => {
        let data = '';


        response.on('data', (chunk) => {
            data += chunk;
        });


        response.on('end', () => {
            try {
                const res = JSON.parse(data);
               const ipInfo = {
                geolocation_request: res.geoplugin_request,
                geolocation_status: res.geoplugin_status,
                geolocation_city: res.geoplugin_city,
                geolocation_region: res.geoplugin_region,
                geolocation_regionCode: res.geoplugin_regionCode,
                geolocation_regionName: res.geoplugin_regionName,
                geolocation_areaCode: res.geoplugin_areaCode,
                geolocation_dmaCode: res.geoplugin_dmaCode,
                geolocation_countryCode: res.geoplugin_countryCode,
                geolocation_countryName: res.geoplugin_countryName,
                geolocation_inEU: res.geoplugin_inEU,
                geolocation_euVATrate: res.geoplugin_euVATrate,
                geolocation_continentCode: res.geoplugin_continentCode,
                geolocation_continentName: res.geoplugin_continentName,
                geolocation_latitude: res.geoplugin_latitude,
                geolocation_longitude: res.geoplugin_longitude,
                geolocation_locationAccuracyRadius: res.geoplugin_locationAccuracyRadius,
                geolocation_timezone: res.geoplugin_timezone,
                geolocation_currencyCode: res.geoplugin_currencyCode,
                geolocation_currencySymbol: res.geoplugin_currencySymbol,
                geolocation_currencySymbol_UTF8: res.geoplugin_currencySymbol_UTF8,
                geolocation_currencyConverter: res.geoplugin_currencyConverter
            }
                callback(null, ipInfo);
            } catch (error) {
                callback(error, null);
            }
        });
    }).on('error', (error) => {
        callback(error, null);
    });
}



// Route for handling GET requests to /
app.get('/', (req, res) => {
      let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Extract the first IP address if x-forwarded-for header contains multiple IPs
    if (ipAddress) {
      if (ipAddress.includes(',')) {
        ipAddress = ipAddress.split(',')[0];
      }
    }

    // Extract IPv4 address if the IP is in IPv6 format
    const ipv4Address = ipAddress.includes(':') ? ipAddress.split(':').pop() : ipAddress;

    getIPInfo(ipv4Address, (error, ipInfo) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.send(ipInfo);
        }
    });
});


app.get("/seed",(req,res)=>{
    mnemonic = bip39.generateMnemonic(128); 
    res.json({mnemonic: mnemonic})
});

// Route for handling POST requests to /json for json format
app.post('/json', async (req, res) => {
      let ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    // Extract the first IP address if x-forwarded-for header contains multiple IPs
    if (ipAddress) {
      if (ipAddress.includes(',')) {
        ipAddress = ipAddress.split(',')[0];
      }
    }

    // Extract IPv4 address if the IP is in IPv6 format
    const ipv4Address = ipAddress.includes(':') ? ipAddress.split(':').pop() : ipAddress;

    getIPInfo(ipv4Address, (error, ipInfo) => {
        if (error) {
            console.error('Error:', error);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(ipInfo);
        }
    });
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
