---
title: IO.ts
nav_order: 43
parent: Modules
---

# IO overview

`IO<A>` represents a non-deterministic synchronous computation that can cause side effects, yields a value of
type `A` and **never fails**. If you want to represent a synchronous computation that may fail, please see
`IOEither`.

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [IO (interface)](#io-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [flatten](#flatten)
- [getMonoid](#getmonoid)
- [getSemigroup](#getsemigroup)
- [io](#io)
- [map](#map)
- [of](#of)

---

# IO (interface)

**Signature**

```ts
export interface IO<A> {
  (): A
}
```

Added in v2.0.0

# URI (type alias)

**Signature**

```ts
export type URI = typeof URI
```

Added in v2.0.0

# URI

**Signature**

```ts
export declare const URI: 'IO'
```

Added in v2.0.0

# ap

**Signature**

```ts
export declare const ap: <A>(fa: IO<A>) => <B>(fab: IO<(a: A) => B>) => IO<B>
```

Added in v2.0.0

# apFirst

**Signature**

```ts
export declare const apFirst: <B>(fb: IO<B>) => <A>(fa: IO<A>) => IO<A>
```

Added in v2.0.0

# apSecond

**Signature**

```ts
export declare const apSecond: <B>(fb: IO<B>) => <A>(fa: IO<A>) => IO<B>
```

Added in v2.0.0

# chain

**Signature**

```ts
export declare const chain: <A, B>(f: (a: A) => IO<B>) => (ma: IO<A>) => IO<B>
```

Added in v2.0.0

# chainFirst

**Signature**

```ts
export declare const chainFirst: <A, B>(f: (a: A) => IO<B>) => (ma: IO<A>) => IO<A>
```

Added in v2.0.0

# flatten

**Signature**

```ts
export declare const flatten: <A>(mma: IO<IO<A>>) => IO<A>
```

Added in v2.0.0

# getMonoid

**Signature**

```ts
export declare function getMonoid<A>(M: Monoid<A>): Monoid<IO<A>>
```

Added in v2.0.0

# getSemigroup

**Signature**

```ts
export declare function getSemigroup<A>(S: Semigroup<A>): Semigroup<IO<A>>
```

Added in v2.0.0

# io

**Signature**

```ts
export declare const io: Monad1<'IO'> & MonadIO1<'IO'> & ChainRec1<'IO'>
```

Added in v2.0.0

# map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => (fa: IO<A>) => IO<B>
```

Added in v2.0.0

# of

**Signature**

```ts
export declare const of: <A>(a: A) => IO<A>
```

Added in v2.0.0
