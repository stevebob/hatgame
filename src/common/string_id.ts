import * as t from 'io-ts';

export abstract class StringId {
  constructor(private readonly raw: string) {}

  toString(): string {
    return this.raw;
  }
}

export interface StringIdConstructor<A> {
  new(raw: string): A;
  name: string;
}

export function toString(stringId: StringId): string {
  return stringId.toString();
}

export function mkStringIdType<A extends StringId>(C: StringIdConstructor<A>):
  t.Type<A, string, unknown> {
  return new t.Type<A, string, unknown>(
    C.name,
    (input: unknown): input is A => {
      if (input instanceof C) {
        console.log('yes', input, C);
      } else {
        console.log('no', input, C);
      }
      return input instanceof C;
    },
    (input, context) => {
      if (typeof input === 'string') {
        return t.success(new C(input));
      }
      return t.failure(input, context);
    },
    (x) => x.toString()
  );
}
