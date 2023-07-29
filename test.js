'use strict';

require('mocha');
const assert = require('assert');
const startsWith = require('./');

describe('startsWith', () => {
  describe('error handling', () => {
    it('should throw an error when invalid args are passed', () => {
      assert.throws(() => startsWith(), /expected/);
      assert.throws(() => startsWith({}), /expected/);
      assert.throws(() => startsWith([]), /expected/);
      assert.throws(() => startsWith(null), /expected/);
    });
  });

  it('should be false when the value is an empty string', () => {
    assert(!startsWith('foo', ''));
  });

  describe('options', () => {
    describe('.nocase', () => {
      it('should be case sensitive by default', () => {
        assert(!startsWith('foo', 'FOO'));
        assert(!startsWith('FOO', 'foo'));
        assert(!startsWith('foo/bar', 'FOO/bar'));
        assert(!startsWith('FOO/bar', 'foo/bar'));
      });

      it('should not be case sensitive when options.nocase is true', () => {
        assert(startsWith('foo', 'FOO', { nocase: true }));
        assert(startsWith('FOO', 'foo', { nocase: true }));
        assert(startsWith('foo/bar', 'FOO/bar', { nocase: true }));
        assert(startsWith('FOO/bar', 'foo/bar', { nocase: true }));
      });
    });

    describe('.partialMatch', () => {
      it('should return false for partial matches by default', () => {
        assert(!startsWith('foo', 'f'));
        assert(!startsWith('foo', 'fo'));
        assert(!startsWith('foobar', 'foo'));
        assert(!startsWith('foooo', 'foo'));
        assert(!startsWith('foo.bar', 'foo'));
        assert(!startsWith('foo/bar', 'foobar'));
        assert(!startsWith('foo/bar.baz', 'foo/bar'));
        assert(!startsWith('foo/bar.baz/qux', 'foo/bar'));
        assert(!startsWith('foo/bar/bazqux', 'foo/ba'));
        assert(!startsWith('foo/bar/baz.md', 'foo/bar/baz'));
        assert(!startsWith('foo/bar/baz.md', 'foo/bar/baz.'));
        assert(!startsWith('foo/bar/baz.md', 'foo/bar/baz.m'));

        // windows paths
        assert(!startsWith('foo\\bar.baz', 'foo\\bar'));
        assert(!startsWith('foo\\bar.baz\\qux', 'foo\\bar'));
        assert(!startsWith('foo\\bar\\bazqux', 'foo\\ba'));
        assert(!startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz'));
        assert(!startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.'));
        assert(!startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.m'));
      });

      it('should allow partial matches when partialMatch is true', () => {
        const opts = { partialMatch: true };
        assert(startsWith('foo', 'f', opts));
        assert(startsWith('foo', 'fo', opts));
        assert(startsWith('foobar', 'foo', opts));
        assert(startsWith('foooo', 'foo', opts));
        assert(startsWith('foo.bar', 'foo', opts));
        assert(startsWith('foo/bar.baz', 'foo/bar', opts));
        assert(startsWith('foo/bar.baz/qux', 'foo/bar', opts));
        assert(startsWith('foo/bar/bazqux', 'foo/ba', opts));
        assert(startsWith('foo/bar/baz.md', 'foo/bar/baz', opts));
        assert(startsWith('foo/bar/baz.md', 'foo/bar/baz.', opts));
        assert(startsWith('foo/bar/baz.md', 'foo/bar/baz.m', opts));

        // windows paths
        assert(startsWith('foo\\bar.baz', 'foo\\bar', opts));
        assert(startsWith('foo\\bar.baz\\qux', 'foo\\bar', opts));
        assert(startsWith('foo\\bar\\bazqux', 'foo\\ba', opts));
        assert(startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz', opts));
        assert(startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.', opts));
        assert(startsWith('foo\\bar\\baz.md', 'foo\\bar\\baz.m', opts));
      });
    });
  });

  describe('starts with', () => {
    it('should be true when path starts with substring', () => {
      assert(!startsWith('.foo', 'foo'));
      assert(!startsWith('foo', '.foo'));
      assert(!startsWith('foo', 'foo.md'));
      assert(!startsWith('foo.md', 'baz.md'));
      assert(!startsWith('foo.md', 'foo'));
      assert(!startsWith('foo/bar', 'bar'));
      assert(!startsWith('foo/bar', 'bar.md'));
      assert(!startsWith('foo', 'foo/'));
      assert(startsWith('foo', 'foo'));
      assert(startsWith('foo/', 'foo/'));
      assert(startsWith('foo/', 'foo'));
      assert(startsWith('foo/bar/baz', 'foo'));
      assert(startsWith('foo/bar/baz', 'foo/bar'));
      assert(startsWith('foo/bar/baz', 'foo/bar/baz'));

      // windows paths
      assert(!startsWith('foo', 'foo\\'));
      assert(startsWith('foo/', 'foo\\'));
      assert(startsWith('foo/bar/baz', 'foo\\bar'));
      assert(startsWith('foo/bar/baz', 'foo\\bar\\baz'));

      assert(!startsWith('foo\\bar', 'bar'));
      assert(!startsWith('foo\\bar', 'bar.md'));
      assert(startsWith('foo\\', 'foo/'));
      assert(startsWith('foo\\', 'foo'));
      assert(startsWith('foo\\bar/baz', 'foo'));
      assert(startsWith('foo\\bar/baz', 'foo/bar'));
      assert(startsWith('foo\\bar/baz', 'foo/bar/baz'));

      assert(!startsWith('foo\\bar', 'bar'));
      assert(!startsWith('foo\\bar', 'bar.md'));
      assert(!startsWith('foo', 'foo\\'));
      assert(startsWith('foo', 'foo'));
      assert(startsWith('foo\\', 'foo\\'));
      assert(startsWith('foo\\', 'foo'));
      assert(startsWith('foo\\bar\\baz', 'foo'));
      assert(startsWith('foo\\bar\\baz', 'foo\\bar'));
      assert(startsWith('foo\\bar\\baz', 'foo\\bar\\baz'));
    });
  });

  describe('negation', () => {
    it('should be false when path starts with negated substring', () => {
      assert(startsWith('.foo', '!foo'));
      assert(startsWith('foo', '!.foo'));
      assert(startsWith('foo', '!foo.md'));
      assert(startsWith('foo.md', '!baz.md'));
      assert(startsWith('foo.md', '!foo'));
      assert(startsWith('foo/bar', '!bar'));
      assert(startsWith('foo/bar', '!bar.md'));
      assert(startsWith('foo', '!foo/'));
      assert(!startsWith('foo', '!foo'));
      assert(!startsWith('foo/', '!foo/'));
      assert(!startsWith('foo/', '!foo'));
      assert(!startsWith('foo/bar/baz', '!foo'));
      assert(!startsWith('foo/bar/baz', '!foo/bar'));
      assert(!startsWith('foo/bar/baz', '!foo/bar/baz'));

      // windows paths
      assert(startsWith('foo', '!foo\\'));
      assert(!startsWith('foo/', '!foo\\'));
      assert(!startsWith('foo/bar/baz', '!foo\\bar'));
      assert(!startsWith('foo/bar/baz', '!foo\\bar\\baz'));

      assert(startsWith('foo\\bar', '!bar'));
      assert(startsWith('foo\\bar', '!bar.md'));
      assert(!startsWith('foo\\', '!foo/'));
      assert(!startsWith('foo\\', '!foo'));
      assert(!startsWith('foo\\bar/baz', '!foo'));
      assert(!startsWith('foo\\bar/baz', '!foo/bar'));
      assert(!startsWith('foo\\bar/baz', '!foo/bar/baz'));

      assert(startsWith('foo\\bar', '!bar'));
      assert(startsWith('foo\\bar', '!bar.md'));
      assert(startsWith('foo', '!foo\\'));
      assert(!startsWith('foo', '!foo'));
      assert(!startsWith('foo\\', '!foo\\'));
      assert(!startsWith('foo\\', '!foo'));
      assert(!startsWith('foo\\bar\\baz', '!foo'));
      assert(!startsWith('foo\\bar\\baz', '!foo\\bar'));
      assert(!startsWith('foo\\bar\\baz', '!foo\\bar\\baz'));
    });
  });

  describe('path begins with string', () => {
    it('should strip leading "./" from path', () => {
      assert(!startsWith('./foo/bar/baz', './bar'));
      assert(!startsWith('./foo/bar/baz', 'bar'));
      assert(startsWith('./foo/bar/baz', './foo'));
      assert(startsWith('./foo/bar/baz', './foo/bar'));
      assert(startsWith('./foo/bar/baz', 'foo/bar'));
      assert(startsWith('./foo/bar/baz', 'foo'));
      assert(startsWith('./foo/bar/baz', 'foo/bar'));

      // windows paths
      assert(!startsWith('./foo/bar/baz', '.\\bar'));
      assert(!startsWith('./foo/bar/baz', 'bar'));
      assert(startsWith('./foo/bar/baz', '.\\foo'));
      assert(startsWith('./foo/bar/baz', '.\\foo\\bar'));
      assert(startsWith('./foo/bar/baz', 'foo\\bar'));
      assert(startsWith('./foo/bar/baz', 'foo\\bar'));

      assert(!startsWith('.\\foo\\bar\\baz', './bar'));
      assert(!startsWith('.\\foo\\bar\\baz', 'bar'));
      assert(startsWith('.\\foo\\bar\\baz', './foo'));
      assert(startsWith('.\\foo\\bar\\baz', './foo/bar'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo/bar'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo/bar'));

      assert(!startsWith('.\\foo\\bar\\baz', '.\\bar'));
      assert(!startsWith('.\\foo\\bar\\baz', 'bar'));
      assert(startsWith('.\\foo\\bar\\baz', '.\\foo'));
      assert(startsWith('.\\foo\\bar\\baz', '.\\foo\\bar'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo\\bar'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo'));
      assert(startsWith('.\\foo\\bar\\baz', 'foo\\bar'));
    });

    it('should strip leading "./" from substring', () => {
      assert(!startsWith('./foo/bar/baz', './bar'));
      assert(!startsWith('foo/bar/baz', './bar'));
      assert(!startsWith('./.foo', './foo'));
      assert(!startsWith('./foo', './.foo'));
      assert(startsWith('./foo', './foo'));
      assert(startsWith('./.foo', './.foo'));
      assert(startsWith('./foo/bar', './foo'));
      assert(startsWith('./foo/bar/baz', './foo'));
      assert(startsWith('./foo/bar/baz', './foo'));

      // windows paths
      assert(!startsWith('.\\foo\\bar\\baz', '.\\bar'));
      assert(!startsWith('foo\\bar\\baz', '.\\bar'));
      assert(!startsWith('.\\.foo', '.\\foo'));
      assert(!startsWith('.\\foo', '.\\.foo'));
      assert(startsWith('.\\foo', '.\\foo'));
      assert(startsWith('.\\.foo', '.\\.foo'));
      assert(startsWith('.\\foo\\bar', '.\\foo'));
      assert(startsWith('.\\foo\\bar\\baz', '.\\foo'));
      assert(startsWith('.\\foo\\bar\\baz', '.\\foo'));
    });
  });

  describe('prefixed with "/"', () => {
    it('should match leading slashes', () => {
      assert(!startsWith('./bar/baz/qux', '/bar'));
      assert(!startsWith('./foo/bar/baz', '/foo/bar'));
      assert(!startsWith('/bar/baz/qux', './bar'));
      assert(!startsWith('/foo/bar/baz', './bar'));
      assert(!startsWith('/foo/bar/baz', '/foo/'));
      assert(!startsWith('/foo/bar/baz', 'foo/bar'));
      assert(!startsWith('bar/baz/qux', '/bar'));
      assert(!startsWith('foo/bar/baz', '/baz'));

      assert(startsWith('/', '/'));
      assert(startsWith('//', '//'));
      assert(startsWith('//foo', '//'));
      assert(startsWith('//foo', '//foo'));
      assert(startsWith('//foo/bar', '//foo/bar'));
      assert(startsWith('/bar/baz/qux', '/bar'));
      assert(startsWith('/foo/', '/'));
      assert(startsWith('/foo/bar/baz', '/foo'));
      assert(startsWith('/foo/bar/baz', '/foo/bar'));

      // windows paths
      assert(!startsWith('.\\bar\\baz\\qux', '\\bar'));
      assert(!startsWith('.\\foo\\bar\\baz', '\\foo\\bar'));
      assert(!startsWith('\\bar\\baz\\qux', '.\\bar'));
      assert(!startsWith('\\foo\\bar\\baz', '.\\bar'));
      assert(!startsWith('\\foo\\bar\\baz', '\\foo\\'));
      assert(!startsWith('\\foo\\bar\\baz', 'foo\\bar'));
      assert(!startsWith('bar\\baz\\qux', '\\bar'));
      assert(!startsWith('foo\\bar\\baz', '\\baz'));

      assert(startsWith('/', '\\'));
      assert(startsWith('//', '\\\\'));
      assert(startsWith('//foo', '\\\\'));
      assert(startsWith('//foo', '\\\\foo'));
      assert(startsWith('//foo/bar', '\\\\foo/bar'));
      assert(startsWith('/bar/baz/qux', '\\bar'));
      assert(startsWith('/foo/', '\\'));
      assert(startsWith('/foo/bar/baz', '\\foo'));
      assert(startsWith('/foo/bar/baz', '\\foo/bar'));

      assert(startsWith('\\', '/'));
      assert(startsWith('\\\\', '//'));
      assert(startsWith('\\\\foo', '//'));
      assert(startsWith('\\\\foo', '//foo'));
      assert(startsWith('\\\\foo\\bar', '//foo/bar'));
      assert(startsWith('\\bar\\baz\\qux', '/bar'));
      assert(startsWith('\\foo\\', '/'));
      assert(startsWith('\\foo\\bar\\baz', '/foo'));
      assert(startsWith('\\foo\\bar\\baz', '/foo/bar'));

      assert(startsWith('\\', '\\'));
      assert(startsWith('\\\\', '\\\\'));
      assert(startsWith('\\\\foo', '\\\\'));
      assert(startsWith('\\\\foo', '\\\\foo'));
      assert(startsWith('\\\\foo\\bar', '\\\\foo\\bar'));
      assert(startsWith('\\bar\\baz\\qux', '\\bar'));
      assert(startsWith('\\foo\\', '\\'));
      assert(startsWith('\\foo\\bar\\baz', '\\foo'));
      assert(startsWith('\\foo\\bar\\baz', '\\foo\\bar'));
    });

    it('should not match when fewer leading slashes than expected', () => {
      assert(!startsWith('//foo', '////foo'));
      assert(!startsWith('/foo', '//'));
      assert(!startsWith('/foo/', '//'));
      assert(!startsWith('/foo/', '///'));

      // windows paths
      assert(!startsWith('//foo', '\\\\\\\\foo'));
      assert(!startsWith('/foo', '\\\\'));
      assert(!startsWith('/foo/', '\\\\'));
      assert(!startsWith('/foo/', '\\\\\\'));

      assert(!startsWith('\\\\foo', '////foo'));
      assert(!startsWith('\\foo', '//'));
      assert(!startsWith('\\foo/', '//'));
      assert(!startsWith('\\foo/', '///'));

      assert(!startsWith('\\\\foo', '\\\\\\\\foo'));
      assert(!startsWith('\\foo', '\\\\'));
      assert(!startsWith('\\foo\\', '\\\\'));
      assert(!startsWith('\\foo\\', '\\\\\\'));
    });

    it('should not match when more leading slashes than expected', () => {
      assert(!startsWith('//foo', '/'));
      assert(!startsWith('//foo', '/foo'));
      assert(!startsWith('///foo', '/foo'));
      assert(!startsWith('////foo', '//foo'));

      // windows paths
      assert(!startsWith('//foo', '\\'));
      assert(!startsWith('//foo', '\\foo'));
      assert(!startsWith('///foo', '\\foo'));
      assert(!startsWith('////foo', '\\\\foo'));

      assert(!startsWith('\\\\foo', '/'));
      assert(!startsWith('\\\\foo', '/foo'));
      assert(!startsWith('\\\\\\foo', '/foo'));
      assert(!startsWith('\\\\\\\\foo', '//foo'));

      assert(!startsWith('\\\\foo', '\\'));
      assert(!startsWith('\\\\foo', '\\foo'));
      assert(!startsWith('\\\\\\foo', '\\foo'));
      assert(!startsWith('\\\\\\\\foo', '\\\\foo'));
    });

    it('should be false for partial matches', () => {
      assert(!startsWith('//foobar', '//f'));
      assert(!startsWith('//foobar', '//fo'));
      assert(!startsWith('//foobar', '//foo'));
      assert(!startsWith('//foo.bar', '//foo'));
      assert(!startsWith('//foo', '//foobar'));

      // windows paths
      assert(!startsWith('//foobar', '\\\\f'));
      assert(!startsWith('//foobar', '\\\\fo'));
      assert(!startsWith('//foobar', '\\\\foo'));
      assert(!startsWith('//foo.bar', '\\\\foo'));
      assert(!startsWith('//foo', '\\\\foobar'));

      assert(!startsWith('\\\\foobar', '//f'));
      assert(!startsWith('\\\\foobar', '//fo'));
      assert(!startsWith('\\\\foobar', '//foo'));
      assert(!startsWith('\\\\foo.bar', '//foo'));
      assert(!startsWith('\\\\foo', '//foobar'));

      assert(!startsWith('\\\\foobar', '\\\\f'));
      assert(!startsWith('\\\\foobar', '\\\\fo'));
      assert(!startsWith('\\\\foobar', '\\\\foo'));
      assert(!startsWith('\\\\foo.bar', '\\\\foo'));
      assert(!startsWith('\\\\foo', '\\\\foobar'));
    });
  });

  describe('windows drive letters', () => {
    it('should match paths that start with windows drive letters', () => {
      assert(startsWith('C:', 'C:'));
      assert(startsWith('C:/', 'C:/'));
      assert(startsWith('C:/foo', 'C:'));
      assert(startsWith('C:/foo', 'C:/'));
      assert(startsWith('C:/foo', 'C:/foo'));
      assert(!startsWith('C:/foo', 'A:/'));
      assert(startsWith('C:/foo/bar', 'C:/foo'));
      assert(!startsWith('C:/foo/bar', 'C:/bar'));
      assert(!startsWith('C:/foo/bar', 'foo/bar'));

      assert(startsWith('C:/', 'C:\\'));
      assert(startsWith('C:/foo', 'C:\\'));
      assert(startsWith('C:/foo', 'C:\\foo'));
      assert(startsWith('C:/foo/bar', 'C:\\foo'));
      assert(!startsWith('C:/foo/bar', 'C:\\bar'));
      assert(!startsWith('C:/foo/bar', 'foo\\bar'));

      assert(startsWith('C:', 'C:'));
      assert(startsWith('C:\\', 'C:/'));
      assert(startsWith('C:\\foo', 'C:'));
      assert(startsWith('C:\\foo', 'C:/'));
      assert(startsWith('C:\\foo', 'C:/foo'));
      assert(startsWith('C:\\foo\\bar', 'C:/foo'));
      assert(!startsWith('C:\\foo\\bar', 'C:/bar'));
      assert(!startsWith('C:\\foo\\bar', 'foo/bar'));

      assert(startsWith('C:', 'C:'));
      assert(startsWith('C:\\', 'C:\\'));
      assert(startsWith('C:\\foo', 'C:'));
      assert(startsWith('C:\\foo', 'C:\\'));
      assert(startsWith('C:\\foo', 'C:\\foo'));
      assert(startsWith('C:\\foo\\bar', 'C:\\foo'));
      assert(!startsWith('C:\\foo\\bar', 'C:\\bar'));
      assert(!startsWith('C:\\foo\\bar', 'foo\\bar'));
    });

    it('should be false for partial matches', () => {
      assert(!startsWith('C:/foobar', 'C:/f'));
      assert(!startsWith('C:/foobar', 'C:/fo'));
      assert(!startsWith('C:/foobar', 'C:/foo'));
      assert(!startsWith('C:/foo.bar', 'C:/foo'));
      assert(!startsWith('C:/foo', 'C:/foobar'));

      assert(!startsWith('C:\\foobar', 'C:\\f'));
      assert(!startsWith('C:\\foobar', 'C:\\fo'));
      assert(!startsWith('C:\\foobar', 'C:\\foo'));
      assert(!startsWith('C:\\foo.bar', 'C:\\foo'));
      assert(!startsWith('C:\\foo', 'C:\\foobar'));
      assert(!startsWith('C:\\foo', 'CC:\\foo'));
    });
  });
});
