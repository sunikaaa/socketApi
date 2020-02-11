const _ = require('lodash');
// const State = require('./state').state;

const alt = (func1,func2) =>{
    return function(val){
        return func1(val) || func2(val)
    }
}

class Socket {
    constructor(socket,io){
        this.io = io
        this.socket = socket
    }

    id(){
      return this.socket.id;
    }

  emitToUser(userID,fireName,data){
    this.io.to(userID).emit(fireName,data)

  }

  on(fireName,fn){
    if(typeof fn !== 'function') return;
    let val
   return this.socket.on(fireName,(...values)=>{
      val = fn(...values)
    });
  }

  emit(fireName,data){
    this.io.emit(fireName,data);
  }

  disConnect(fn){
    if(typeof fn !== 'function') return;
  return  this.socket.on('disconnect',fn);
  }


  joinRoom(roomId,fireName,objct){
  this.socket.join(roomId,()=>{
    let obj = this.createUserObj(roomId);
    obj.val = "joinRoom",
    console.log(roomId,fireName,objct,"aaaa");
    this.emitToUser(roomId,fireName,objct)
  });
  return new GameStart(this.socket,this.io,roomId)
  }

  createUserObj(roomId,name="名無し"){
    return {
      name:name,
      roomId: roomId,
      uid:this.socket.id
    }
  }

}


const ramda = ()=> true ;
const isFn = (fn) => alt(fn,ramda);

class GameStart  {
    constructor(socket,io,room){
        this.io = io;
        this.socket = socket;
        this.room = room || '';
    }


    emitRoom(fireName,data,roomId){
        this.io.to(roomId).emit(fireName,data);
    }
    emitbcRoom(fireName,data,roomId){
      this.socket.to(roomId).broadcast.emit(fireName,data);
    }

    onToEmit(fireName1,fireName2,fn){
      this.io.on(fireName1,(val)=>{
        this.emitRoom(val.roomId,fireName2,fn(val))
      })
    }
}

const fork = function(join,func1,func2){
  return function(val){
    return join(func1(val),func2(val));
  }
}


const createPare = () =>{
    function waiting (SOCKET,State){
     SOCKET.joinRoom(State.doCrateAndWait(SOCKET.id()),'opponent-waiting',"waitNow");
    }

    function startGame(SOCKET,State){
      const roomId = State.doPlayAndInRoom(SOCKET.id());
      const sendObj = State.getRoomObj(roomId)[0];
      sendObj.val = 'are you redy?'
      console.log(sendObj,"send");
      SOCKET.joinRoom(roomId,"opponent-find",sendObj);
    }

    function roomIn(SOCKET,roomVal,State) {
      State.createRoom(SOCKET.id(),roomVal.name,roomVal.roomId);
      SOCKET.joinRoom(roomVal.roomId,'opponent-waiting','waitNow')
      console.log('create');
    }

    function enterToRoom(SOCKET,roomVal,State){
      console.log("state",State.getRoomObj(roomVal.roomId)[0]);
      State.addMenberToRoom(roomVal.roomId,SOCKET.id(),roomVal.name);

      SOCKET.joinRoom(roomVal.roomId,'opponent-find',State.getRoomObj(roomVal.roomId)[0]);
    }

    function enterRoom(SOCKET,roomVal,State) {
      State.isFullRoom(roomVal.roomId) ? SOCKET.emitToUser(SOCKET.id(),'room-isFull') : enterToRoom(SOCKET,roomVal,State);
    }

    return (SOCKET,State) =>{
      return {
        waitPare() {
              State.isWatingPlayer() ? waiting(SOCKET,State) : startGame(SOCKET,State);
              console.log("start")
        },
        disConnect(){
               roomData = State.disConnect(SOCKET.id())
                roomData ? new GameStart(SOCKET.socket,SOCKET.io).emitRoom('opponent-disconnect','disconnect',roomData[0].roomId) :'';
                console.log('disConnect!!');
        },
        createRoom(roomVal){
          State.isExistRoom(roomVal.roomId) ? SOCKET.emitToUser(SOCKET.id(),'room-isExist',State) : roomIn(SOCKET,roomVal,State);
        },
        enterRoom(roomVal){
          console.log(State)
          State.isExistRoom(roomVal.roomId) ? enterRoom(SOCKET,roomVal,State) : SOCKET.emitToUser(SOCKET.id(),'room-isnotExist')
        },


      }

    }

}
// exports.createPare = createPare\

module.exports = {
  createPare: createPare,
  Socket: Socket,
  Game: GameStart
}
