import express from 'express';
import { createServer } from 'http';
import { identity, inc, map, repeat, times } from 'ramda';
import { Server } from 'socket.io';
import webpush from 'web-push';
import 'dotenv/config';

const port = 3003;
const app = express();

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

// const vapidKeys = webpush.generateVAPIDKeys();
const vapidKeys = {
  publicKey: 'BO1GTa3kXP8unlB0ssLgS6N75qOlhOLoplx-C5aGMOCcQW96CuQT6gZ4n0wOe1a8LWLDJP2uVqGM3OtRvmg2xok',
  privateKey: 'mlhAtg3N9jQyprN6U-a3QXdlIZjeOxdYeH26sEuer3I'
};

// Firebase Cloud Messaging API key
webpush.setGCMAPIKey(process.env.FCM_API_KEY);

webpush.setVapidDetails(
  'mailto:thoschulte@gmail.com',
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

app.use(express.json());

io.on('connection', (socket) => {
  console.log(socket.id);
  socket.emit('data', 'hello world');
});

app.get('/', (req, res) => {
  const html = `
    <!DOCTYPE html>
    <html>
        <head>
            <title>Examples</title>
            <link rel="icon" type="image/x-icon" href="//www.thomas-schulte.de/html/images/favicon.ico">
            <script src="/socket.io/socket.io.js"></script>
            <script>
              const socket = io();

              socket.on('connect', () => {
                console.log(socket.id);
              });

              socket.on('data', payload => {
                console.info(payload);
              });
            </script>
        </head>
        <body>
          <h1>Examples:</h1>
          <p>
            <a href="http://localhost:3003/delay?duration=0&status=200" target="_blank">
                http://localhost:3003/delay?duration=0&status=200
            </a>
          </p>
          <p>
            <a href="http://localhost:3003/lorem-ipsum" target="_blank">
                http://localhost:3003/lorem-ipsum
            </a>
          </p>
        </body>
    </html>`;

  res.status(200).send(html);
});

app.get('/times', (req, res) => {
  const amount = req.query.amount ?? 0;
  let payload = repeat('.', amount);
  payload = payload.map((ele, idx) => ele.repeat(inc(idx)));

  const myTimeout = setTimeout(() => {
    res.status(200).jsonp({ payload });

    clearTimeout(myTimeout);
  }, 1000);
});

app.get('/lorem-ipsum', (req, res) => {
    const text = 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam zerat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit zamet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.';
    const list = text.split(' ');

    res.status(200).jsonp({ payload: list });
});

app.get('/delay', async (req, res) => {
    const duration = req.query.duration ?? 0;
    const status = req.query.status ?? 200;
    const error = (Math.random() >= 0.5);

    const myTimeout = setTimeout(() => {
        if(error) {
            console.error('Internal Server Error');
            res.status(500).json({ message: 'Internal Server Error' });
        } else {
            console.info('Server Request successful');
            res.status(status).json({ payload: { email: 'kontakt@thomas-schulte.de' } });
        }

        clearTimeout(myTimeout);
    }, duration);
});

let list = [];
app.post('/push-subscription', (req, res) => {
  const body = req.body;

  list.push(body);

  res.status(201).send({
    message: 'PushSubscription was added to the list successfully.'
  });
});

app.post('/do-notification', (req, res) => {
  const body = req.body;

  const notificationPayload = {
    "notification": {
      "title": "Angular News",
      "body": body.message,
      "icon": "https://www.thomas-schulte.de/html/images/favicon.ico",
      "vibrate": [100, 50, 100],
      "data": {
        "dateOfArrival": Date.now(),
        "primaryKey": 1
      },
      "actions": [{
        "action": "explore",
        "title": "Go to the site"
      }]
    }
  };

  Promise.all(list.map(sub => webpush.sendNotification(sub, JSON.stringify(notificationPayload) )))
    .then((result) => {
      console.log(result);

      return res.status(200).json({message: 'Notification sent successfully.'});
    })
    .catch(err => {
      console.error("Error sending notification, reason: ", err);
      res.sendStatus(500);
    });
});

httpServer.listen(port, () => {
  console.log(`Server is running on port http://0.0.0.0:${port}/delay?duration=0&status=200`);
  console.log(vapidKeys);
});
