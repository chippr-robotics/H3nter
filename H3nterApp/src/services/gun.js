// src/services/gun.js
import Gun from 'gun/gun';
import 'gun/sea'; // For user authentication and encryption (if needed)

const gun = Gun({
 /*
    peers: [
    // You can list multiple peers or your own peer server
    'https://your-gun-relay-server.herokuapp.com/gun'
  ]*/
});

export default gun;


// src/services/gun.js (extended)
//import gun from './gun';

export async function storeUserProfile(h3Cell, did, profile) {
  // e.g. profile = { displayName: 'Alice', avatarUrl: '', ...}
  gun.get('cells').get(h3Cell).get(did).put(profile);
}

export async function getProfilesByCell(h3Cell, callback) {
  // subscription
  gun.get('cells').get(h3Cell).map().on((data, didKey) => {
    // data is the profile, didKey is the DID
    if (data) {
      callback(didKey, data);
    }
  });
}
