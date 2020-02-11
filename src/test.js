const ArrObj = [
  {
    roomA: {
      roomId: 'roomA',
      menber: [...Array(100)].fill('menberAs')
    },
    roomB: {
      roomId: 'roomb',
      menber: [...Array(100)].fill('menberBs')
    }
  }
];

class TestRoom {
  constructor(room, chain = false, oldclass, id = undefined) {
    this.room = room;
    this.chaining = chain;
    this.roomId = id;
    this.oldclass = oldclass;
  }

  chain() {
    return new TestRoom(this.room, true, this);
  }

  save() {
    if (this.chaining === false) {
      console.log("use 'save' with chain");
      return;
    }
    this.oldclass.room = this.room;
    this.oldclass.roomId = this.roomId;
    return new TestRoom(this.room, false, this.roomId);
  }

  createRoom(receive, socketId) {
    let roomId = obj.roomId ? obj.roomId : socketId;
    this.room[roomId] = {
      roomId: roomId,
      mid: socketId,
      menber: [
        {
          name: obj.name,
          id: socketId
        }
      ]
    };
    return this.ischain(this.room, roomId);
  }

  ischain(room, id) {
    return this.chain
      ? new TestRoom(room, this.chaining, this.oldclass, id)
      : room;
  }

  getRoom() {
    return this.room[this.roomId];
  }
}

let State = new TestRoom(ArrObj);
State.save();
// console.log(State.getRoom());
console.log(
  State.chain()
    .createRoom(
      {
        roomId: '31415gd',
        name: 'takasi'
      },
      'fa43aga'
    )
    .save()
);
console.log(State.room);
