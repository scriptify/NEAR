import { observable } from 'mobx'; 
import { login, findNear } from './realtime';

class DataStore {
    @observable nearUsers = [];
    @observable user = null;
    @observable currentPosition = [];

    refresh(newPosition) {
        this.currentPosition = newPosition;
        if (!this.user)
            return;
        findNear({ position: newPosition });
    }

    foundNear(users) {
        this.nearUsers = users;
        console.log(users);
    }

    async login({ displayName, gender }) {
        await login({ displayName, position: this.currentPosition, gender });
        this.user = { displayName };
    }
}

const dataStore = new DataStore();

navigator.geolocation.watchPosition((pos) => {
    dataStore.refresh([
        pos.coords.latitude,
        pos.coords.longitude
    ]);
});

export default dataStore;