import io from 'socket.io-client';
import dataStore from './data-store';

const url = `http://192.168.0.108:3001`;

const socket = io(url);

socket.on(`found-near`, (d) => dataStore.foundNear(d));
socket.on(`chat-request`, (d) => dataStore.chatRequest(d));
socket.on(`request-accepted`, (d) => dataStore.accepted(d));
socket.on(`request-denied`, (d) => dataStore.denied(d));
socket.on(`chat-message`, (d) => dataStore.chatMessage(d));

export function login({ displayName, position, gender, message }) {
    return new Promise((resolve) => {
        socket.emit(`login`, { displayName, position, gender, message });
        socket.once(`logged-in`, resolve);
    });
}

export function findNear({ position }) {
    socket.emit(`find-near`, position);
}

export function askUser(id) {
    socket.emit(`ask-user`, id);
}

export function decline(id) {
    socket.emit(`request-denied`, id);
}

export function accept(id) {
    socket.emit(`request-accepted`, id);
}

export function sendChatMessage({ userId, message }) {
    socket.emit(`send-chat-message`, { userId, message });
}

window.addEventListener(`unload`, () => {
    socket.emit(`delete`);
});