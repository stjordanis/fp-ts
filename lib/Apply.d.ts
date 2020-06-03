/**
 * The `Apply` class provides the `ap` which is used to apply a function to an argument under a type constructor.
 *
 * `Apply` can be used to lift functions of two or more arguments to work on values wrapped with the type constructor
 * `f`.
 *
 * Instances must satisfy the following law in addition to the `Functor` laws:
 *
 * 1. Associative composition: `F.ap(F.ap(F.map(fbc, bc => ab => a => bc(ab(a))), fab), fa) = F.ap(fbc, F.ap(fab, fa))`
 *
 * Formally, `Apply` represents a strong lax semi-monoidal endofunctor.
 *
 * @since 2.0.0
 */
import { Functor, Functor1, Functor2, Functor2C, Functor3, Functor4, Functor3C } from './Functor'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'
/**
 * @since 3.0.0
 */
export interface Apply<F> extends Functor<F> {
  readonly ap: <A>(fa: HKT<F, A>) => <B>(fab: HKT<F, (a: A) => B>) => HKT<F, B>
}
/**
 * @since 3.0.0
 */
export interface Apply1<F extends URIS> extends Functor1<F> {
  readonly ap: <A>(fa: Kind<F, A>) => <B>(fab: Kind<F, (a: A) => B>) => Kind<F, B>
}
/**
 * @since 3.0.0
 */
export interface Apply2<F extends URIS2> extends Functor2<F> {
  readonly ap: <E, A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
}
/**
 * @since 3.0.0
 */
export interface Apply2C<F extends URIS2, E> extends Functor2C<F, E> {
  readonly ap: <A>(fa: Kind2<F, E, A>) => <B>(fab: Kind2<F, E, (a: A) => B>) => Kind2<F, E, B>
}
/**
 * @since 3.0.0
 */
export interface Apply3<F extends URIS3> extends Functor3<F> {
  readonly ap: <R, E, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
}
/**
 * @since 2.2.0
 */
export interface Apply3C<F extends URIS3, E> extends Functor3C<F, E> {
  readonly ap: <R, A>(fa: Kind3<F, R, E, A>) => <B>(fab: Kind3<F, R, E, (a: A) => B>) => Kind3<F, R, E, B>
}
/**
 * @since 3.0.0
 */
export interface Apply4<F extends URIS4> extends Functor4<F> {
  readonly ap: <S, R, E, A>(
    fa: Kind4<F, S, R, E, A>
  ) => <B>(fab: Kind4<F, S, R, E, (a: A) => B>) => Kind4<F, S, R, E, B>
}
/**
 * Tuple sequencing, i.e., take a tuple of monadic actions and does them from left-to-right, returning the resulting tuple.
 *
 * @example
 * import { sequenceT } from 'fp-ts/lib/Apply'
 * import { applyOption, some, none } from 'fp-ts/lib/Option'
 *
 * const sequenceTOption = sequenceT(applyOption)
 * assert.deepStrictEqual(sequenceTOption(some(1)), some([1]))
 * assert.deepStrictEqual(sequenceTOption(some(1), some('2')), some([1, '2']))
 * assert.deepStrictEqual(sequenceTOption(some(1), some('2'), none), none)
 *
 * @since 3.0.0
 */
export declare function sequenceT<F extends URIS4>(
  F: Apply4<F>
): <S, R, E, T extends Array<Kind4<F, S, R, E, any>>>(
  ...t: T & {
    readonly 0: Kind4<F, S, R, E, any>
  }
) => Kind4<
  F,
  S,
  R,
  E,
  {
    [K in keyof T]: [T[K]] extends [Kind4<F, S, R, E, infer A>] ? A : never
  }
>
export declare function sequenceT<F extends URIS3>(
  F: Apply3<F>
): <R, E, T extends Array<Kind3<F, R, E, any>>>(
  ...t: T & {
    readonly 0: Kind3<F, R, E, any>
  }
) => Kind3<
  F,
  R,
  E,
  {
    [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never
  }
>
export declare function sequenceT<F extends URIS3, E>(
  F: Apply3C<F, E>
): <R, T extends Array<Kind3<F, R, E, any>>>(
  ...t: T & {
    readonly 0: Kind3<F, R, E, any>
  }
) => Kind3<
  F,
  R,
  E,
  {
    [K in keyof T]: [T[K]] extends [Kind3<F, R, E, infer A>] ? A : never
  }
>
export declare function sequenceT<F extends URIS2>(
  F: Apply2<F>
): <E, T extends Array<Kind2<F, E, any>>>(
  ...t: T & {
    readonly 0: Kind2<F, E, any>
  }
) => Kind2<
  F,
  E,
  {
    [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never
  }
>
export declare function sequenceT<F extends URIS2, E>(
  F: Apply2C<F, E>
): <T extends Array<Kind2<F, E, any>>>(
  ...t: T & {
    readonly 0: Kind2<F, E, any>
  }
) => Kind2<
  F,
  E,
  {
    [K in keyof T]: [T[K]] extends [Kind2<F, E, infer A>] ? A : never
  }
>
export declare function sequenceT<F extends URIS>(
  F: Apply1<F>
): <T extends Array<Kind<F, any>>>(
  ...t: T & {
    readonly 0: Kind<F, any>
  }
) => Kind<
  F,
  {
    [K in keyof T]: [T[K]] extends [Kind<F, infer A>] ? A : never
  }
>
export declare function sequenceT<F>(
  F: Apply<F>
): <T extends Array<HKT<F, any>>>(
  ...t: T & {
    readonly 0: HKT<F, any>
  }
) => HKT<
  F,
  {
    [K in keyof T]: [T[K]] extends [HKT<F, infer A>] ? A : never
  }
>
declare type EnforceNonEmptyRecord<R> = keyof R extends never ? never : R
/**
 * Like `Apply.sequenceT` but works with structs instead of tuples.
 *
 * @example
 * import { applyEither, right, left } from 'fp-ts/lib/Either'
 * import { sequenceS } from 'fp-ts/lib/Apply'
 *
 * const ado = sequenceS(applyEither)
 *
 * assert.deepStrictEqual(
 *   ado({
 *     a: right(1),
 *     b: right(true)
 *   }),
 *   right({ a: 1, b: true })
 * )
 * assert.deepStrictEqual(
 *   ado({
 *     a: right(1),
 *     b: left('error')
 *   }),
 *   left('error')
 * )
 *
 * @since 3.0.0
 */
export declare function sequenceS<F extends URIS4>(
  F: Apply4<F>
): <S, R, E, NER extends Record<string, Kind4<F, S, R, E, any>>>(
  r: EnforceNonEmptyRecord<NER> & Record<string, Kind4<F, S, R, E, any>>
) => Kind4<
  F,
  S,
  R,
  E,
  {
    [K in keyof NER]: [NER[K]] extends [Kind4<F, any, any, any, infer A>] ? A : never
  }
>
export declare function sequenceS<F extends URIS3>(
  F: Apply3<F>
): <R, E, NER extends Record<string, Kind3<F, R, E, any>>>(
  r: EnforceNonEmptyRecord<NER> & Record<string, Kind3<F, R, E, any>>
) => Kind3<
  F,
  R,
  E,
  {
    [K in keyof NER]: [NER[K]] extends [Kind3<F, any, any, infer A>] ? A : never
  }
>
export declare function sequenceS<F extends URIS3, E>(
  F: Apply3C<F, E>
): <R, NER extends Record<string, Kind3<F, R, E, any>>>(
  r: EnforceNonEmptyRecord<NER> & Record<string, Kind3<F, R, E, any>>
) => Kind3<
  F,
  R,
  E,
  {
    [K in keyof NER]: [NER[K]] extends [Kind3<F, any, any, infer A>] ? A : never
  }
>
export declare function sequenceS<F extends URIS2>(
  F: Apply2<F>
): <E, NER extends Record<string, Kind2<F, E, any>>>(
  r: EnforceNonEmptyRecord<NER> & Record<string, Kind2<F, E, any>>
) => Kind2<
  F,
  E,
  {
    [K in keyof NER]: [NER[K]] extends [Kind2<F, any, infer A>] ? A : never
  }
>
export declare function sequenceS<F extends URIS2, E>(
  F: Apply2C<F, E>
): <NER extends Record<string, Kind2<F, E, any>>>(
  r: EnforceNonEmptyRecord<NER>
) => Kind2<
  F,
  E,
  {
    [K in keyof NER]: [NER[K]] extends [Kind2<F, any, infer A>] ? A : never
  }
>
export declare function sequenceS<F extends URIS>(
  F: Apply1<F>
): <NER extends Record<string, Kind<F, any>>>(
  r: EnforceNonEmptyRecord<NER>
) => Kind<
  F,
  {
    [K in keyof NER]: [NER[K]] extends [Kind<F, infer A>] ? A : never
  }
>
export declare function sequenceS<F>(
  F: Apply<F>
): <NER extends Record<string, HKT<F, any>>>(
  r: EnforceNonEmptyRecord<NER>
) => HKT<
  F,
  {
    [K in keyof NER]: [NER[K]] extends [HKT<F, infer A>] ? A : never
  }
>
/**
 * @since 3.0.0
 */
export declare function apComposition<F extends URIS2, G extends URIS2, EG>(
  F: Apply2<F>,
  G: Apply2C<G, EG>
): <EF, A>(
  fga: Kind2<F, EF, Kind2<G, EG, A>>
) => <B>(fgab: Kind2<F, EF, Kind2<G, EG, (a: A) => B>>) => Kind2<F, EF, Kind2<G, EG, B>>
export declare function apComposition<F extends URIS, G extends URIS2>(
  F: Apply1<F>,
  G: Apply2<G>
): <E, A>(fga: Kind<F, Kind2<G, E, A>>) => <B>(fgab: Kind<F, Kind2<G, E, (a: A) => B>>) => Kind<F, Kind2<G, E, B>>
export declare function apComposition<F extends URIS, G extends URIS2, E>(
  F: Apply1<F>,
  G: Apply2C<G, E>
): <A>(fga: Kind<F, Kind2<G, E, A>>) => <B>(fgab: Kind<F, Kind2<G, E, (a: A) => B>>) => Kind<F, Kind2<G, E, B>>
export declare function apComposition<F extends URIS, G extends URIS>(
  F: Apply1<F>,
  G: Apply1<G>
): <A>(fga: Kind<F, Kind<G, A>>) => <B>(fgab: Kind<F, Kind<G, (a: A) => B>>) => Kind<F, Kind<G, B>>
export declare function apComposition<F, G>(
  F: Apply<F>,
  G: Apply<G>
): <A>(fga: HKT<F, HKT<G, A>>) => <B>(fgab: HKT<F, HKT<G, (a: A) => B>>) => HKT<F, HKT<G, B>>
export {}