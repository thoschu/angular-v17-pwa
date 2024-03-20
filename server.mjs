import express from 'express';
import { createServer } from 'http';
import { identity, inc, map, repeat, times } from 'ramda';
import { Server } from 'socket.io';

const port = 3003;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST']
  }
});

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

httpServer.listen(port, () => {
    console.log(`Server is running on port http://localhost:${port}/delay?duration=0&status=200`);
});
