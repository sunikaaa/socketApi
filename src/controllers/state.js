const _ = require('lodash');

const equal = (preval, objKey = undefined) => cuval => {
  if (objKey === undefined) {
    return preval === cuval;
  }
  return preval === cuval[objKey];
};

const lengthN = (length, objKey = undefined) => val => {
  if (objKey === undefined) {
    val.length === length;
  }
  return length === val[objKey].length;
};

// {
//     roomId:roomId,
//     mid:id,
//     menber:[{
//         name:name,
//         id:id
//     }]
// }

class State {
  constructor(room, chain, oldclass, roomId) {
    this.room = room;
    this.chaining = chain;
    this.roomId = roomId;
    this.oldclass = oldclass;
  }

  chain() {
    return new TestRoom(this.room, true, this);
  }

  save() {
    if (this.chaining === false) {
      console.log('use "save" with chain');
      return;
    }
    this.oldClass.room = this.room;
    this.oldClass.roomId = this.roomId;
    return new TestRoom(this.room, false, this.roomId);
  }

  isChain(room, id) {
    return this.chain
      ? new TestRoom(room, this.chaining, this.oldClass, id)
      : room;
  }
  // doCrateAndWait(id,name = '名無し'){
  //     return this.CreateWatingPlayer(id,name,this.createRoom(id,name));
  // }

  // doPlayAndInRoom(id,name = '名無し'){
  //     const waitingPlayer = this.shiftWaitingRoomObj()
  //     this.addMenberToRoom(waitingPlayer.roomId,id,name)
  //     return waitingPlayer.roomId
  // }

  isFullRoom(roomId) {
    return this.room.find(equal(roomId, 'roomId')).menber.length === 2;
  }

  isWatingPlayer() {
    const test = this.room.filter(randomRoom => randomRoom.random);
    console.log(test);
    return test;
  }
  //return roomId
  CreateWatingPlayer(id, name, roomId) {
    let obj = {
      name: name,
      id: id,
      roomId: roomId
    };
    this.watingPlayer.push(obj);
    return obj.roomId;
  }

  //return roomId
  createRoom(socketId, receive) {
    let roomId = receive.roomId ? receive.roomId : socketId + Date.now();
    // console.log(room, "room", id, roomId);
    let obj = {
      roomId: roomId,
      mid: socketId,
      random: receive.roomId ? false : true,
      menber: [
        {
          name: name,
          id: id
        }
      ]
    };
    this.room.push(obj);
    console.log('create!', obj.random);
    return roomId;
  }

  addMenberToRoom(roomid, socketId, name) {
    this.room.forEach(val => {
      if (roomid === val.roomId) {
        val.menber.push({
          name: name,
          id: socketId
        });
      }
    });
  }

  delPlayer(id) {
    let stateObj = {
      room: this.room,
      watingPlayer: this.watingPlayer
    };
    for (obj in stateObj) {
      let NewObj = stateObj[obj].filter(val => val.id !== id);
      this[obj] = NewObj[obj];
    }
  }

  createSendObj(socketId, roomId, name = '名無し') {
    let obj = {
      uid: socketId,
      roomId: roomId,
      name: name
    };
    return obj;
  }

  disConnect(id) {
    this.someId(id, 'watingPlayer')
      ? this.filterId(id, 'watingPlayer')
      : console.log('notfound wating');
    const disconnectRoom = this.someRoomId(id) ? this.filterRoom(id) : false;
    disconnectRoom ? this.deleteRoom(disconnectRoom[0].roomId) : false;
    this.consoleId();
    return disconnectRoom;
  }

  deleteRoom(id) {
    this.room = this.room.filter(val => {
      val.roomId !== id;
    });
  }

  filterRoom(id) {
    return this.room.filter(val => {
      return val.menber.some(menber => {
        return menber.id === id;
      });
    });
  }

  consoleId() {
    [this.room, this.watingPlayer].forEach(val =>
      console.log(val, 'consoleid')
    );
  }

  filterId(id, val) {
    this[val] = this[val].filter(value => value.id !== id);
  }

  getRoomObj(roomId) {
    return this.room.filter(val => {
      return val.roomId === roomId;
    });
  }

  someId(id, val) {
    return this[val].some(equal(id, 'id'));
  }

  someRoomId(id) {
    const bool = this.room.some(value => {
      console.log(value.menber, id, 'roomcheck');
      return value.menber.some(equal(id, 'id'));
    });
    return bool;
  }

  shiftWaitingRoomObj() {
    return this.watingPlayer.shift();
  }

  isExistRoom(roomId) {
    return this.room.some(equal(roomId, 'roomId'));
  }
}

let state = new State();

exports.state = state;
