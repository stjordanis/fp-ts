/**
 * The `Chain` type class extends the `Apply` type class with a `chain` operation which composes computations in
 * sequence, using the return value of one computation to determine the next computation.
 *
 * Instances must satisfy the following law in addition to the `Apply` laws:
 *
 * 1. Associativity: `F.chain(F.chain(fa, afb), bfc) <-> F.chain(fa, a => F.chain(afb(a), bfc))`
 *
 * Note. `Apply`'s `ap` can be derived: `(fab, fa) => F.chain(fab, f => F.map(f, fa))`
 *
 * @since 3.0.0
 */
import { Apply, Apply1, Apply2, Apply2C, Apply3, Apply4, Apply3C } from './Apply'
import { HKT, Kind, Kind2, Kind3, Kind4, URIS, URIS2, URIS3, URIS4 } from './HKT'

/**
 * @since 3.0.0
 */
export interface Chain<F> extends Apply<F> {
  readonly chain: <A, B>(f: (a: A) => HKT<F, B>) => (fa: HKT<F, A>) => HKT<F, B>
}

/**
 * @since 3.0.0
 */
export interface Chain1<F extends URIS> extends Apply1<F> {
  readonly chain: <A, B>(f: (a: A) => Kind<F, B>) => (fa: Kind<F, A>) => Kind<F, B>
}

/**
 * @since 3.0.0
 */
export interface Chain2<F extends URIS2> extends Apply2<F> {
  readonly chain: <E, A, B>(f: (a: A) => Kind2<F, E, B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
}

/**
 * @since 3.0.0
 */
export interface Chain2C<F extends URIS2, E> extends Apply2C<F, E> {
  readonly chain: <A, B>(f: (a: A) => Kind2<F, E, B>) => (fa: Kind2<F, E, A>) => Kind2<F, E, B>
}

/**
 * @since 3.0.0
 */
export interface Chain3<F extends URIS3> extends Apply3<F> {
  readonly chain: <R, E, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}

/**
 * @since 2.2.0
 */
export interface Chain3C<F extends URIS3, E> extends Apply3C<F, E> {
  readonly chain: <R, A, B>(f: (a: A) => Kind3<F, R, E, B>) => (fa: Kind3<F, R, E, A>) => Kind3<F, R, E, B>
}

/**
 * @since 3.0.0
 */
export interface Chain4<F extends URIS4> extends Apply4<F> {
  readonly chain: <S, R, E, A, B>(
    f: (a: A) => Kind4<F, S, R, E, B>
  ) => (fa: Kind4<F, S, R, E, A>) => Kind4<F, S, R, E, B>
}
