import socketIo from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { Option, some, none } from 'fp-ts/lib/Option';
import Instance from './instance';

function randomName(): string {
  return Math.random().toString(36).substring(2).substring(0, 6);
}

export default class AppState {
  private instances: Map<string, Instance>;

  constructor(
    private socketServer: socketIo.Server,
    private socketSession: sharedSession.SocketIoSharedSessionMiddleware,
  ) {
    this.instances = new Map();
  }

  ensureInstanceExists(name: string): Instance {
    const instance = this.instances.get(name);
    if (instance === undefined) {
      const socketNamespace = this.socketServer.of(name).use(this.socketSession);
      const newInstance = new Instance(socketNamespace);
      this.instances.set(name, newInstance);
      return newInstance;
    }
    return instance;
  }

  makeInstanceRandomName(): Instance {
    for (;;) {
      const name = randomName();
      if (!this.instances.has(name)) {
        return this.ensureInstanceExists(name);
      }
    }
  }

  getInstance(name: string): Option<Instance> {
    const instance = this.instances.get(name);
    if (instance === undefined) {
      return none;
    }
    return some(instance);
  }
}
