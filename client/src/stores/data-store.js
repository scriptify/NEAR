import { observable } from 'mobx'; 
import { login, findNear } from './realtime';

class DataStore {
    @observable nearUsers = [];
    @observable user = null;
    @observable currentPosition = [];

    refresh(newPosition) {
        if (newPosition)
            this.currentPosition = newPosition;
        if (!this.user)
            return;
        findNear({ position: this.currentPosition });
    }

    foundNear(users) {
        this.nearUsers = users;
        console.log(users);
    }

    async login({ displayName, gender, message }) {
        const _id = await login({ displayName, position: this.currentPosition, gender, message });
        this.user = { displayName, gender, message , _id};
    }
}

const dataStore = new DataStore();

navigator.geolocation.watchPosition((pos) => {
    dataStore.refresh([
        pos.coords.longitude,
        pos.coords.latitude
    ]);
});

window.setInterval(() => {
    dataStore.refresh();
}, 2000);

export default dataStore;