
const resources_arr = [10, 10];

function Player(id, resources_arr, num) {
  this.id = id;
  this.num = num;
  this.nexus = {};
  this.bank = {
    iron: resources_arr[0],
    stone: resources_arr[1]
  };
}

module.exports = Player;
