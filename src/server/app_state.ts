import socketIo from 'socket.io';
import sharedSession from 'express-socket.io-session';
import { Option, some, none } from 'fp-ts/lib/Option';
import Instance from './instance';

export default class AppState {
  private instances: Map<string, Instance>;

  constructor(
    private socketServer: socketIo.Server,
    private socketSession: sharedSession.SocketIoSharedSessionMiddleware,
  ) {
    this.instances = new Map();
  }

  ensureInstanceExists(name: string): void {
    if (!this.instances.has(name)) {
      const socketNamespace = this.socketServer.of(name).use(this.socketSession);
      const instance = new Instance(socketNamespace);
      this.instances.set(name, instance);
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
