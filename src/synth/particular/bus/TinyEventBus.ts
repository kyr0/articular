export type Subscriber<T> = (payload: T) => void;

export interface Subscribers<T> {
    [eventName: string]: Array<Subscriber<T>>;
}

export interface ITinyEventBus<T> {
    subscribers: Subscribers<T>;
    subscribe: (eventName: string, cb: Subscriber<T>) => void;
    publish: (eventName: string, payload: T) => void;
}

export class TinyEventBus<T> implements ITinyEventBus<T> {
    subscribers: Subscribers<T> = {};

    subscribe(eventName: string, cb: Subscriber<T>) {
        if (!this.subscribers[eventName]) {
            this.subscribers[eventName] = [];
        }
        this.subscribers[eventName].push(cb);
    }

    publish(eventName: string, payload: T) {
        if (this.subscribers[eventName] && this.subscribers[eventName].length) {
            for (let i = 0; i < this.subscribers[eventName].length; i++) {
                this.subscribers[eventName][i](payload);
            }
        }
    }
}
