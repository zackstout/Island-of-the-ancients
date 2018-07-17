
function Player(id, resources_arr, num) {
  this.id = id;
  this.num = num;
  this.nexus = {};
  this.bank = {
    iron: resources_arr[0],
    stone: resources_arr[1]
  };
  this.tempBank = {
    iron: 0,
    stone: 0,
  };
}

module.exports = Player;
