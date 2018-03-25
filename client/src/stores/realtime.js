import io from 'socket.io-client';
import dataStore from './data-store';

const socket = io(`http://localhost:3001`);

socket.on(`found-near`, (d) => dataStore.foundNear(d));

export function login({ displayName, position, gender }) {
    return new Promise((resolve) => {
        socket.emit(`login`, { displayName, position, gender });
        socket.once(`logged-in`, resolve);
    });
}

export function findNear({ position }) {
    return new Promise((resolve) => {
        socket.emit(`find-near`, { position });
    });
}

window.addEventListener(`unload`, () => {
    socket.emit(`delete`);
});