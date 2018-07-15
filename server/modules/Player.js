
function Player(id, resources_arr) {

  this.id = id;
  this.nexus = {};
  this.bank = {
    iron: resources_arr[1],
    stone: resources_arr[2]
  };


}

module.exports = Player;
