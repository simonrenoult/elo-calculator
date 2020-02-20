export interface DomainEventEmitter {

  emit(eventName: string, obj: any | undefined);
  on(eventName: string, fn: (arg: any) => void): void;

}
