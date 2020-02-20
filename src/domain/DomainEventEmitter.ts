export interface DomainEventEmitter {

  emit(eventName: string)
  on(eventName: string, fn: (arg: any) => void): void;

}
