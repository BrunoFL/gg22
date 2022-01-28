const port = process.env.PORT || 3000
import express from "express";
import {Server} from 'socket.io'
const app = express();

import path from 'path';
import {fileURLToPath} from 'url';

import { createServer } from "http";
import { GameServer } from "./server/entities/GameServer.mjs";
const httpServer = createServer(app);

const io = new Server(httpServer, {
	cors: {
		origin: "http://localhost:8080",
		methods: ["GET", "POST"]
	}
});
console.log('start')

/*
 *  Serve /dist/ folder
 */
const __filename = fileURLToPath(import.meta.url);

// 👇️ "/home/john/Desktop/javascript"
const __dirname = path.dirname(__filename);

app.use(express.static(__dirname + '/dist'))
app.get(/.*/, (req, res) => {
	res.sendFile(__dirname + '/dist/index.html')
})

httpServer.listen(port, () => {
	console.log(`Listening on port ${port}`)
})

/*
 *  Store connected clients etc.
 *  Do not use in production 🤪
 */

const server = new GameServer(io)
