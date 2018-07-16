
function Player(id, resources_arr) {
  this.id = id;
  this.nexus = {};
  this.bank = {
    iron: resources_arr[0],
    stone: resources_arr[1]
  };
}

module.exports = Player;
