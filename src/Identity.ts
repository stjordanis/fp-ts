/**
 * @since 2.0.0
 */
import { Alt1 } from './Alt'
import { Applicative } from './Applicative'
import { Comonad1 } from './Comonad'
import { Eq } from './Eq'
import { Foldable1 } from './Foldable'
import { identity as id, pipe } from './function'
import { HKT } from './HKT'
import { Monad1 } from './Monad'
import { Monoid } from './Monoid'
import { Show } from './Show'
import { Traversable1 } from './Traversable'

declare module './HKT' {
  interface URItoKind<A> {
    readonly Identity: Identity<A>
  }
}

/**
 * @since 2.0.0
 */
export const URI = 'Identity'

/**
 * @since 2.0.0
 */
export type URI = typeof URI

/**
 * @since 2.0.0
 */
export type Identity<A> = A

/**
 * @since 2.0.0
 */
export const getShow: <A>(S: Show<A>) => Show<Identity<A>> = id

/**
 * @since 2.0.0
 */
export const getEq: <A>(E: Eq<A>) => Eq<Identity<A>> = id

// -------------------------------------------------------------------------------------
// pipeables
// -------------------------------------------------------------------------------------

const alt_: <A>(fx: A, fy: () => A) => A = id

const extend_: <A, B>(wa: A, f: (wa: A) => B) => B = (wa, f) => f(wa)

const reduce_: <A, B>(fa: Identity<A>, b: B, f: (b: B, a: A) => B) => B = (fa, b, f) => f(b, fa)

const foldMap_: <M>(M: Monoid<M>) => <A>(fa: Identity<A>, f: (a: A) => M) => M = (_) => (fa, f) => f(fa)

const reduceRight_: <A, B>(fa: Identity<A>, b: B, f: (a: A, b: B) => B) => B = (fa, b, f) => f(fa, b)

const traverse_ = <F>(F: Applicative<F>) => <A, B>(ta: Identity<A>, f: (a: A) => HKT<F, B>): HKT<F, Identity<B>> => {
  return pipe(f(ta), F.map(id))
}

const sequence_ = <F>(F: Applicative<F>) => <A>(ta: Identity<HKT<F, A>>): HKT<F, Identity<A>> => {
  return pipe(ta, F.map(id))
}

/**
 * @since 2.0.0
 */
export const alt: <A>(that: () => Identity<A>) => (fa: Identity<A>) => Identity<A> = (that) => (fa) => alt_(fa, that)

/**
 * @since 2.0.0
 */
export const ap: <A>(fa: Identity<A>) => <B>(fab: Identity<(a: A) => B>) => Identity<B> = (fa) => (fab) => fab(fa)

/**
 * @since 2.0.0
 */
export const apFirst: <B>(fb: Identity<B>) => <A>(fa: Identity<A>) => Identity<A> = (fb) => (fa) =>
  pipe(
    fa,
    map((a) => () => a),
    ap(fb)
  )

/**
 * @since 2.0.0
 */
export const apSecond = <B>(fb: Identity<B>) => <A>(fa: Identity<A>): Identity<B> =>
  pipe(
    fa,
    map(() => (b: B) => b),
    ap(fb)
  )

/**
 * @since 2.0.0
 */
export const chain: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<B> = (f) => (ma) => f(ma)

/**
 * @since 2.0.0
 */
export const chainFirst: <A, B>(f: (a: A) => Identity<B>) => (ma: Identity<A>) => Identity<A> = (f) => (ma) =>
  pipe(
    ma,
    chain((a) =>
      pipe(
        f(a),
        map(() => a)
      )
    )
  )

/**
 * @since 2.0.0
 */
export const duplicate: <A>(ma: Identity<A>) => Identity<Identity<A>> = (wa) => extend_(wa, id)

/**
 * @since 2.6.2
 */
export const extract: <A>(wa: Identity<A>) => A = id

/**
 * @since 2.0.0
 */
export const extend: <A, B>(f: (wa: Identity<A>) => B) => (wa: Identity<A>) => Identity<B> = (f) => (ma) =>
  extend_(ma, f)

/**
 * @since 2.0.0
 */
export const flatten: <A>(mma: Identity<Identity<A>>) => Identity<A> = chain(id)

/**
 * @since 2.0.0
 */
export const foldMap: <M>(M: Monoid<M>) => <A>(f: (a: A) => M) => (fa: Identity<A>) => M = (M) => {
  const foldMapM = foldMap_(M)
  return (f) => (fa) => foldMapM(fa, f)
}

/**
 * @since 2.0.0
 */
export const map: <A, B>(f: (a: A) => B) => (fa: Identity<A>) => Identity<B> = (f) => (fa) => f(fa)

/**
 * @since 2.0.0
 */
export const reduce: <A, B>(b: B, f: (b: B, a: A) => B) => (fa: Identity<A>) => B = (b, f) => (fa) => reduce_(fa, b, f)

/**
 * @since 2.0.0
 */
export const reduceRight: <A, B>(b: B, f: (a: A, b: B) => B) => (fa: Identity<A>) => B = (b, f) => (fa) =>
  reduceRight_(fa, b, f)

// -------------------------------------------------------------------------------------
// instances
// -------------------------------------------------------------------------------------

/**
 * @internal
 */
export const monadIdentity: Monad1<URI> = {
  URI,
  map,
  of: id,
  ap,
  chain
}

/**
 * @since 2.0.0
 */
export const identity: Monad1<URI> & Foldable1<URI> & Traversable1<URI> & Alt1<URI> & Comonad1<URI> = {
  URI,
  map,
  of: id,
  ap,
  chain,
  reduce: reduce_,
  foldMap: foldMap_,
  reduceRight: reduceRight_,
  traverse: traverse_,
  sequence: sequence_,
  alt: alt_,
  extract,
  extend: extend_
}
