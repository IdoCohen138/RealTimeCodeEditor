
const { Server } = require('socket.io');
require('dotenv').config();
const dbUtil = require("./db/db");


const io = new Server(process.env.PORT, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

const mentorSocket = new Map();
const studentSocket = new Map();

const dbPool = dbUtil.promisePool;

console.log(`Server is listening on Port: ${process.env.PORT}`);

io.on('connection', (socket) => {

  console.log('Client connected:', socket.id);

  socket.on('joinCodeBlock', (index) => {

    console.log(`A user ${socket.id} choose code mission: ${index}`);

    if (mentorSocket.has(index)){
        socket.emit("isMentor", false);
    
        console.log(`A user ${socket.id} is Student in ${index} room`);

      if (studentSocket.has(index)) {
        const students = studentSocket.get(index);
        students.push(socket);
        studentSocket.set(index, students);
      } else {
        studentSocket.set(index, [socket]);
      }
      printMap();
    }
    else {
        socket.emit("isMentor", true);

        console.log(`A user ${socket.id} is Mentor in ${index} room`);

        mentorSocket.set(index, socket);
        printMap();
    }
  });

  socket.on("changeCode", async (code, index) => {
    try {
      const [rows] = await dbPool.query('SELECT code FROM solution WHERE title = ?', [index]);
      const dataCode = rows[0].code;
      const codeClean = cleanCode(code);
      const cleanDataCode = cleanCode(dataCode);
      const isCodeEqual = codeClean === cleanDataCode;
      let mentorSocketRoom = mentorSocket.get(index);
      let studentSocketRoom = studentSocket.get(index)[0];
      if (mentorSocketRoom) {
        mentorSocketRoom.emit("presentCodeToMentor", code);
      }
      if (studentSocketRoom && isCodeEqual){
        studentSocketRoom.emit('solved', isCodeEqual)
      }
    } catch (error) {
      console.error('Error checking from the database:', error);
    }
  });
  
  socket.on("mentorLeaveRoom", (index) => {
    console.log(`Mentor leaving room ${index}`);

    mentorSocket.delete(index);
  
    studentSocket.forEach((value, key) => {
      value.forEach((sock) => {
        if (key === index) 
          sock.emit("mentorLeave");
      });
    });
    studentSocket.delete(index);
    printMap();
  });

  socket.on("studentLeaveRoom", (index) => {
    console.log(`student leaving room ${index}`);

    studentSocket.forEach((value, key) => {
      let newSockets = [];
      if (index===key){
        value.forEach((sock) => {
          if (sock.id === socket.id) 
            console.log(`Removing student entry for socket.id ${socket.id} from room ${key}`);
          else
            newSockets.push(sock);
        });
        if (newSockets.length===0)
          studentSocket.delete(key);
        else
          studentSocket.set(key, newSockets);
      }});
    
    printMap();
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
    mentorSocket.forEach((value, key) => {
      if (value.id === socket.id) {
        console.log(`Removing mentor entry for socket.id ${socket.id}`);
        mentorSocket.delete(key);
      }
    });
    studentSocket.forEach((value, key) => {
      let newSockets = [];
      value.forEach((sock) => {
        if (sock.id === socket.id) 
          console.log(`Removing student entry for socket.id ${socket.id} from room ${key}`);
        else
          newSockets.push(sock);
      });
      if (newSockets.length===0)
        studentSocket.delete(key);
      else
        studentSocket.set(key, newSockets);
    });
  });

  function cleanCode(inputString) {
    let cleanedString = inputString.replace(/\/\/ Your code here/g, '');
    cleanedString = cleanedString.replace(/\/\*[\s\S]*?\*\//g, '');
    cleanedString = cleanedString.replace(/[\s\n;]/g, '');
    cleanedString = cleanedString.replace(/[\s\n]/g, '');
    return cleanedString;
  }
  function printMap(){
    console.log("-------------MAP STATUS-----------");
    console.log("Mentor Map:");
    mentorSocket.forEach((socketId, roomNumber) => {
        console.log(`Room Number: ${roomNumber}, Socket ID: ${socketId.id}`);
    });

    console.log("\nStudent Map:");
    studentSocket.forEach((socketList, roomNumber) => {
        console.log(`Room Number: ${roomNumber}`);
        socketList.forEach(socketId => {
            console.log(`   Socket ID: ${socketId.id}`);
        });
    });
    console.log("--------------------------------");
  }
});
