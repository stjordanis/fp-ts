import * as assert from 'assert'
import * as _ from '../src/ReadonlyRecord'
import { semigroupSum, getLastSemigroup, getFirstSemigroup } from '../src/Semigroup'
import { monoidString } from '../src/Monoid'
import { identity } from '../src/function'
import { option, some, none, Option, getOrElse, isSome } from '../src/Option'
import { eqNumber } from '../src/Eq'
import { readonlyArray, zip } from '../src/ReadonlyArray'
import { left, right } from '../src/Either'
import * as I from '../src/Identity'
import { showString } from '../src/Show'
import { pipe } from '../src/pipeable'

const p = (n: number) => n > 2

const noPrototype = Object.create(null)

describe('ReadonlyRecord', () => {
  describe('pipeables', () => {
    it('map', () => {
      const double = (n: number): number => n * 2
      assert.deepStrictEqual(pipe({ k1: 1, k2: 2 }, _.map(double)), { k1: 2, k2: 4 })
      assert.deepStrictEqual(pipe({ a: 1, b: 2 }, _.map(double)), { a: 2, b: 4 })
    })

    it('reduce', () => {
      assert.deepStrictEqual(
        pipe(
          { k1: 'a', k2: 'b' },
          _.reduce('', (b, a) => b + a)
        ),
        'ab'
      )
      assert.deepStrictEqual(
        pipe(
          { k2: 'b', k1: 'a' },
          _.reduce('', (b, a) => b + a)
        ),
        'ab'
      )
    })

    it('foldMap', () => {
      assert.deepStrictEqual(pipe({ a: 'a', b: 'b' }, _.foldMap(monoidString)(identity)), 'ab')
    })

    it('reduceRight', () => {
      const f = (a: string, acc: string) => acc + a
      assert.deepStrictEqual(pipe({ a: 'a', b: 'b' }, _.reduceRight('', f)), 'ba')
    })

    it('compact', () => {
      assert.deepStrictEqual(_.compact({ foo: none, bar: some(123) }), { bar: 123 })
    })

    it('separate', () => {
      assert.deepStrictEqual(_.separate({ foo: left(123), bar: right(123) }), {
        left: { foo: 123 },
        right: { bar: 123 }
      })
    })

    it('filter', () => {
      const d = { a: 1, b: 3 }
      assert.deepStrictEqual(pipe(d, _.filter(p)), { b: 3 })

      // refinements
      const isNumber = (u: string | number): u is number => typeof u === 'number'
      const y: _.ReadonlyRecord<string, string | number> = { a: 1, b: 'foo' }
      const actual = pipe(y, _.filter(isNumber))
      assert.deepStrictEqual(actual, { a: 1 })
      assert.deepStrictEqual(
        pipe(
          y,
          _.filter((_) => true)
        ),
        y
      )

      const x = Object.assign(Object.create({ c: true }), { a: 1, b: 'foo' })
      assert.deepStrictEqual(pipe(x, _.filter(isNumber)), { a: 1 })
      assert.deepStrictEqual(pipe(noPrototype, _.filter(isNumber)), noPrototype)
    })

    it('filterMap', () => {
      const f = (n: number) => (p(n) ? some(n + 1) : none)
      assert.deepStrictEqual(pipe({}, _.filterMap(f)), {})
      assert.deepStrictEqual(pipe({ a: 1, b: 3 }, _.filterMap(f)), { b: 4 })
    })

    it('partition', () => {
      assert.deepStrictEqual(pipe({}, _.partition(p)), { left: {}, right: {} })
      assert.deepStrictEqual(pipe({ a: 1, b: 3 }, _.partition(p)), {
        left: { a: 1 },
        right: { b: 3 }
      })
    })

    it('partitionMap', () => {
      const f = (n: number) => (p(n) ? right(n + 1) : left(n - 1))
      assert.deepStrictEqual(pipe({}, _.partitionMap(f)), { left: {}, right: {} })
      assert.deepStrictEqual(pipe({ a: 1, b: 3 }, _.partitionMap(f)), {
        left: { a: 0 },
        right: { b: 4 }
      })
    })

    it('reduceWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { k1: 'a', k2: 'b' },
          _.reduceWithIndex('', (k, b, a) => b + k + a)
        ),
        'k1ak2b'
      )
      assert.deepStrictEqual(
        pipe(
          { k2: 'b', k1: 'a' },
          _.reduceWithIndex('', (k, b, a) => b + k + a)
        ),
        'k1ak2b'
      )
    })

    it('foldMapWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { k1: 'a', k2: 'b' },
          _.foldMapWithIndex(monoidString)((k, a) => k + a)
        ),
        'k1ak2b'
      )
    })

    it('reduceRightWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { k1: 'a', k2: 'b' },
          _.reduceRightWithIndex('', (k, a, b) => b + k + a)
        ),
        'k2bk1a'
      )
    })

    it('partitionMapWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { a: 1, b: 2 },
          _.partitionMapWithIndex((k, a: number) => (a > 1 ? right(a) : left(k)))
        ),
        {
          left: { a: 'a' },
          right: { b: 2 }
        }
      )
    })

    it('partitionWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { a: 1, b: 2 },
          _.partitionWithIndex((_, a: number) => a > 1)
        ),
        {
          left: { a: 1 },
          right: { b: 2 }
        }
      )
    })

    it('filterMapWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { a: 1, b: 2 },
          _.filterMapWithIndex((_, a: number) => (a > 1 ? some(a) : none))
        ),
        { b: 2 }
      )
    })

    it('filterWithIndex', () => {
      assert.deepStrictEqual(
        pipe(
          { a: 1, b: 2 },
          _.filterWithIndex((_, a: number) => a > 1)
        ),
        { b: 2 }
      )
    })
  })

  it('getMonoid', () => {
    const d1 = { k1: 1, k2: 3 }
    const d2 = { k2: 2, k3: 4 }
    const M = _.getMonoid(semigroupSum)
    assert.deepStrictEqual(M.concat(d1, d2), { k1: 1, k2: 5, k3: 4 })
    assert.deepStrictEqual(M.concat(d1, M.empty), d1)
    assert.deepStrictEqual(M.concat(M.empty, d2), d2)
    assert.deepStrictEqual(M.concat(d1, {}), d1)
  })

  it('traverse', () => {
    assert.deepStrictEqual(
      _.traverse(option)((n: number) => (n <= 2 ? some(n) : none))({ k1: 1, k2: 2 }),
      some({ k1: 1, k2: 2 })
    )
    assert.deepStrictEqual(_.traverse(option)((n: number) => (n >= 2 ? some(n) : none))({ k1: 1, k2: 2 }), none)
  })

  it('sequence', () => {
    const sequence = _.sequence(option)
    const x1 = { k1: some(1), k2: some(2) }
    assert.deepStrictEqual(sequence(x1), some({ k1: 1, k2: 2 }))
    const x2 = { k1: none, k2: some(2) }
    assert.deepStrictEqual(sequence(x2), none)
  })

  it('getEq', () => {
    assert.deepStrictEqual(_.getEq(eqNumber).equals({ a: 1 }, { a: 1 }), true)
    assert.deepStrictEqual(_.getEq(eqNumber).equals({ a: 1 }, { a: 2 }), false)
    assert.deepStrictEqual(_.getEq(eqNumber).equals({ a: 1 }, { b: 1 }), false)
    assert.deepStrictEqual(_.getEq(eqNumber).equals(noPrototype, { b: 1 }), false)
  })

  it('lookup', () => {
    assert.deepStrictEqual(_.lookup('a', { a: 1 }), some(1))
    assert.deepStrictEqual(_.lookup('b', { a: 1 }), none)
    assert.deepStrictEqual(_.lookup('b', noPrototype), none)
  })

  it('fromFoldable', () => {
    const First = getFirstSemigroup<number>()
    assert.deepStrictEqual(_.fromFoldable(First, readonlyArray)([['a', 1]]), { a: 1 })
    assert.deepStrictEqual(
      _.fromFoldable(
        First,
        readonlyArray
      )([
        ['a', 1],
        ['a', 2]
      ]),
      {
        a: 1
      }
    )
    const Last = getLastSemigroup<number>()
    assert.deepStrictEqual(
      _.fromFoldable(
        Last,
        readonlyArray
      )([
        ['a', 1],
        ['a', 2]
      ]),
      {
        a: 2
      }
    )
  })

  it('toReadonlyArray', () => {
    assert.deepStrictEqual(_.toReadonlyArray({ a: 1, b: 2 }), [
      ['a', 1],
      ['b', 2]
    ])
    assert.deepStrictEqual(_.toReadonlyArray({ b: 2, a: 1 }), [
      ['a', 1],
      ['b', 2]
    ])
  })

  it('toUnfoldable', () => {
    assert.deepStrictEqual(_.toUnfoldable(readonlyArray)({ a: 1 }), [['a', 1]])
  })

  it('traverseWithIndex', () => {
    const d1 = { k1: 1, k2: 2 }
    const t1 = _.traverseWithIndex(option)((k, n: number): Option<number> => (k !== 'k1' ? some(n) : none))(d1)
    assert.deepStrictEqual(t1, none)
    const t2 = _.traverseWithIndex(option)((): Option<number> => none)(_.empty)
    assert.deepStrictEqual(getOrElse((): _.ReadonlyRecord<string, number> => _.empty)(t2), _.empty)
  })

  it('size', () => {
    assert.deepStrictEqual(_.size({}), 0)
    assert.deepStrictEqual(_.size({ a: 1 }), 1)
  })

  it('isEmpty', () => {
    assert.deepStrictEqual(_.isEmpty({}), true)
    assert.deepStrictEqual(_.isEmpty({ a: 1 }), false)
  })

  it('insertAt', () => {
    assert.deepStrictEqual(_.insertAt('a', 1)({}), { a: 1 })
    assert.deepStrictEqual(_.insertAt('c', 3)({ a: 1, b: 2 }), { a: 1, b: 2, c: 3 })
    // should return the same reference if the value is already there
    const x = { a: 1 }
    assert.deepStrictEqual(_.insertAt('a', 1)(x), x)
  })

  it('deleteAt', () => {
    assert.deepStrictEqual(_.deleteAt('a')({ a: 1, b: 2 }), { b: 2 })
    // should return the same reference if the key is missing
    const x = { a: 1 }
    assert.deepStrictEqual(_.deleteAt('b')(x), x)
    assert.deepStrictEqual(_.deleteAt('b')(noPrototype), noPrototype)
  })

  it('pop', () => {
    assert.deepStrictEqual(_.pop('a')({ a: 1, b: 2 }), some([1, { b: 2 }]))
    assert.deepStrictEqual(_.pop('c')({ a: 1, b: 2 }), none)
  })

  it('wither', () => {
    const witherIdentity = _.readonlyRecord.wither(I.identity)
    const f = (n: number) => I.identity.of(p(n) ? some(n + 1) : none)
    assert.deepStrictEqual(witherIdentity({}, f), I.identity.of<_.ReadonlyRecord<string, number>>({}))
    assert.deepStrictEqual(witherIdentity({ a: 1, b: 3 }, f), I.identity.of({ b: 4 }))
  })

  it('wilt', () => {
    const wiltIdentity = _.readonlyRecord.wilt(I.identity)
    const f = (n: number) => I.identity.of(p(n) ? right(n + 1) : left(n - 1))
    assert.deepStrictEqual(wiltIdentity({}, f), I.identity.of({ left: {}, right: {} }))
    assert.deepStrictEqual(wiltIdentity({ a: 1, b: 3 }, f), I.identity.of({ left: { a: 0 }, right: { b: 4 } }))
  })

  it('every', () => {
    const x: _.ReadonlyRecord<string, number> = { a: 1, b: 2 }
    const y: _.ReadonlyRecord<string, number> = { a: 1, b: 2 }
    assert.deepStrictEqual(_.every((n: number) => n <= 2)(x), true)
    assert.deepStrictEqual(_.every((n: number) => n <= 1)(y), false)
  })

  it('some', () => {
    const x: _.ReadonlyRecord<string, number> = { a: 1, b: 2 }
    const y: _.ReadonlyRecord<string, number> = { a: 1, b: 2 }
    assert.deepStrictEqual(_.some((n: number) => n <= 1)(x), true)
    assert.deepStrictEqual(_.some((n: number) => n <= 0)(y), false)
  })

  it('elem', () => {
    assert.deepStrictEqual(_.elem(eqNumber)(1, { a: 1, b: 2 }), true)
    assert.deepStrictEqual(_.elem(eqNumber)(3, { a: 1, b: 2 }), false)
  })

  it('fromFoldableMap', () => {
    const zipObject = <K extends string, A>(keys: ReadonlyArray<K>, values: ReadonlyArray<A>): _.ReadonlyRecord<K, A> =>
      _.fromFoldableMap(getLastSemigroup<A>(), readonlyArray)(zip(keys, values), identity)

    assert.deepStrictEqual(zipObject(['a', 'b'], [1, 2, 3]), { a: 1, b: 2 })

    interface User {
      readonly id: string
      readonly name: string
    }

    const users: ReadonlyArray<User> = [
      { id: 'id1', name: 'name1' },
      { id: 'id2', name: 'name2' },
      { id: 'id1', name: 'name3' }
    ]

    assert.deepStrictEqual(
      _.fromFoldableMap(getLastSemigroup<User>(), readonlyArray)(users, (user) => [user.id, user]),
      {
        id1: { id: 'id1', name: 'name3' },
        id2: { id: 'id2', name: 'name2' }
      }
    )
  })

  it('getShow', () => {
    const S = _.getShow(showString)
    assert.deepStrictEqual(S.show({}), `{}`)
    assert.deepStrictEqual(S.show({ a: 'a' }), `{ "a": "a" }`)
    assert.deepStrictEqual(S.show({ a: 'a', b: 'b' }), `{ "a": "a", "b": "b" }`)
  })

  it('singleton', () => {
    assert.deepStrictEqual(_.singleton('a', 1), { a: 1 })
  })

  it('hasOwnProperty', () => {
    const x: _.ReadonlyRecord<string, number> = { a: 1 }
    assert.deepStrictEqual(_.hasOwnProperty('a', x), true)
    assert.deepStrictEqual(_.hasOwnProperty('b', x), false)
  })

  it('updateAt', () => {
    const x: _.ReadonlyRecord<string, number> = { a: 1 }
    assert.deepStrictEqual(_.updateAt('b', 2)(x), none)
    assert.deepStrictEqual(_.updateAt('a', 2)(x), some({ a: 2 }))
    const r = _.updateAt('a', 1)(x)
    if (isSome(r)) {
      assert.deepStrictEqual(r.value, x)
    } else {
      assert.fail()
    }
  })

  it('modifyAt', () => {
    const x: _.ReadonlyRecord<string, number> = { a: 1 }
    assert.deepStrictEqual(_.modifyAt('b', (n: number) => n * 2)(x), none)
    assert.deepStrictEqual(_.modifyAt('a', (n: number) => n * 2)(x), some({ a: 2 }))
  })

  it('fromRecord', () => {
    const as = { a: 1, b: 2 }
    const bs = _.fromRecord(as)
    assert.deepStrictEqual(bs, as)
    assert.notStrictEqual(bs, as)
  })

  it('toRecord', () => {
    const as: _.ReadonlyRecord<string, number> = { a: 1, b: 2 }
    const bs = _.toRecord(as)
    assert.deepStrictEqual(bs, as)
    assert.notStrictEqual(bs, as)
  })
})
