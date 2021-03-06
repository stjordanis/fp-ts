---
title: State.ts
nav_order: 82
parent: Modules
---

# State overview

Added in v2.0.0

---

<h2 class="text-delta">Table of contents</h2>

- [State (interface)](#state-interface)
- [URI (type alias)](#uri-type-alias)
- [URI](#uri)
- [ap](#ap)
- [apFirst](#apfirst)
- [apSecond](#apsecond)
- [chain](#chain)
- [chainFirst](#chainfirst)
- [evalState](#evalstate)
- [execState](#execstate)
- [flatten](#flatten)
- [get](#get)
- [gets](#gets)
- [map](#map)
- [modify](#modify)
- [of](#of)
- [put](#put)
- [state](#state)

---

# State (interface)

**Signature**

```ts
export interface State<S, A> {
  (s: S): [A, S]
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
export declare const URI: 'State'
```

Added in v2.0.0

# ap

**Signature**

```ts
export declare const ap: <E, A>(fa: State<E, A>) => <B>(fab: State<E, (a: A) => B>) => State<E, B>
```

Added in v2.0.0

# apFirst

**Signature**

```ts
export declare const apFirst: <E, B>(fb: State<E, B>) => <A>(fa: State<E, A>) => State<E, A>
```

Added in v2.0.0

# apSecond

**Signature**

```ts
export declare const apSecond: <E, B>(fb: State<E, B>) => <A>(fa: State<E, A>) => State<E, B>
```

Added in v2.0.0

# chain

**Signature**

```ts
export declare const chain: <E, A, B>(f: (a: A) => State<E, B>) => (ma: State<E, A>) => State<E, B>
```

Added in v2.0.0

# chainFirst

**Signature**

```ts
export declare const chainFirst: <E, A, B>(f: (a: A) => State<E, B>) => (ma: State<E, A>) => State<E, A>
```

Added in v2.0.0

# evalState

Run a computation in the `State` monad, discarding the final state

**Signature**

```ts
export declare const evalState: <S, A>(ma: State<S, A>, s: S) => A
```

Added in v2.0.0

# execState

Run a computation in the `State` monad discarding the result

**Signature**

```ts
export declare const execState: <S, A>(ma: State<S, A>, s: S) => S
```

Added in v2.0.0

# flatten

**Signature**

```ts
export declare const flatten: <E, A>(mma: State<E, State<E, A>>) => State<E, A>
```

Added in v2.0.0

# get

Get the current state

**Signature**

```ts
export declare const get: <S>() => State<S, S>
```

Added in v2.0.0

# gets

Get a value which depends on the current state

**Signature**

```ts
export declare const gets: <S, A>(f: (s: S) => A) => State<S, A>
```

Added in v2.0.0

# map

**Signature**

```ts
export declare const map: <A, B>(f: (a: A) => B) => <E>(fa: State<E, A>) => State<E, B>
```

Added in v2.0.0

# modify

Modify the state by applying a function to the current state

**Signature**

```ts
export declare const modify: <S>(f: (s: S) => S) => State<S, void>
```

Added in v2.0.0

# of

**Signature**

```ts
export declare const of: <S, A>(a: A) => State<S, A>
```

Added in v2.0.0

# put

Set the state

**Signature**

```ts
export declare const put: <S>(s: S) => State<S, void>
```

Added in v2.0.0

# state

**Signature**

```ts
export declare const state: Monad2<'State'>
```

Added in v2.0.0
