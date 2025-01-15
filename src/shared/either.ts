export type Left<T> = {
  left: T;
  right?: never;
};

export type Right<T> = {
  left?: never;
  right: T;
};

export type Either<T, U> = NonNullable<Left<T> | Right<U>>;

export const isLeft = <T, U>(either: Either<T, U>): either is Left<T> => {
  return either.left !== undefined;
};

export const isRight = <T, U>(either: Either<T, U>): either is Right<U> => {
  return either.right !== undefined;
};

export type UnwrapEither = <T, U>(either: Either<T, U>) => NonNullable<T | U>;

export const unwrapEither: UnwrapEither = <T, U>({
  left,
  right,
}: Either<T, U>) => {
  if (right !== undefined && left !== undefined) {
    throw new Error(
      `Received both left and right values at runtime when opening an Either\nLeft: ${JSON.stringify(left)}\nRight: ${JSON.stringify(right)}`
    );
  }

  if (left !== undefined) {
    return left as NonNullable<T>;
  }

  if (right !== undefined) {
    return right as NonNullable<U>;
  }

  throw new Error(
    'Received no left or right values at runtime when opening an Either'
  );
};

export const makeLeft = <T>(value: T): Left<T> => ({ left: value });

export const makeRight = <U>(value: U): Right<U> => ({ right: value });
