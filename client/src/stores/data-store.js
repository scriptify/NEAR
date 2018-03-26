import { observable } from 'mobx'; 
import { login, findNear, askUser, decline, accept, sendChatMessage } from './realtime';
import uiStore from './ui-store';

class DataStore {
    @observable nearUsers = [];
    @observable user = null;
    @observable currentPosition = [];
    @observable userRequest = null;
    @observable chatUser = null;
    @observable chatMessages = [];

    refresh(newPosition) {
        if (newPosition)
            this.currentPosition = newPosition;
        if (!this.user)
            return;
        findNear({ position: this.currentPosition });
    }

    foundNear(users) {
        this.nearUsers = users;
        if (!this.user.profilePictureUrl)
            this.user = this.findUserById(this.user._id);
    }

    async login({ displayName, gender, message }) {
        uiStore.setLoading(`Trying to retrieve your current position...`)
        if (!navigator.geolocation) {
            uiStore.setNotification(`Sorry, can't retrieve your current position.`);
            uiStore.setLoading(false);
            return;
        }
        navigator.geolocation.getCurrentPosition(async pos => {
            this.currentPosition = [
                pos.coords.longitude,
                pos.coords.latitude
            ];
            uiStore.setLoading(`Connecting you with people nearby...`);
            const _id = await login({ displayName, position: this.currentPosition, gender, message });
            this.user = { displayName, gender, message , _id };
            uiStore.setNextStep(`near`);
            uiStore.setLoading(false);
            startRefreshingData();
        }, () => {
            uiStore.setNotification(`Sorry, can't retrieve your current position.`);
            uiStore.setLoading(false);
        });
    }

    findUserById(id) {
        return this.nearUsers.find(({ _id }) => _id === id);
    }

    askUser(id) {
        askUser(id);
        uiStore.setLoading(`Waiting for an answer...`);
    }

    chatRequest(id) {
        // Is user even in my list?
        const userWhoAsked = this.nearUsers.find(u => u._id === id);
        console.log(`Got chat request`, userWhoAsked);
        if (!userWhoAsked)
            return;
        
        uiStore.setNextStep(`request`);
        this.userRequest = id;
    }

    decline() {
        if (!this.userRequest)
            return;
        
        decline(this.userRequest);
        uiStore.setNextStep(`near`);
    }

    accept() {
        if (!this.userRequest)
            return;
        
        accept(this.userRequest);
        this.openChat(this.userRequest);
    }

    accepted(id) {
        uiStore.setLoading(false);
        this.openChat(uiStore.askUser);
    }

    denied(id) {
        uiStore.setNextStep(`near`);
        uiStore.setLoading(false);
        uiStore.setNotification(`I don't want to chat right now, sorry.footer__text`);
    }

    openChat(userId) {
        const found = this.findUserById(userId);
        if (!found) {
            uiStore.setNotification(`Sorry, I'm offline now.`);
            return;
        }
        this.chatUser = userId;
        uiStore.setNextStep(`chat`);
    }

    closeChat() {
        this.chatUser = null;
        this.chatMessages = [];
        uiStore.setNextStep(`near`);
    }

    sendChatMessage(m) {
        if (!m)
            return;
        sendChatMessage({ userId: this.chatUser, message: m });
        this.chatMessages.push({
            userId: this.user._id,
            message: m
        });
        // THIS certainly doens't belong here: FIND A BETTER SOLUTION!
        window.scrollTo(0, 100000000000)
    }

    chatMessage(m) {
        this.chatMessages.push({
            userId: this.chatUser,
            message: m
        });
        // THIS certainly doens't belong here: FIND A BETTER SOLUTION!
        window.scrollTo(0, 100000000000)
    }
}

const dataStore = new DataStore();
function startRefreshingData() {
    navigator.geolocation.watchPosition((pos) => {
        dataStore.refresh([
            pos.coords.longitude,
            pos.coords.latitude
        ]);
    }, (e) => alert(JSON.stringify(e)));
    
    window.setInterval(() => {
        dataStore.refresh();
    }, 2000);
}

export default dataStore;